"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {};
// let a = 1
// const b = 2
function foo() {
    // okay to capture 'a'
    return a;
}
console.log(foo()); // a 先用了，但没问题，这个a 是从globalThis上找的
var a = 11;
// function bar() {
//   console.log(b) // error b还没定义就先用了
//     let b = 1
// }
var b = 1;
bar();
var _loop_1 = function (i) {
    setTimeout(function () {
        console.log(i);
    }, i + 100);
};
for (var i = 0; i < 3; i++) {
    _loop_1(i);
}
