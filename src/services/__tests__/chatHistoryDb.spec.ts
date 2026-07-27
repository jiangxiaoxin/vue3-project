import { beforeEach, describe, expect, it } from 'vitest'
import 'fake-indexeddb/auto'
import {
  CHAT_HISTORY_ROUND_LIMIT,
  allocateSort,
  clearChatHistory,
  loadRecentChatRounds,
  resetSortCursor,
  saveChatMessages,
  selectRecentRounds,
  type StoredChatMessage
} from '../chatHistoryDb'

function msg(
  partial: Partial<StoredChatMessage> &
    Pick<StoredChatMessage, 'id' | 'role' | 'content' | 'createdAt' | 'sort'>
): StoredChatMessage {
  return {
    status: 'complete',
    ...partial
  }
}

describe('selectRecentRounds', () => {
  it('keeps only the latest N user-assistant rounds ordered by sort', () => {
    const messages: StoredChatMessage[] = []
    for (let i = 1; i <= 12; i++) {
      messages.push(
        msg({
          id: `u${i}`,
          role: 'user',
          content: `q${i}`,
          createdAt: i * 2,
          sort: i * 2
        }),
        msg({
          id: `a${i}`,
          role: 'assistant',
          content: `a${i}`,
          createdAt: i * 2 + 1,
          sort: i * 2 + 1
        })
      )
    }

    const recent = selectRecentRounds(messages, 10)

    expect(recent).toHaveLength(20)
    expect(recent[0].content).toBe('q3')
    expect(recent.at(-1)?.content).toBe('a12')
  })

  it('orders by sort even when createdAt collides', () => {
    const sameMs = 1_700_000_000_000
    const messages = [
      msg({
        id: `${sameMs}-z9k`,
        role: 'assistant',
        content: 'answer',
        createdAt: sameMs,
        sort: 2
      }),
      msg({
        id: `${sameMs}-a1b`,
        role: 'user',
        content: 'question',
        createdAt: sameMs,
        sort: 1
      })
    ]

    const recent = selectRecentRounds(messages, 10)

    expect(recent.map((item) => item.role)).toEqual(['user', 'assistant'])
    expect(recent.map((item) => item.content)).toEqual(['question', 'answer'])
  })
})

describe('allocateSort', () => {
  beforeEach(async () => {
    await clearChatHistory()
    resetSortCursor()
  })

  it('returns strictly increasing values', () => {
    expect(allocateSort()).toBe(1)
    expect(allocateSort()).toBe(2)
    expect(allocateSort()).toBe(3)
  })
})

describe('chatHistoryDb', () => {
  beforeEach(async () => {
    await clearChatHistory()
    resetSortCursor()
  })

  it('persists messages and loads the latest rounds after reload', async () => {
    const batch: StoredChatMessage[] = []
    for (let i = 1; i <= 12; i++) {
      batch.push(
        msg({
          id: `u${i}`,
          role: 'user',
          content: `q${i}`,
          createdAt: i * 2,
          sort: i * 2
        }),
        msg({
          id: `a${i}`,
          role: 'assistant',
          content: `a${i}`,
          createdAt: i * 2 + 1,
          sort: i * 2 + 1,
          status: 'complete'
        })
      )
    }

    await saveChatMessages(batch)
    const loaded = await loadRecentChatRounds(CHAT_HISTORY_ROUND_LIMIT)

    expect(loaded).toHaveLength(20)
    expect(loaded[0]).toMatchObject({ id: 'u3', content: 'q3', sort: 6 })
    expect(loaded.at(-1)).toMatchObject({ id: 'a12', content: 'a12', sort: 25 })
  })

  it('restores same-millisecond turns in sort order, not id order', async () => {
    const sameMs = Date.now()
    await saveChatMessages([
      msg({
        id: `${sameMs}-zzzz`,
        role: 'assistant',
        content: '第二轮回答',
        createdAt: sameMs,
        sort: 4
      }),
      msg({
        id: `${sameMs}-aaaa`,
        role: 'user',
        content: '第一轮问题',
        createdAt: sameMs,
        sort: 1
      }),
      msg({
        id: `${sameMs}-bbbb`,
        role: 'assistant',
        content: '第一轮回答',
        createdAt: sameMs,
        sort: 2
      }),
      msg({
        id: `${sameMs}-yyyy`,
        role: 'user',
        content: '第二轮问题',
        createdAt: sameMs,
        sort: 3
      })
    ])

    const loaded = await loadRecentChatRounds(10)

    expect(loaded.map((item) => item.content)).toEqual([
      '第一轮问题',
      '第一轮回答',
      '第二轮问题',
      '第二轮回答'
    ])
  })

  it('continues allocateSort after loading history so new messages stay after old ones', async () => {
    await saveChatMessages([
      msg({
        id: 'u1',
        role: 'user',
        content: 'old',
        createdAt: 1,
        sort: 10
      })
    ])
    await loadRecentChatRounds(10)

    expect(allocateSort()).toBe(11)
  })

  it('clears all stored chat history', async () => {
    await saveChatMessages([
      msg({
        id: 'u1',
        role: 'user',
        content: 'hello',
        createdAt: 1,
        sort: 1
      }),
      msg({
        id: 'a1',
        role: 'assistant',
        content: 'hi',
        createdAt: 2,
        sort: 2
      })
    ])

    await clearChatHistory()
    await expect(loadRecentChatRounds(10)).resolves.toEqual([])
    expect(allocateSort()).toBe(1)
  })
})
