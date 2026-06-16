const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件：解析 JSON
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 懂鸟API代理 - 用原生http模块实现
app.use('/api/dongniao', (req, res) => {
    const options = {
        hostname: 'ai.open.hhodata.com',
        port: 443,
        path: '/api/v2/dongniao',
        method: req.method,
        headers: {
            ...req.headers,
            host: 'ai.open.hhodata.com'
        }
    };

    console.log('代理请求:', req.method, options.path);

    const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => {
            data += chunk;
        });
        proxyRes.on('end', () => {
            console.log('代理响应:', data);
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            res.end(data);
        });
    });

    proxyReq.on('error', (e) => {
        console.error('代理请求出错:', e);
        res.status(500).json({ error: '代理请求失败' });
    });

    req.pipe(proxyReq);
});

// --- API 预留 ---

// 获取图鉴数据
app.get('/api/collection', (req, res) => {
    // 这里将来会从数据库获取
    res.json({
        success: true,
        data: []
    });
});

// 保存游戏进度
app.post('/api/save-progress', (req, res) => {
    const { userId, sceneId, progress } = req.body;
    console.log(`Saving progress for user ${userId}: Scene ${sceneId}`);
    res.json({
        success: true,
        message: '进度已保存'
    });
});

// 获取设置
app.get('/api/settings', (req, res) => {
    res.json({
        musicVolume: 0.8,
        soundVolume: 1.0,
        language: 'zh-CN'
    });
});

// 所有其他路由指向 index.html (SPA 模式)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`服务器已启动：http://localhost:${PORT}`);
});
