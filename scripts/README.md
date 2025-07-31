# 构建脚本说明

## 功能特性

这个构建脚本会自动：
1. 读取 `package.json` 中的当前版本号
2. 根据指定的更新类型增加版本号
3. 更新 `package.json` 文件
4. 运行构建命令
5. 生成指定格式的文件名：`[name]-[hash]-[version]`

## 使用方法

### 基本构建（patch 版本）
```bash
npm run build
```
或者
```bash
node scripts/build.js
```

### 指定版本更新类型

#### Patch 版本（修复版本）
```bash
npm run build patch
# 或
node scripts/build.js patch
```
例如：`0.0.0` → `0.0.1`

#### Minor 版本（次要版本）
```bash
npm run build minor
# 或
node scripts/build.js minor
```
例如：`0.0.1` → `0.1.0`

#### Major 版本（主要版本）
```bash
npm run build major
# 或
node scripts/build.js major
```
例如：`0.1.0` → `1.0.0`

## 生成的文件名格式

构建完成后，生成的文件将使用以下格式：
- JavaScript 文件：`[name]-[hash]-[version].js`
- CSS 文件：`[name]-[hash]-[version].css`
- 其他资源：`[name]-[hash]-[version].[ext]`

例如：
- `main-a1b2c3d4-0.0.1.js`
- `vendor-e5f6g7h8-0.0.1.js`
- `style-i9j0k1l2-0.0.1.css`

## 注意事项

1. 构建脚本会自动更新 `package.json` 中的版本号
2. 如果构建失败，版本号仍然会被更新
3. 建议在版本控制中提交更新后的 `package.json`
4. 构建文件会输出到 `dist` 目录 