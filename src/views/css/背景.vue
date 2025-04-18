<template>

<div style="width: 600px;height: 400px;background-color: rgb(1, 26, 65);margin: auto;overflow: hidden;display: flex;justify-content: center;align-items: center;position: relative;">
    <div class="rotate" style="position: absolute;">
    </div>
    <div class="rotate-2" style="width:100px;height:100px;position: absolute;">
    </div>
    <div class="rotate-3" style="width:120px;height:120px;position: absolute;">
    </div>
</div>


<div style="width: 400px;height: 400px;background-color: rgb(1, 26, 65);margin: auto;overflow: hidden;display: flex;justify-content: center;align-items: center;">
    <div class="rotate-2">
        转起来
    </div>
</div>


  <div class="container w-300 h-100 bg-1">默认会repeat</div>
  <div class="container w-300 h-100 bg-2">设置不repeat</div>

  <div>
    <div class="container bg-3" style="width: 700px; height: 700px; color: white">
      background-repeat: space
    </div>
    <section>类似flex布局 space-between一样，尽量往里放完整的图片，剩下的空间大家平分</section>
  </div>
</template>

<style lang="less" scoped>

.rotate,
.rotate-2, .rotate-3 {
    width: 200px;
    height: 200px;
    // background-image: url('@/assets/moon.jpg');
    background-image: url('@/assets/circle.png');
    background-repeat: no-repeat;
    background-position: center center;
    // background-color: rosybrown;
    background-size: 100%;
    
    line-height: 200px;
    text-align: center;
    color: white;
    transform-origin: center center;
    transform: rotateX(30deg) rotate(0);
}

.rotate {
    animation: rotate-animation 5s linear infinite;
}

@keyframes rotate-animation {
    0% {
        transform:  rotateX(30deg) rotate(0deg);
    }

    100% {
        transform: rotateX(150deg) rotate(360deg);
    }
}

.rotate-2, .rotate-3 {
    animation: rotate-2-animation 3s linear infinite;
}
/**
逆时针方向旋转 */
@keyframes rotate-2-animation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-360deg);
    }
}

.container {
  outline: 1px solid red;
}

.bg-1 {
  background: url('@/assets/arrow.png');
}

.bg-2 {
  background: url('@/assets/arrow.png') no-repeat;
}

.bg-3 {
  background: url('@/assets/moon.jpg') space;
}

.w-100 {
  width: 100px;
}

.w-200 {
  width: 200px;
}

.w-300 {
  width: 300px;
}

.h-100 {
  height: 100px;
}

.h-200 {
  height: 200px;
}

.h-300 {
  height: 300px;
}
</style>
