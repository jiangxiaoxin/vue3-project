import {defineComponent, ref} from "vue"

export default defineComponent({
    name: "table-vex",
    setup(props) {
        const tableData = ref([
            {id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc'},
            {id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou'},
            {id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai'},
            {id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai'}
        ])

        const columns = ref([
          {
            type: 'checkbox',
            title: '选择',
            width: 80
          },


            {
                field: 'name',
                title: 'name'
            },
            {
                field: 'role',
                title: 'role'
            },
            {
                field: 'sex',
                title: 'sex'
            },
            {
                field: 'age',
                title: 'age'
            },
            {
                field: 'address',
                title: 'address'
            }
        ])

      const handleCheckboxChange = () => {
        console.log("checkboxChange", arguments)
      }

      return () => {
          return <vxe-table data={tableData.value}  onCheckbox-change={handleCheckboxChange}>
            {
              columns.value.map(column => {
                if(column.type) {
                  return <vxe-column type={column.type} title={column.title} width={column.width || 60}></vxe-column>
                }
                return <vxe-column field={column.field} title={column.title}></vxe-column>
              })
            }
          </vxe-table>
      }
    }
})
