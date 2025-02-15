export class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null

  constructor(v: number) {
    this.val = v
    this.left = null
    this.right = null
  }

  get leftVal() {
    return this.left?.val
  }

  get rightVal() {
    return this.right?.val
  }
}

export function array2Tree(numArray: number[]) {
  let string = `${numArray}`
  return string2Tree(string)
}

/**
 * ! '[1,2,3,null, null, 4, 5]'
 * 
 *       1         // 根节点在第一层居中
        / \
        2   3       // 第二层：左子节点 2，右子节点 3
           / \
          4   5    // 第三层：3 的左右子节点 4 和 5
 */
export function string2Tree(arrayLikeString: string) {
  let string = arrayLikeString.slice(1, -1)
  let nodes = string.split(',').map((str) => {
    if (str.trim() === 'null') {
      return null
    }
    return new TreeNode(Number(str.trim()))
  })

  let root = nodes[0]

  let queue = [root]
  let count = nodes.length
  let index = 1
  while (queue.length) {
    let target = queue.shift()
    if (index >= count) {
      break
    }
    let left = nodes[index++]
    if (left) {
      target!.left = left
      queue.push(left)
    }

    if (index >= count) {
      break
    }
    let right = nodes[index++]
    if (right) {
      target!.right = right
      queue.push(right)
    }
  }
  return root
}

export function tree2Array(root: TreeNode) {
  let queue = [root]
  let output = []
  while (queue.length) {
    let first = queue.shift()
    output.push(first!.val)
  }
}

export function tree2String(root: TreeNode) {
  let array = tree2Array(root)
  return
}
