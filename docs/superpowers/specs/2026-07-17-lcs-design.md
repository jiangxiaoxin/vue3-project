# 最长公共子序列（LCS）设计说明

日期：2026-07-17

## 目标

用 JavaScript 实现最长公共子序列（Longest Common Subsequence）算法：对两个字符串求出 LCS 长度，并通过回溯从 DP 表中还原**一条**长度为该最优长度的公共子序列。子序列可不连续；最优解可能不唯一，本实现只保证输出其中一条。

交付物为单个可直接运行的 `lcs.js`（含函数实现 + 底部示例调用），放在 `C:\D\vue-project` 根目录。

## 非目标

- 不求所有 LCS（只还原一条）
- 不是最长公共子串（不要求字符连续）
- 不做空间优化滚动数组（为便于教学与返回完整 `dp`）
- 不接入 Vue 路由/组件（独立脚本，与现有前端应用解耦）

## API

```js
/**
 * @param {string} str1
 * @param {string} str2
 * @returns {{ length: number, dp: number[][], sequence: string }}
 */
function longestCommonSubsequence(str1, str2)
```

返回字段：

| 字段 | 含义 |
|------|------|
| `length` | LCS 长度，等于 `dp[m][n]` |
| `dp` | 完整二维 DP 表，尺寸 `(m+1) × (n+1)` |
| `sequence` | 回溯得到的一条 LCS 字符串 |

入参校验：`str1`、`str2` 必须为字符串，否则抛出 `TypeError`。空串合法，结果为 `{ length: 0, sequence: "", dp: ... }`。

## 算法

### 状态定义

设 `m = str1.length`，`n = str2.length`。

`dp[i][j]`：`str1` 的前 `i` 个字符（`str1[0..i-1]`）与 `str2` 的前 `j` 个字符（`str2[0..j-1]`）的 LCS 长度。

边界：`dp[0][j] = 0`，`dp[i][0] = 0`（任一前缀为空时 LCS 长度为 0）。

### 状态转移

对 `i = 1..m`，`j = 1..n`：

1. 若 `str1[i-1] === str2[j-1]`：`dp[i][j] = dp[i-1][j-1] + 1`
2. 否则：`dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

### 回溯还原一条序列

从 `(i, j) = (m, n)` 出发，向前回溯，字符收集到数组后 `reverse` 拼接：

1. 若 `i === 0` 或 `j === 0`：结束
2. 若 `str1[i-1] === str2[j-1]`：收录该字符，然后 `i--, j--`
3. 否则：若 `dp[i-1][j] >= dp[i][j-1]`，则 `i--`（优先向上）；否则 `j--`（向左）

约定「相等时优先向上」保证同一输入下结果确定。

### 复杂度

- 时间：`O(mn)`（填表 + 回溯至多 `O(m+n)`）
- 空间：`O(mn)`（完整 DP 表）

## 文件结构

```
C:\D\vue-project\
  lcs.js                                          # 实现 + 示例
  docs/superpowers/specs/2026-07-17-lcs-design.md # 本设计文档
```

`lcs.js` 要求：

- 中文严谨注释：状态定义、转移方程、回溯约定、复杂度、返回值说明
- 底部示例：经典用例 `ABCBDAB` / `BDCAB`，打印 `length`、`sequence`，并可酌情打印 `dp`
- 可用 `node lcs.js` 直接运行

## 验证

手动运行 `node lcs.js`，确认：

1. `length` 与已知最优长度一致（例如上述用例长度为 4）
2. `sequence.length === length`
3. `sequence` 分别是两个输入串的子序列（相对顺序保持，允许跳过字符）
