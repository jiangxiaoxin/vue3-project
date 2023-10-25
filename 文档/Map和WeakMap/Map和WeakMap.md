# Map 和 WeakMap

## 相同点

都是用来记录映射数据的

## 不同点

1. Map的 key 是强引用，这个 key 本身也是对 “key”这个数据的一份引用，所以即使其他地方不存在对 “key”这个数据的引用了，这个Map本身还有一份，所以key 所对应的这个数据不会被 gc。 当然，如果 Map都被gc了，那“key”这个数据会被gc。而 WeakMap 对 “key”这个数据的引用

2. Map 的 key 可以是number， string，object，但WeakMap必须是 object。这跟 WeakMap的目的是相关的，因为它本身就是要弱弱的保存与 key 有关的映射，当 key没了，这份映射也就不需要了。

3. 还是因为弱引用的问题，WeakMap 只是能set 和 get这个key的映射，但不能整体对WeakMap进行遍历，而Map是可以遍历的。


```javascript
let foo = { name: 'foo'}
```

所谓的 gc ，并不是说把 foo这个变量怎么样了，这只是通常的说法而已，真正的意思是说：把 foo 这个变量所引用的那份数据gc掉了，占用的内存被回收了，然后 foo 这个变量本身也占用的空间也被回收了。

```javascript
let foo = { name : 'foo'}

let bar = foo

foo = null
```

比如这段代码，foo都已经null了，那foo回收了吗？不准确，那份数据依然被 bar 持有，数据依然不会消失，消失的只是 foo这个变量本身的空间。