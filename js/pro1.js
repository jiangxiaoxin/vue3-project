function A() {}

function B() {}

A.prototype.hi = 'a hi'

B.prototype = new A()
B.prototype.constructor = B

console.log(B.prototype.constructor === A)

let b = new B()
console.log(b instanceof B, b instanceof A)

// b.__proto__ => B.prototype => a => a.__proto__ => A.prototype => constructor

console.log(B.prototype.constructor === A, B.prototype.constructor === B)
