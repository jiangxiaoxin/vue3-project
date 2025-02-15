
let pp = Promise.resolve(1).then((res) => {
    console.log('res1', res);
    throw new Error('自己搞的error')
    
}, (error) => {
    console.log('error1', error);
    
})

console.log("🚀 ~ pp ~ pp:", pp)
pp.catch(error => {
    console.log('error2', error);
})
setTimeout(() => {
    console.log("🚀 ~ pp ~ pp:", pp)
}, 0);