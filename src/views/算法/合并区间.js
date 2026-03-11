
// 56. 合并区间
var merge = function(intervals) {
    var sorted = intervals.sort((a,b)=>a[0]-b[0])
    var arrs = [sorted[0]]
    var target = sorted[0]
    for(var i=1;i<sorted.length;i++){
        var temp = sorted[i]
        if(temp[0] > target[1]) {
            //两者没有交集
            arrs.push(temp)
            target = temp

        } else if(temp[0] == target[1]) {
            // 正好能连起来
            target[1] = temp[1]
        } else {
            // temp[0] < target[1] 这时候一定有交集，但是要处理右侧的边界
            target[1] = Math.max(target[1],temp[1])
        }

    }

    return arrs
};

var intervals = [[1,3],[2,6],[8,10],[15,18]];

console.log(merge(intervals));