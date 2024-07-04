export const formConfigs = [
  [
    {
      code: 'name',
      title: '名称',
      type: 'input',
      required: true,
      defaultValue: 'alp',
      maxlength: 20
    },
    {
      code: 'remark',
      title: 'remark',
      type: 'textarea'
      // maxlength: 200
    },
    {
      code: 'price',
      title: '加个',
      type: 'inputnumber',
      required: false
    },
    {
      code: 'type',
      title: '类型',
      type: 'select',
      multiple: true,
      // defaultValue: [1, 2],
      options: [
        {
          value: 1,
          label: '类型1'
        },
        {
          value: 2,
          label: '类型2'
        },
        {
          value: 3,
          label: '类型3'
        },
        {
          value: 4,
          label: '类型4'
        }
      ]
    },
    {
      code: 'address',
      title: '地址',
      type: 'select',
      // dict: 'cityList',
      // defaultValue: 1,
      options: [
        {
          value: 1,
          label: '地址1'
        },
        {
          value: 2,
          label: '地址2'
        }
      ]
    },
    {
      code: 'radio',
      title: 'radio',
      type: 'radio',
      required: true,
      options: [
        {
          value: 1,
          label: 'radio-1'
        },
        {
          value: 2,
          label: 'radio-2'
        }
      ]
    },
    // {
    //   code: 'radio2',
    //   title: 'radio2',
    //   type: 'radio',
    //   dict: 'radio-dict'
    // },
    {
      code: 'checkbox',
      title: 'checkbox',
      type: 'checkbox',
      options: [
        {
          value: 1,
          label: 'checkbox-1'
        },
        {
          value: 2,
          label: 'checkbox-2'
        },
        {
          value: 3,
          label: 'checkbox-3'
        }
      ]
    },
    // {
    //   code: 'checkbox222',
    //   title: 'checkbox222',
    //   type: 'checkbox',
    //   dict: 'aabb'
    // },
    {
      code: 'datepicker_normal',
      title: 'datepicker',
      type: 'datepicker'
      // defaultValue: '2024-06-06'
    },
    {
      code: 'yearpicker',
      title: 'year',
      type: 'datepicker',
      picker: 'year'
      // defaultValue: '2029'
    },
    {
      code: 'monthpicker',
      title: 'month',
      type: 'datepicker',
      picker: 'month'
      // defaultValue: '2024-10'
    },
    {
      code: 'dateRange',
      title: '日期范围',
      type: 'rangepicker'
    },
    {
      code: 'datetimeRange',
      title: '日期时间范围',
      type: 'rangepicker',
      showTime: true
    },
    {
      code: 'timepicker',
      type: 'timepicker',
      title: '时间',
      valueFormat: 'HH:mm:ss'
    },
    {
      code: 'timepicker2',
      title: '时间222',
      type: 'timepicker',
      valueFormat: 'HH:mm'
    },
    {
      code: 'timerange',
      type: 'timerange',
      title: '时间范围',
      required: true
      // valueFormat: 'HH:mm'
    }
  ],
  [
    {
      type: 'input',
      code: 'name',
      title: '名字',
      required: true
      // defaultValue: '默认值'
    },
    {
      code: 'datetimeRange',
      title: '日期时间范围',
      type: 'rangepicker',
      showTime: true,
      required: true
    }
  ]
]

export const testData = {
  id: Date.now(),
  name: '123',
  datetimeRange: ['2024-06-06 08:00:00', '2024-06-06 20:00:00'],
  radio: 1,
  checkbox: [1]
}

// var orderList = [10, 2, 4, 1, 5]
// orderList.sort((a, b) => a - b)
// console.log(orderList)
