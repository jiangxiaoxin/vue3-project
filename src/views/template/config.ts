export enum ModeEnum {
  add = 'add',
  edit = 'edit',
  view = 'view'
}

export const rules = {
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'change' },
    { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
  ],
  code: [
    { required: true, message: 'Please input Activity name', trigger: 'change' },
    { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
  ],
  startTime: [
    {
      required: true,
      message: '选择开始时间',
      trigger: 'blur'
    }
  ],
  type: [
    // 必须选择 type，并且选择后，必须填写对应的内容。但 time 和 count 并不需要动态 rule
    {
      required: true,
      message: '选择',
      trigger: 'blur'
    }
  ],
  time: [
    {
      required: true,
      message: '选择time',
      trigger: 'blur'
    }
  ],
  count: [
    {
      required: true,
      message: '选择count',
      trigger: 'blur'
    }
  ]
  //   endTime: [
  //     {
  //       required: true,
  //       message: '选择结束时间',
  //       trigger: 'blur'
  //     }
  //   ]
}

export const formStateTemplate = {
  name: '',
  desc: '',
  id: null,
  code: '',
  startTime: null,
  endTime: null,
  status: null,
  type: null,
  count: 0,
  time: null
}

export const typeOptions = [
  {
    value: '1',
    label: '时间'
  },
  {
    value: '2',
    label: '次数'
  }
]
