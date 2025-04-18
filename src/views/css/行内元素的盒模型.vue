<template>
    <div style="margin-top: 100px;background-color: aqua;">
        <span>行内元素的盒模型,margin,padding,border各项都在，都能生效，但是外层div的高度却与他们无关</span>
    </div>

    <ul>
        <li>
            给span设置height无效，因为它是display:inline,不能设置height。可以用line-height撑开空间。但虽然撑开了空间，只是让外层的div空间变大，span自己本身的height是最终渲染完计算出来的，不是设置的。
        </li>
        <li>
            或者给span修改display
        </li>
    </ul>

</template>
<style lang="less" scoped>
span {
    margin: 10px;
    border: 20px solid red;
    padding: 30px;
    background-color: green;
    color: white;
    line-height: 200px;
}

</style>