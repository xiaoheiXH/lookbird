# 观鸟 H5 项目部署说明

## Vercel 部署指南

### 方法一：纯静态部署（推荐，最简单）

由于 Vercel 对文件大小有限制，我们可以：

1. **确保所有文件都上传到 GitHub**
   - 确认 `images/` 文件夹及其内容都已提交
   - 不要上传 `node_modules/`

2. **使用当前配置部署**
   - 项目已包含 `vercel.json`
   - 直接在 Vercel 导入 GitHub 仓库即可

3. **注意**：懂鸟API在纯静态部署时可能会有跨域问题

### 方法二：解决跨域问题

如果懂鸟API跨域，可以：

#### 选项 A：使用 CORS 代理
在 `script.js` 中替换 API 地址：
```javascript
const API_BASE = 'https://api.allorigins.win/raw?url=https://ai.open.hhodata.com/api/v2/dongniao';
```

#### 选项 B：使用 Vercel Serverless Functions
创建 `api/proxy.js` 文件（需要升级配置）

## 检查清单

部署前请确认：
- ✅ `images/` 文件夹中的所有图片文件都已提交到 GitHub
- ✅ 文件夹名称和图片文件名大小写正确
- ✅ `package.json`、`index.html`、`style.css`、`script.js`、`gameState.js` 都已上传
- ✅ `vercel.json` 已上传
- ❌ `node_modules/` 没有上传（已在 .gitignore 中）

## 图片路径检查

所有图片路径都使用 `images/文件名`，这是正确的相对路径，在 Vercel 上应该能正常工作。

## 如果图片仍不显示

1. 在浏览器按 F12 打开开发者工具
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页，检查图片请求的状态
4. 确认 GitHub 仓库中确实包含所有图片文件
