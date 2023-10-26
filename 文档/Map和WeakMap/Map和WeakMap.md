# Map 和 WeakMap

## 相同点

都是用来记录映射数据的

## 不同点

1. Map的 key 是强引用，这个 key 本身也是对 “key”这个数据的一份引用，所以即使其他地方不存在对 “key”这个数据的引用了，这个Map本身还有一份，所以key 所对应的这个数据不会被 gc。 当然，如果 Map都被gc了，那“key”这个数据会被gc。而 WeakMap 对 “key”这个数据的引用是弱引用，给WeakMap添加了key和value后，并不会增加key数据的引用计数，不会影响它的gc

2. Map 的 key 可以是number， string，object，但WeakMap必须是 object。这跟 WeakMap的目的是相关的，因为它本身就是要弱弱的保存与 key 有关的映射，当 key没了，这份映射也就不需要了。如果用字面量来做 key，那就没有引用计数的问题，也就不需要出现WeakMap了

3. 还是因为弱引用的问题，WeakMap 只是能set 和 get这个key的映射，但不能整体对WeakMap进行遍历，而Map是可以遍历的。因为WeakMap不能 key随时都可能访问不到了，而遍历是要求他真的还在的。


```javascript
let foo = { name: 'foo'}
```

这里所谓的 gc ，并不是说把 foo这个变量怎么样了，这只是通常的说法而已，真正的意思是说：把 foo 这个变量所引用的那份数据gc掉了，占用的内存被回收了，然后 foo 这个变量本身也占用的空间也被回收了。

```javascript
let foo = { name : 'foo'}

let bar = foo

foo = null
```

比如这段代码，foo都已经null了，那foo回收了吗？这个问题本身就不准确。foo是一个变量，简单看它记录了所指向的那份数据的指针，所以foo = null 只是说把foo 这块新申请的内存gc掉。而它原本指向的那份数据依然被 bar 持有，数据依然不会消失，消失的只是 foo这个变量本身的空间
