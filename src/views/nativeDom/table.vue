<template>
  <div>
    <table v-bg>
      <colgroup>
        <col />
        <col />
      </colgroup>
      <tr>
        <th>姓名</th>
        <th>年龄</th>
      </tr>
      <tr>
        <td>张三</td>
        <td>20</td>
        <td>张三</td>
        <td>20</td>
        <td>张三</td>
        <td>20</td>
        <td>张三</td>
        <td>20</td>
        <td>张三</td>
        <td>20</td>
      </tr>
      <tr>
        <td>李四</td>
        <td>25</td>
        <td>李四</td>
        <td>25</td>
        <td>李四</td>
        <td>25</td>
        <td>李四</td>
        <td>25</td>
      </tr>
      <tr>
        <td>王五</td>
        <td>30</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'my-table'
}
</script>
<style lang="less" scoped>
table {
  width: 100%;
}

td {
}
// col {
//   width: 50%;
// }
</style>
