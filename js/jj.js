let a = [1, 2, 3]
a.forEach((value, index, array) => {
  array[index] = value * 2
})

console.log(a)
