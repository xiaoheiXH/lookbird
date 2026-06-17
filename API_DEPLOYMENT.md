# 懂鸟API部署说明

## ⚠️ 重要：关于CORS跨域问题

懂鸟AI API (`https://ai.open.hhodata.com`) **不允许直接从浏览器调用**，会遇到跨域(CORS)问题。

---

## ✅ 本地开发（完全正常）

使用项目自带的 `server.js`，启动本地服务器：
```bash
npm install
npm start
```
访问：http://localhost:3000
- API调用通过本地代理，完全正常

---

## 🌐 Vercel部署解决方案

### 方案一：使用Cloudflare Workers代理（推荐）

1. 注册 Cloudflare 账号
2. 创建一个 Worker
3. 复制以下代码：
```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = 'https://ai.open.hhodata.com/api/v2/dongniao';
    
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    
    const response = await fetch(newRequest);
    
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', '*');
    
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });
  }
};
```
4. 部署 Worker，得到一个 URL（如：`https://your-worker.your-name.workers.dev`）
5. 修改 `script.js` 中的 API 地址为您的 Worker URL

### 方案二：使用其他云函数平台

- Vercel Serverless Functions（需要调整代码处理文件上传）
- Netlify Functions
- AWS Lambda
- 阿里云/腾讯云云函数

### 方案三：仅本地使用（最简单）

如果只需要本地演示：
1. 保持现状
2. 本地运行 `npm start`
3. 功能完全正常

---

## 📝 当前代码说明

当前代码已经做了以下优化：
1. ✅ 移除复杂的 serverless function
2. ✅ 简化 `vercel.json` 配置
3. ✅ 直接尝试调用懂鸟API（有CORS问题时会尝试代理）
4. ✅ 保留完整的本地开发功能

---

## 🎯 推荐方案

**如果主要是本地演示：** 使用方案三，直接本地运行即可

**如果必须部署到公网：** 使用方案一，通过 Cloudflare Workers 做代理
