/**
 * OpenAI 聊天历史本地持久化（IndexedDB）。
 *
 * - 一轮对话 = 一条用户消息 + 其后紧邻的助手消息（直到下一条用户消息）
 * - 刷新后默认载入最近 `CHAT_HISTORY_ROUND_LIMIT` 轮
 * - 不保存 Base URL / API Key，也不保存 streaming 中的临时占位消息
 * - `createdAt` 记录墙钟时间；`sort` 专用于严格单调递增排序
 */

/** 刷新后自动载入的最近对话轮数。 */
export const CHAT_HISTORY_ROUND_LIMIT = 10

const DB_NAME = 'openai-chat-history'
const DB_VERSION = 2
const STORE_NAME = 'messages'

/** 写入 IndexedDB 的消息结构。 */
export interface StoredChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  status?: 'complete' | 'error'
  /** 墙钟时间（Date.now），仅作展示/调试，不作为顺序依据。 */
  createdAt: number
  /**
   * 严格单调递增的排序键。
   * 旧数据可能缺失；读取时会回退到 createdAt，并在同步游标时补齐。
   */
  sort: number
}

/** 进程内单调游标；加载历史后会对齐到已存最大值。 */
let sortCursor = 0

/** 分配下一个单调递增的 sort 值（保证 > 当前游标）。 */
export function allocateSort(): number {
  sortCursor += 1
  return sortCursor
}

/** 将游标对齐到消息列表中的最大 sort，避免刷新后新消息插到旧消息前面。 */
export function syncSortCursor(messages: Array<Pick<StoredChatMessage, 'sort'>>): void {
  let max = sortCursor
  for (const message of messages) {
    if (typeof message.sort === 'number' && message.sort > max) {
      max = message.sort
    }
  }
  sortCursor = max
}

/** 测试或清理后重置游标（生产路径一般不需要）。 */
export function resetSortCursor(): void {
  sortCursor = 0
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error ?? new Error('打开 IndexedDB 失败'))
    }

    request.onupgradeneeded = () => {
      const db = request.result
      let store: IDBObjectStore

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt', { unique: false })
        store.createIndex('sort', 'sort', { unique: false })
      } else {
        store = request.transaction!.objectStore(STORE_NAME)
        if (!store.indexNames.contains('createdAt')) {
          store.createIndex('createdAt', 'createdAt', { unique: false })
        }
        if (!store.indexNames.contains('sort')) {
          store.createIndex('sort', 'sort', { unique: false })
        }
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }
  })
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB 请求失败'))
  })
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB 事务失败'))
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB 事务中止'))
  })
}

/** 排序键：优先 sort，旧数据无 sort 时回退 createdAt。 */
function sortKey(message: Pick<StoredChatMessage, 'sort' | 'createdAt'>): number {
  return typeof message.sort === 'number' ? message.sort : message.createdAt
}

/**
 * 从按 sort 排序的消息列表中截取最近 `roundLimit` 轮对话。
 * 一轮以 user 消息开始，包含其后连续的 assistant 消息。
 */
export function selectRecentRounds(
  messages: StoredChatMessage[],
  roundLimit: number
): StoredChatMessage[] {
  const sorted = [...messages].sort((a, b) => sortKey(a) - sortKey(b))
  const rounds: StoredChatMessage[][] = []
  let current: StoredChatMessage[] = []

  for (const message of sorted) {
    if (message.role === 'user') {
      if (current.length > 0) {
        rounds.push(current)
      }
      current = [message]
      continue
    }

    if (current.length === 0) {
      // 缺少前置 user 的孤立助手消息，单独成一轮以便不丢数据。
      rounds.push([message])
      continue
    }

    current.push(message)
  }

  if (current.length > 0) {
    rounds.push(current)
  }

  return rounds.slice(-roundLimit).flat()
}

/** 读取全部已存消息，并按 sort（缺失则 createdAt）升序返回。 */
async function readAllMessages(): Promise<StoredChatMessage[]> {
  const db = await openDb()

  try {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const rows = await requestToPromise(
      store.getAll() as IDBRequest<StoredChatMessage[]>
    )
    await transactionDone(tx)
    return rows.sort((a, b) => sortKey(a) - sortKey(b))
  } finally {
    db.close()
  }
}

/**
 * 增量写入/更新消息。
 * 同 id 会覆盖，便于助手从 streaming 落到 complete/error 后更新。
 */
export async function saveChatMessages(
  messages: StoredChatMessage[]
): Promise<void> {
  if (messages.length === 0) {
    return
  }

  console.log('[openai][history] save messages', {
    count: messages.length
  })

  syncSortCursor(messages)

  const db = await openDb()

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    for (const message of messages) {
      store.put(message)
    }

    await transactionDone(tx)
  } finally {
    db.close()
  }
}

/** 载入最近 N 轮对话，供页面刷新后恢复。 */
export async function loadRecentChatRounds(
  roundLimit: number = CHAT_HISTORY_ROUND_LIMIT
): Promise<StoredChatMessage[]> {
  const all = await readAllMessages()
  syncSortCursor(all)
  const recent = selectRecentRounds(all, roundLimit)
  console.log('[openai][history] load recent rounds', {
    roundLimit,
    loaded: recent.length
  })
  return recent
}

/** 清理本地保存的全部对话历史。 */
export async function clearChatHistory(): Promise<void> {
  console.log('[openai][history] clear all')
  const db = await openDb()

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).clear()
    await transactionDone(tx)
  } finally {
    db.close()
  }

  resetSortCursor()
}
