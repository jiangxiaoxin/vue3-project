var rotate = function(matrix) {
    
    // var n = matrix.length;
    // var one = new Array(n).fill(null).map(() => [])
    // for (let i = 0; i < n; i++) {
    //     for (let j = 0; j < n; j++) {
    //         one[j][n - 1 - i] = matrix[i][j]
    //     }
    // }
    // return one;

    var n = matrix.length;
    for(let i=0;i<n;i++) {
        for(let j=i;j<n;j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    for(let i=0;i<n;i++) {
        matrix[i].reverse()
    }
    return matrix
};

// var matrix = [
//   [ 5, 1, 9,11],
//   [ 2, 4, 8,10],
//   [13, 3, 6, 7],
//   [15,14,12,16]
// ]

var matrix = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
]

var res = rotate(matrix)
console.log(res)