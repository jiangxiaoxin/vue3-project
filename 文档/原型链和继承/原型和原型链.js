function Foo(name) {
  this.name = name
}

Foo.prototype.prop = 'Foo.prototype.prop'

Foo.prototype.funca = function () {
  console.log('==Foo.prototype.funca', this.name)
}

const foo = new Foo('first')
console.log(foo.prop)

// 虽然 foo 实例在上面是可以输出 foo.prop的，但这是通过原型链到达了 Foo.prototype 上去访问了 Foo.prototype.prop， 这个打印出来的 prop并不属于foo
// 当通过 foo.prop = '' 这种方式去赋值时，foo并不按照原型链去找 prop，而是发现 foo实例本身没有 prop属性，就给foo新建自己的属性，并赋值。所以这句赋值以后，是foo有了自己的prop属性，再打印foo.prop，就把Foo.prototype.prop 屏蔽了
// 因为赋值是对foo对象自身的prop属性进行的操作，所以bar.prop不受影响，会继续访问到 Foo.prototype.prop，去打印值
foo.prop = 'foo.prop'
console.log(foo.prop)

const bar = new Foo('second')
console.log(bar.prop)

// console.log(foo['__proto__'] === Foo.prototype) // true
// console.log(Foo.prototype.constructor === Foo) // true

// console.log(Object.prototype === Object) // false
// const obj = {}
// console.log(obj['__proto__'] === Object.prototype) // true

//----
// js 里万物皆对象，Foo虽然是个方法，但它本身依然是个对象实例，它的父类是谁呢。自然就是Function。所以下面输出是个true
console.log(Foo['__proto__'] === Function.prototype) // true

const funcFromStr = new Function('console.log(123)')
funcFromStr()
// funcFromStr['__proto__'] == Function.prototype // true

// ! 下面输出为 true，那就说明 Function 生成了 Function。自举了。
console.log(Function['__proto__'] == Function.prototype, '22') // true

// Map 和 String 都输出 true，也好解释，因为他们都是 new Map() 和 new String() 这种使用方式
// 所以他们跟 Foo['__proto__'] === Function.prototype 是一样的
console.log(Map['__proto__'] == Function.prototype) // true
console.log(String['__proto__'] == Function.prototype) // true

// Function.prototype 本身也是个对象，那它所指向的原型对象呢？就指向了 Object.prototype.
console.log(Function.prototype['__proto__'] == Object.prototype) // true
// 而 Object.prototype 也是个对象，它也有 __proto__ 属性，而这次输出是 null
// ! 这说明一切的尽头是 null
console.log(Object.prototype['__proto__']) // null
