function Person(name) {
  this.name = name
}

Person.prototype.eat = function () {
  console.log(`person ${this.name} eat`)
}

// let a = new Person('aaa')
// console.log(a instanceof Person, typeof a) // true object
// a.eat()

// console.log(a['__proto__'] == Person.prototype) // true

// Person.prototype.hi = 'hhhhhh'
// console.log(a.hi)

// let b = new Person('bbb')
// console.log(b.hi)

// a.hi = '123'
// console.log(a.hi, b.hi)

class Parent {}

class Child extends Parent {}

// Child.prototype 应该是一个”普通的“对象，而 Parent 不满足，它有”函数的影子“
// 但 Child.prototype 这个对象，它又必须是能跟 Parent ”这个函数“ 产生联系的，那就只能是用 Parent 这个函数产生的对象
console.log(Child.prototype === Parent) // false
console.log(Child.prototype instanceof Parent) // true
console.log(Child.prototype.__proto__ === Parent.prototype) //true
