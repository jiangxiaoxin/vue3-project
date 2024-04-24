import { ref } from 'vue'

const enum SocketStateEnum {
  opened = 'opened',
  closed = 'closed',
  connecting = 'connecting'
}

export interface SimpleSocketOptions {
  immediate?: boolean // 是否立即打开
  onOpen?: (ws: WebSocket) => void // 打开成功
  onClose?: (ws: WebSocket, evt: any) => void // 关闭
  onError?: (ws: WebSocket, err: any) => void // 错误
  onConnetionFailed?: () => void // 连接失败
  onMessage?: (ws: WebSocket, evt: any) => void // 收到消息
  retry?: number // 重连次数
  retryInterval?: number // 重连间隔
}

export const useSimpleSocket = (url: string, options: SimpleSocketOptions = {}) => {
  const {
    immediate = false,
    onOpen,
    onClose,
    onError,
    onConnetionFailed, // 连接失败
    onMessage,
    retry = 3, // 默认重连3次
    retryInterval = 3000 // 重连间隔
  } = options

  const wsRef = ref<WebSocket | null>(null) // 当前websocket 示例
  const data = ref(null) // 最新的数据
  let queue: any[] = [] // 发送队列
  const state = ref<SocketStateEnum>(SocketStateEnum.closed)
  const userClose = ref(false) // 用户是否主动关闭
  const retried = ref(0) // 重试次数

  const __init = () => {
    const ws = new WebSocket(url)
    wsRef.value = ws
    state.value = SocketStateEnum.connecting

    ws.onopen = () => {
      state.value = SocketStateEnum.opened
      onOpen?.(ws)
      __sendQueue() // 连上以后就可以发送数据了
    }

    ws.onclose = (evt: any) => {
      state.value = SocketStateEnum.closed
      onClose?.(ws, evt)
      if (userClose.value) {
        // 用户主动关闭，不重新连接
        return
      }
      // 非主动连接断开，尝试重连

      if (retried.value < retry) {
        setTimeout(() => {
          retried.value++
          __init()
        }, retryInterval)
      } else {
        // 重连次数达到上限，不再重连
        onConnetionFailed?.()
      }
    }

    ws.onmessage = (e) => {
      data.value = e.data
      onMessage?.(ws, e)
    }

    ws.onerror = (err) => {
      onError?.(ws, err)
    }
  }

  const __sendQueue = () => {
    for (let i = 0; i < queue.length; i++) {
      wsRef.value?.send(queue[i])
    }
    queue = []
  }

  const open = () => {
    // 先把之前的实例关掉，再走 init 重新创建一个
    if (!window || !window.WebSocket) {
      return
    }
    close()
    userClose.value = false
    retried.value = 0
    __init()
  }
  // 公开给用户，主动关闭
  const close = () => {
    wsRef.value?.close()
    wsRef.value = null
    userClose.value = true
    retried.value = 0
  }

  const send = (data: any, save = false) => {
    // 如果没准备好，可以先存下来，等准备好后再发送
    if (!wsRef.value || state.value !== SocketStateEnum.opened) {
      if (save) {
        queue.push(data)
      }
      return
    }
    __sendQueue()
    wsRef.value?.send(data)
  }

  if (immediate) {
    // 如果要立即打开，则调用open方法。但要自己保证时机会合适
    open()
  }

  return {
    ws: wsRef,
    data,
    open,
    close,
    send,
    state
  }
}
