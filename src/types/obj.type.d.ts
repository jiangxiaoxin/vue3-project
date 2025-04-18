declare interface BigObj {
  size: number
  name: string
  children?: Array<string | number>
}

declare namespace API {
  function getListApi(): Array<string | number> {
    return ['hello', 'world']
  }
}
