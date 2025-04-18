<template>
  <div></div>
</template>
<script lang="ts" setup>
import Decimal from 'decimal.js'

console.log(Decimal)

const a = new Decimal(0.1)
const b = new Decimal(0.2)
const c = a.plus(b)
console.log(c.toNumber())
console.log(c.toFixed())
console.log(c.toString())
console.log(c.toPrecision())
console.log(c.toPrecision(10))

const one = new Decimal(1)
const three = new Decimal(3)

let v = one.dividedBy(three)
console.log(v.toNumber(), v.toPrecision(10))

console.log(0.3333333333333333 * 3, new Decimal(0.3333333333333333).mul(3).toNumber())
</script>
