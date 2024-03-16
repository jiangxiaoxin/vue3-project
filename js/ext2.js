function A() {
  this.name = 'aaa'
}

A.prototype.eat = function () {
  console.log(`${this.name}::eat`)
}

function B() {}

B.prototype = new A()

var a = new A()
console.log(a.name)
var b = new B()
console.log(b.name) // 第一次输出，是按着链往上找，找到 B.prototype.name
b.eat()
b.name = 'bbbb' // 给b创建新的属性，name属于b本身了
b.eat()
console.log(a.name, b.name, b.__proto__.name)
console.log(b.constructor === A, b.constructor === B) // true false
