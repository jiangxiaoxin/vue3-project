console.log('arrow function');

// const obj = {
//     name: '张三',
//     getName() {
//         return this.name
//     },
//     getName1: () => {
//         console.log('ttt', this);
        
//         return this.name
//     }
// }
// obj.__proto__.getName2 = function() {
//     return this.name
// }
// obj.__proto__.getName3 = () => {
//     return this.name
// }
// // console.log('普通函数11',obj.getName())
// // console.log('普通函数22',obj.getName2())
// // // console.log('箭头函数33',obj.getName1())
// // console.log('箭头函数44',obj.getName3())


function Person(name) {
    this.name = name

    this.a = () => {
        console.log('a', this);
        
    }
}

let p = new Person('ddd')
p.a()
