/**
 * 最长公共子序列（Longest Common Subsequence, LCS）
 *
 * 说明：
 * - 「子序列」允许不连续，只需保持相对顺序（区别于「子串」必须连续）。
 * - 最优解可能不唯一；本实现通过回溯只还原其中一条，保证 length 最优。
 *
 * 复杂度：
 * - 时间 O(m*n)：填表；回溯额外 O(m+n)
 * - 空间 O(m*n)：完整二维 DP 表
 *
 * @param {string} str1 第一个字符串
 * @param {string} str2 第二个字符串
 * @returns {{ length: number, dp: number[][], sequence: string }}
 *   - length: LCS 长度，等于 dp[m][n]
 *   - dp: 完整 DP 表，尺寸 (m+1)×(n+1)
 *   - sequence: 回溯得到的一条 LCS
 */
function longestCommonSubsequence(str1, str2) {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') {
    throw new TypeError('str1 与 str2 必须为字符串');
  }

  const m = str1.length;
  const n = str2.length;

  // dp[i][j] = str1 前 i 个字符与 str2 前 j 个字符的 LCS 长度
  // 边界：dp[0][*] = dp[*][0] = 0（任一前缀为空时长度为 0）
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // 状态转移：
  // 1) str1[i-1] === str2[j-1] → dp[i][j] = dp[i-1][j-1] + 1
  // 2) 否则 → dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 从右下角回溯还原一条序列（最优解不唯一时结果确定）：
  // - 字符相等：收录并走向左上
  // - 否则：dp[i-1][j] >= dp[i][j-1] 时优先向上，否则向左
  const chars = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      chars.push(str1[i - 1]);
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }
  chars.reverse();

  return {
    length: dp[m][n],
    dp,
    sequence: chars.join(''),
  };
}

/**
 * 判断 candidate 是否为 text 的子序列（保持相对顺序，允许跳过字符）。
 * @param {string} text
 * @param {string} candidate
 * @returns {boolean}
 */
function isSubsequence(text, candidate) {
  let k = 0;
  for (let i = 0; i < text.length && k < candidate.length; i++) {
    if (text[i] === candidate[k]) k += 1;
  }
  return k === candidate.length;
}

// ---------- 示例与断言（直接运行：node lcs.js）----------
const str1 = 'ABCBDAB';
const str2 = 'BDCAB';
const result = longestCommonSubsequence(str1, str2);

console.log('输入:', str1, '/', str2);
console.log('LCS 长度:', result.length);
console.log('LCS 序列:', result.sequence);
console.log('DP 表:');
console.table(result.dp);

if (result.length !== 4) {
  throw new Error(`期望 length === 4，实际为 ${result.length}`);
}
if (result.sequence.length !== result.length) {
  throw new Error('sequence.length 必须等于 length');
}
if (!isSubsequence(str1, result.sequence) || !isSubsequence(str2, result.sequence)) {
  throw new Error('sequence 必须同时是两个输入的子序列');
}

// 空串边界
const empty = longestCommonSubsequence('', 'ABC');
if (empty.length !== 0 || empty.sequence !== '') {
  throw new Error('空串边界失败');
}

// 入参校验
let threw = false;
try {
  longestCommonSubsequence(1, 'a');
} catch (e) {
  threw = e instanceof TypeError;
}
if (!threw) {
  throw new Error('非字符串入参应抛出 TypeError');
}

console.log('全部断言通过');

module.exports = { longestCommonSubsequence, isSubsequence };
