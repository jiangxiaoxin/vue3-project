<template>
  <div class="offscreen-demo">
    <h2>OffscreenCanvas + Web Worker 随机绘图演示</h2>
    
    <div class="canvas-container">
      <canvas 
        ref="mainCanvas" 
        width="800" 
        height="600"
        class="main-canvas"
      ></canvas>
    </div>
    
    <div class="controls">
      <button @click="startDrawing">随机绘制</button>
      <button @click="drawMultipleRandom">绘制多个随机矩形</button>
      <button @click="clearCanvas">清空画布</button>
      <button @click="drawComplexShape">绘制复杂图形</button>
      <button @click="drawAnimation">绘制动画</button>
      <button @click="draw10000Rectangles" class="test-button">测试10000个矩形</button>
    </div>
    
    <div class="info">
      <p>状态: {{ status }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mainCanvas = ref<HTMLCanvasElement>()
const status = ref('就绪')

let worker: Worker | null = null
let offscreenCanvas: OffscreenCanvas | null = null

// 创建 Web Worker
const createWorker = () => {
  // Worker 代码字符串
  const workerCode = `
    // Web Worker for OffscreenCanvas operations
    let offscreenCanvas = null
    let ctx = null

    self.onmessage = function(e) {
      const { type, data } = e.data
      
      switch (type) {
        case 'init':
          offscreenCanvas = data.canvas
          ctx = offscreenCanvas.getContext('2d')
          self.postMessage({ type: 'init', success: true })
          break
          
        case 'draw':
          // 执行绘制操作
          drawShape(data)
          
          // 传递所有原始数据，包括多绘制的标识
          const responseData = { 
            type: 'drawComplete'
          }
          
          // 如果是多绘制操作，传递相关标识
          if (data.isMultipleDraw) {
            responseData.isMultipleDraw = data.isMultipleDraw
            responseData.drawIndex = data.drawIndex
            responseData.totalCount = data.totalCount
          }
          
          self.postMessage(responseData)
          break
          
        case 'clear':
          if (ctx) {
            ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
            self.postMessage({ 
              type: 'clearComplete'
            })
          }
          break
          
        case 'complex':
          drawComplexShape(data)
          self.postMessage({ 
            type: 'complexComplete'
          })
          break
          
        case 'animation':
          drawAnimation(data)
          break
          
        case 'drawBatch':
          drawBatch(data.rectangles, data.totalCount)
          self.postMessage({ type: 'drawBatchComplete' })
          break
      }
    }

    function drawShape(data) {
      const { x, y, width, height, color } = data
      
      // 设置样式
      ctx.fillStyle = color
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      
      // 绘制矩形
      ctx.fillRect(x, y, width, height)
      ctx.strokeRect(x, y, width, height)
      
      // 添加渐变效果
      const gradient = ctx.createLinearGradient(x, y, x + width, y + height)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(x + 5, y + 5, width - 10, height - 10)
    }

    function drawComplexShape(data) {
      const { centerX, centerY, radius } = data
      
      // 绘制复杂图形 - 花朵图案
      ctx.save()
      ctx.translate(centerX, centerY)
      
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, -radius)
        ctx.strokeStyle = \`hsl(\${i * 30}, 70%, 60%)\`
        ctx.lineWidth = 3
        ctx.stroke()
      }
      
      // 绘制中心圆
      ctx.beginPath()
      ctx.arc(0, 0, radius / 3, 0, Math.PI * 2)
      ctx.fillStyle = '#FFD700'
      ctx.fill()
      
      ctx.restore()
    }

    function drawAnimation(data) {
      if (!data) {
        console.error('drawAnimation: data is undefined')
        return
      }
      
      const { frames, frameIndex } = data
      
      if (frames === undefined || frameIndex === undefined) {
        console.error('drawAnimation: frames or frameIndex is undefined', data)
        return
      }
      
      const centerX = offscreenCanvas.width / 2
      const centerY = offscreenCanvas.height / 2
      
      // 清除画布
      ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      
      // 绘制旋转的圆环
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate((frameIndex * Math.PI * 2) / frames)
      
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4)
        ctx.beginPath()
        ctx.arc(0, -80, 10, 0, Math.PI * 2)
        ctx.fillStyle = \`hsl(\${i * 45 + frameIndex * 10}, 70%, 60%)\`
        ctx.fill()
      }
      
      ctx.restore()
      
      // 继续动画
      if (frameIndex < frames - 1) {
        setTimeout(() => {
          self.postMessage({ 
            type: 'animationFrame', 
            frameIndex: frameIndex + 1,
            frames 
          })
        }, 50)
      } else {
        self.postMessage({ type: 'animationComplete' })
      }
    }

    function drawBatch(rectangles, totalCount) {
      if (!ctx) {
        console.error('drawBatch: ctx is not initialized')
        return
      }

      console.log("Worker: 开始批量绘制" + totalCount + "个矩形")

      // 批量绘制
      for (let i = 0; i < totalCount; i++) {
        const rect = rectangles[i]
        
        // 设置绘制样式
        ctx.fillStyle = rect.color
        
        // 绘制矩形
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        
        // 每1000个矩形报告一次进度
        if ((i + 1) % 1000 === 0) {
          console.log("Worker: 已绘制" +  (i + 1) + "个矩形" )
        }
      }
      
      console.log("Worker: 批量绘制完成")
    }
  `
  
  // 创建 Blob URL
  const blob = new Blob([workerCode], { type: 'application/javascript' })
  const workerUrl = URL.createObjectURL(blob)
  
  worker = new Worker(workerUrl)
  
  // 监听 Worker 消息
  worker.onmessage = (e) => {
    console.log('Raw worker message:', e.data)
    
    const { type, frameIndex, frames } = e.data
    
    console.log('Worker message received:', { type, frameIndex, frames })
    
    switch (type) {
      case 'init':
        status.value = 'Worker 初始化完成'
        console.log('Worker initialized')
        break
        
      case 'drawComplete':
        console.log('Draw complete')
        
        // 检查是否是多个绘制操作的一部分
        const isMultipleDraw = e.data.isMultipleDraw
        const drawIndex = e.data.drawIndex
        const totalCount = e.data.totalCount
        
        if (isMultipleDraw) {
          // 多绘制操作
          console.log(`多绘制进度: ${drawIndex}/${totalCount}`)
          
          // 当所有绘制完成时
          if (drawIndex >= totalCount) {
            if (totalCount >= 10000) {
              status.value = `完成绘制${totalCount}个随机矩形 (性能测试)`
            } else {
              status.value = `完成绘制${totalCount}个随机矩形`
            }
            console.log(`所有${totalCount}个矩形绘制完成`)
          } else if (totalCount >= 10000 && drawIndex % 1000 === 0) {
            // 对于大量绘制，显示进度
            status.value = `正在绘制... ${drawIndex}/${totalCount}`
          }
        } else {
          // 单个绘制操作
          status.value = '绘制完成'
        }
        break
        
      case 'clearComplete':
        status.value = '清空完成'
        break
        
      case 'complexComplete':
        status.value = '复杂图形绘制完成'
        break
        
      case 'animationFrame':
        console.log('继续动画///', frameIndex, frames);
        
        // 继续动画
        if (worker && offscreenCanvas && frameIndex !== undefined && frames !== undefined) {
          worker.postMessage({
            type: 'animation',
            data: {
              frameIndex: frameIndex + 1,
              frames
            }
          })
        } else {
          console.error('Animation frame data is invalid:', { frameIndex, frames })
        }
        break
        
      case 'animationComplete':
        status.value = '动画完成'
        break

      case 'drawBatchComplete':
        status.value = '10000个矩形绘制完成'
        break
        
      default:
        console.warn('Unknown message type:', type)
        break
    }
  }
  
  return worker
}

// 初始化 OffscreenCanvas
const initOffscreenCanvas = () => {
  if (!mainCanvas.value) return
  
  // 创建 OffscreenCanvas
  offscreenCanvas = mainCanvas.value.transferControlToOffscreen()
  
  // 发送到 Worker
  if (worker) {
    worker.postMessage({
      type: 'init',
      data: { canvas: offscreenCanvas }
    }, [offscreenCanvas])
  }
}

// 开始绘制
const startDrawing = () => {
  if (!worker) return
  
  status.value = '正在绘制...'
  
  // 生成随机参数
  const canvasWidth = 800
  const canvasHeight = 600
  
  // 随机位置 (留出边距)
  const margin = 50
  const x = Math.random() * (canvasWidth - margin * 2) + margin
  const y = Math.random() * (canvasHeight - margin * 2) + margin
  
  // 随机宽高 (最小50，最大200)
  const width = Math.random() * 150 + 50
  const height = Math.random() * 150 + 50
  
  // 随机颜色
  const colors = [
    '#FF6B6B', // 红色
    '#4ECDC4', // 青色
    '#45B7D1', // 蓝色
    '#96CEB4', // 绿色
    '#FFEAA7', // 黄色
    '#DDA0DD', // 紫色
    '#FFA07A', // 橙色
    '#98D8C8', // 薄荷绿
    '#F7DC6F', // 金黄色
    '#BB8FCE'  // 淡紫色
  ]
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  console.log('随机绘制参数:', { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height), color })
  
  worker.postMessage({
    type: 'draw',
    data: {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      color: color
    }
  })
}

// 清空画布
const clearCanvas = () => {
  if (!worker) return
  
  status.value = '正在清空...'
  worker.postMessage({ type: 'clear' })
}

// 绘制复杂图形
const drawComplexShape = () => {
  if (!worker) return
  
  status.value = '正在绘制复杂图形...'
  worker.postMessage({
    type: 'complex',
    data: {
      centerX: 400,
      centerY: 300,
      radius: 100
    }
  })
}

// 绘制动画
const drawAnimation = () => {
  if (!worker) return
  
  status.value = '正在绘制动画...'
  worker.postMessage({
    type: 'animation',
    data: {
      frameIndex: 0,
      frames: 60
    }
  })
}

// 绘制多个随机矩形
const drawMultipleRandom = () => {
  if (!worker) return
  
  status.value = '正在绘制多个随机矩形...'
  
  // 绘制3-5个随机矩形
  const count = Math.floor(Math.random() * 3) + 3 // 3-5个
  
  console.log(`开始绘制${count}个随机矩形`)
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (!worker) return
      
      // 生成随机参数
      const canvasWidth = 800
      const canvasHeight = 600
      
      // 随机位置 (留出边距)
      const margin = 50
      const x = Math.random() * (canvasWidth - margin * 2) + margin
      const y = Math.random() * (canvasHeight - margin * 2) + margin
      
      // 随机宽高 (最小30，最大150)
      const width = Math.random() * 120 + 30
      const height = Math.random() * 120 + 30
      
      // 随机颜色
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE',
        '#E74C3C', '#3498DB', '#2ECC71', '#F1C40F', '#9B59B6'
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      console.log(`绘制第${i + 1}个随机矩形:`, { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height), color })
      
      // 为每个绘制操作添加标识
      worker.postMessage({
        type: 'draw',
        data: {
          x: Math.round(x),
          y: Math.round(y),
          width: Math.round(width),
          height: Math.round(height),
          color: color,
          isMultipleDraw: true, // 标识这是多绘制操作的一部分
          drawIndex: i + 1,
          totalCount: count
        }
      })
    }, i * 200) // 每个矩形间隔200ms
  }
}

// 绘制10000个随机矩形 (测试用)
const draw10000Rectangles = () => {
  if (!worker) return
  
  status.value = '正在清空画布...'
  
  // 先清空画布
  worker.postMessage({ type: 'clear' })
  
  // 等待清空完成后开始绘制
  setTimeout(() => {
    if (!worker) return // 检查worker是否还存在
    
    status.value = '正在生成10000个随机矩形数据...'
    
    const count = 10000
    console.log(`开始生成${count}个随机矩形数据`)
    
    // 创建颜色数组
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE',
      '#E74C3C', '#3498DB', '#2ECC71', '#F1C40F', '#9B59B6'
    ]
    
    // 在主进程中生成所有矩形的数据
    const rectangles = []
    const canvasWidth = 800
    const canvasHeight = 600
    const margin = 10
    
    for (let i = 0; i < count; i++) {
      // 随机位置
      const x = Math.random() * (canvasWidth - margin * 2) + margin
      const y = Math.random() * (canvasHeight - margin * 2) + margin
      
      // 随机宽高 (最小1，最大3)
      const width = Math.random() * 2 + 1
      const height = Math.random() * 2 + 1
      
      // 随机颜色
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      rectangles.push({
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
        color: color
      })
    }
    
    console.log(`生成了${rectangles.length}个矩形数据，开始发送给Worker`)
    status.value = '正在绘制10000个随机矩形...'
    
    // 一次性发送所有矩形数据给Worker
    worker.postMessage({
      type: 'drawBatch',
      data: {
        rectangles: rectangles,
        totalCount: count
      }
    })
  }, 100) // 等待100ms确保清空完成
}

onMounted(() => {
  // 创建 Worker
  worker = createWorker()
  
  // 初始化 OffscreenCanvas
  initOffscreenCanvas()
})

onUnmounted(() => {
  // 清理 Worker
  if (worker) {
    worker.terminate()
    worker = null
  }
})
</script>

<style scoped>
.offscreen-demo {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.canvas-container {
  margin: 20px 0;
  text-align: center;
}

.main-canvas {
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.controls {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  justify-content: center;
}

.controls button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.controls button:hover {
  background: #0056b3;
}

.test-button {
  background: #dc3545; /* 红色 */
  font-weight: bold;
  border: 2px solid #c82333;
}

.test-button:hover {
  background: #c82333; /* 深红色 */
  transform: scale(1.05);
  transition: all 0.2s ease;
}

.info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.info p {
  margin: 5px 0;
  font-family: monospace;
}
</style> 