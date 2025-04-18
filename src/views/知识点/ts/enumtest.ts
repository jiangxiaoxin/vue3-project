let a = '123'
// a = 123

let b = 100
let c = true

console.log(parseInt(a))

enum Status {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  DONE = 'DONE'
}

enum COLOR {
  RED = 100,
  GREEN,
  BLUE
}

enum COLOR2 {
  RED = 1,
  GREEN = 2,
  BLUE = 'BLUE',
  DARK = 'DARK'
}

console.log(COLOR2.BLUE, COLOR2['BLUE'])

const enum COLOR3 {
  RED = 1,
  GREEN = 2
}

console.log(COLOR3.GREEN)

export {}
