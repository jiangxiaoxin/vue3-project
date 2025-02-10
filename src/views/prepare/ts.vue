<template></template>
<script setup lang="ts">
function foo(a: String) {
  console.log('foo', a)
}

// foo('123')

type firstElementFuncType<T> = (arr: T[]) => T | undefined
const firstNumber: firstElementFuncType<number> = (arr) => {
  return arr[0]
}

const firstString: firstElementFuncType<string> = (arr) => {
  return arr[0]
}

// Example usage
// console.log(firstNumber([1, 2, 3])); // Output: 1
// console.log(firstString(['a', 'b', 'c'])); // Output: 'a'

/**
 * @param {Type extends { length: number }} obj
 * @param {number} minimum
 * @returns {Type}
 */
function minimumLength<Type extends { length: number }>(obj: Type, minimum: number): Type {
  if (obj.length >= minimum) {
    return obj
  } else {
    return { length: minimum } as Type
  }
}

function func1(name: string): number {
  return name.length
}

func1('hello')

interface Func2Interface {
  (name: string): number
}

let func2: Func2Interface = (name) => {
  return name.length
}

func2('123')

type Func3Type = (args: string) => number

let func3: Func3Type = (name) => name.length

func3('fffddd')

// type Info = {address?:string, money:number}
// type Person = { name: string, readonly age: number, info:  Info}
// function objType1 (obj: Person) : Person {
//     obj.name = '123'
//     // obj.age = 123 // error
//     // obj.info.address = '123'// ok
//     obj.info = {address: '123', money: 123}
//     return obj
// }

// let o: Person=  {
//     name: 'lili',
//     age: 100,
//     info: {
//         address: 'beijing',
//         money: 100
//     }
// }

// o = objType1(o)

type ObjFunc = (a: number, b: number) => number
let obj: ObjFunc



function add(a: number, b: number): number {
  return a + b
}



obj = add

type obj2Type<T> = (a: T, b: T) => T
let obj2: obj2Type<number> = (a, b) => {
  return a + b
}
obj2(1, 2)
// obj2(1, true) // error

type readonlyArray<T> = Readonly<Array<T>>
type readonlyNumberArray = readonlyArray<number> // readonly number[]
// type readonlyNumberArray = readonly number[]

const arr1: readonlyNumberArray = [1, 2, 3]

// arr1 = []
// arr1[1] = 123

type Person = { name: string; age: number }
interface PersonInterface {
  name: string
  age: number
  address?: string
}

const p1: Person = { name: 'lili', age: 100 }

function printPerson(p: PersonInterface) {
  console.log(p.name)
}

printPerson(p1)

const p2: PersonInterface = p1
const p3: Person = p2

const p4: ArrayLike<number | undefined> = [1, 2, 3, ,]

type somePerson = Pick<Person, 'name' | 'age'>
</script>
