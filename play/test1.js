Function.prototype.a = () => {
  console.log(1)
}

Object.prototype.b = () => {
  console.log(2)
}

function Foo() {}

// Foo 定义了一个方法，所以Foo身上，才能访问到 Function.prototype 上的属性和方法

Foo.a()

const bar = new Foo()

bar.b()
// bar.a() // error

console.log(Foo.__proto__ == Function.prototype)

// 显然在 Object.prototype 上添加方法b之后，所有的对象实例都可以访问到 b这个方法，显然 Foo 可以访问到 b
Foo.b()

console.log(Function.__proto__ == Function.prototype)
