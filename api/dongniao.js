const https = require('https');
const { IncomingForm } = require('formidable-serverless');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = new IncomingForm();
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const FormData = require('form-data');
        const proxyForm = new FormData();

        // 添加文本字段
        Object.keys(fields).forEach(key => {
            const value = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
            if (value !== undefined) {
                proxyForm.append(key, value);
            }
        });

        // 添加文件字段
        Object.keys(files).forEach(key => {
            const file = Array.isArray(files[key]) ? files[key][0] : files[key];
            if (file && file.filepath) {
                proxyForm.append(key, require('fs').createReadStream(file.filepath), {
                    filename: file.originalFilename,
                    contentType: file.mimetype
                });
            }
        });

        const options = {
            hostname: 'ai.open.hhodata.com',
            port: 443,
            path: '/api/v2/dongniao',
            method: 'POST',
            headers: {
                'api_key': req.headers['api_key'] || '',
                ...proxyForm.getHeaders()
            }
        };

        const proxyReq = https.request(options, (proxyRes) => {
            let data = '';
            proxyRes.on('data', (chunk) => {
                data += chunk;
            });
            proxyRes.on('end', () => {
                console.log('API响应:', data);
                res.status(proxyRes.statusCode).send(data);
            });
        });

        proxyReq.on('error', (e) => {
            console.error('代理错误:', e);
            res.status(500).json({ error: '代理请求失败' });
        });

        proxyForm.pipe(proxyReq);

    } catch (error) {
        console.error('处理请求错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
};
