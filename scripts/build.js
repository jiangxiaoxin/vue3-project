const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取命令行参数
const args = process.argv.slice(2);
const updateType = args[0] || 'patch'; // 默认是 patch 版本

// 读取 package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 解析当前版本号
const currentVersion = packageJson.version;
console.log(`当前版本: ${currentVersion}`);

// 版本号更新函数
function updateVersion(version, type) {
  const parts = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  return parts.join('.');
}

// 更新版本号
const newVersion = updateVersion(currentVersion, updateType);
console.log(`更新类型: ${updateType}`);
console.log(`新版本: ${newVersion}`);

// 更新 package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('package.json 已更新');

// 设置环境变量供 Vite 使用
process.env.BUILD_VERSION = newVersion;

// 运行构建命令
console.log('开始构建...');
try {
  execSync('npm run build-only', { stdio: 'inherit' });
  console.log('构建完成');
  console.log(`构建文件已生成，版本: ${newVersion}`);
} catch (error) {
  console.error('构建失败:', error.message);
  process.exit(1);
} 