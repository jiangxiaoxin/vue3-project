<template>
<!-- <testEstimatedHeightList /> -->
<!-- <testFixedHeightTransform /> -->
  <!-- <fixedHeight /> -->

  <router-view></router-view>

  
</template>

<script lang="ts">
import './js/arrow-function'

  


</script>

<script setup lang="ts">
import fixedHeight from './views/longList/fixedHeight.vue';
import testFixedHeightTransform from './views/longList/testFixedHeightTransform.vue';
import testEstimatedHeightList from './views/longList/testEstimatedHeightList.vue';


/**
 * 1
 * 2
 * 4444
 * main res 5555
 * res 2222
 * ---- 3333
 * 整了两条promise链
 */

function foo() {


    return Promise.resolve().then(() => {
        console.log(1);

        new Promise((resolve, reject) => {
            console.log(2);
            setTimeout(() => {
                resolve(2222);
            }, 2000);
        }).then(res => {
            console.log('res', res);
            return 3333
        }).then(res => {
          console.log('----', res);
          
        })
        
    }).then(() => {
      console.log(4444);
      return 5555
    })
}

// foo().then(res => {
//     console.log('main res', res);
    
// })


/***
 * 1
 * 2
 * res 2222
 * ---- 3333
 * 4444
 * bar main res 5555
 * 把所有的promise 任务都放在一条链上
 */

function bar() {
  return Promise.resolve().then(() => {
        console.log(1);

        return new Promise((resolve, reject) => {
            console.log(2);
            setTimeout(() => {
                resolve(2222);
            }, 2000);
        })
        
    }).then(res => {
            console.log('res', res);
            return 3333
        }).then(res => {
          console.log('----', res);
          
        }).then(() => {
      console.log(4444);
      return 5555
    })
}


// bar().then(res => {
//     console.log('bar main res', res);
    
// })


</script>





