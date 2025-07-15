<template>
  <glo />
  <button @click="print">打印表格1111111111111111</button>
  <div id="printTable" style="color:red;">
    <table border="1">
      <thead>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
        </tr>
      </thead>
      <tbody>

        <tr>
          <td>张三</td>
          <td>18</td>
        </tr>
        <tr>
          <td>李四</td>
          <td>20</td>
        </tr>
      </tbody>
    </table>


  </div>

  <div id="printTable2">
    <div>
      <h1>页面标题123123123</h1>

    </div>

    <!-- 需要打印的表格 -->
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>职位</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>张三</td>
          <td>28</td>
          <td>工程师</td>
        </tr>
        <tr>
          <td>李四</td>
          <td>32</td>
          <td>设计师</td>
        </tr>
      </tbody>
    </table>
  </div>
  <button @click="print2">打印222222222</button>

  <!-- <main>
    <TheWelcome />
  </main> -->
  <div class="router-view-cls">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'


const print = () => {

  // window.print()
  // return

  try {
    /**
     * 当pc端的网站运行到pad端时，原本的print 功能就不好使了。起码 vxe的打印不好用了
     * 构建好要打印的内容，然后新开窗口，设置document 内容后，edge浏览器功菜单里有打印按钮，这里可以选择导出pdf还是直接打印（如果配置了打印机的话）
     * chrome 浏览器一直装不上，没有测试
     */
    var printContents = document.getElementById('printTable')!.innerHTML;
    var win = window.open('', '', 'height=600,width=800')!;
    win.document.write('<html><head><title></title>');
    // 可加入自定义样式
    win.document.write('<style>table{width:100%;border-collapse:collapse;}th,td{padding:8px;border:1px solid #333;}</style>');
    win.document.write('</head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');

    console.log('000000000', win.document);
    
    win.document.close();
    // win.focus();
    // win.print();
    // win.onafterprint = () => {
    //   win.close();
    // }
  } catch (error) {
    console.log(error, 'errrrr');

  }


  // setTimeout(() => {
  //   win.close();
  // }, 1000);
}


const print2 = () => {
  // var printContents = document.getElementById('printTable2')!.innerHTML;
  // var win = window.open('', '', 'height=800,width=1200')!;
  // win.document.write('<html><head><title></title>');
  // // 可加入自定义样式
  // win.document.write('<style>table{width:100%;border-collapse:collapse;}th,td{padding:8px;border:1px solid #333;}</style>');
  // win.document.write('</head><body>');
  // win.document.write(printContents);
  // win.document.write('</body></html>');
  // win.document.close();
  // win.focus();
  // win.print();
  // win.onafterprint = () => {
  //   win.close();
  // }
}
</script>