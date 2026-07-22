import { beforeEach, describe, expect, it } from 'vitest'
import 'fake-indexeddb/auto'
import {
  CHAT_HISTORY_ROUND_LIMIT,
  clearChatHistory,
  loadRecentChatRounds,
  saveChatMessages,
  selectRecentRounds,
  type StoredChatMessage
} from '../chatHistoryDb'

function msg(
  partial: Partial<StoredChatMessage> &
    Pick<StoredChatMessage, 'id' | 'role' | 'content' | 'createdAt'>
): StoredChatMessage {
  return {
    status: 'complete',
    ...partial
  }
}

describe('selectRecentRounds', () => {
  it('keeps only the latest N user-assistant rounds', () => {
    const messages: StoredChatMessage[] = []
    for (let i = 1; i <= 12; i++) {
      messages.push(
        msg({
          id: `u${i}`,
          role: 'user',
          content: `q${i}`,
          createdAt: i * 2
        }),
        msg({
          id: `a${i}`,
          role: 'assistant',
          content: `a${i}`,
          createdAt: i * 2 + 1
        })
      )
    }

    const recent = selectRecentRounds(messages, 10)

    expect(recent).toHaveLength(20)
    expect(recent[0].content).toBe('q3')
    expect(recent.at(-1)?.content).toBe('a12')
  })
})

describe('chatHistoryDb', () => {
  beforeEach(async () => {
    await clearChatHistory()
  })

  it('persists messages and loads the latest rounds after reload', async () => {
    const batch: StoredChatMessage[] = []
    for (let i = 1; i <= 12; i++) {
      batch.push(
        msg({
          id: `u${i}`,
          role: 'user',
          content: `q${i}`,
          createdAt: i * 2
        }),
        msg({
          id: `a${i}`,
          role: 'assistant',
          content: `a${i}`,
          createdAt: i * 2 + 1,
          status: 'complete'
        })
      )
    }

    await saveChatMessages(batch)
    const loaded = await loadRecentChatRounds(CHAT_HISTORY_ROUND_LIMIT)

    expect(loaded).toHaveLength(20)
    expect(loaded[0]).toMatchObject({ id: 'u3', content: 'q3' })
    expect(loaded.at(-1)).toMatchObject({ id: 'a12', content: 'a12' })
  })

  it('clears all stored chat history', async () => {
    await saveChatMessages([
      msg({
        id: 'u1',
        role: 'user',
        content: 'hello',
        createdAt: 1
      }),
      msg({
        id: 'a1',
        role: 'assistant',
        content: 'hi',
        createdAt: 2
      })
    ])

    await clearChatHistory()
    await expect(loadRecentChatRounds(10)).resolves.toEqual([])
  })
})
