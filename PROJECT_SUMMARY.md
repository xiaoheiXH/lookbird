# 观鸟 H5 交互设计项目 - 完整总结文档

## 📋 项目概述
这是一个基于 HTML/CSS/JavaScript 的 H5 观鸟交互项目，支持：
- 场景探索模式
- 拍照/上传识别鸟类（使用懂鸟AI API）
- 鸟类图鉴展示
- 支持 PC 和移动端适配

## 🎯 项目状态
✅ **当前已完成功能**

---

## 📁 文件结构
```
guanniao/
├── api/
│   └── dongniao.js          # Vercel Serverless Function - 懂鸟API代理
├── images/                  # 所有图片资源
│   ├── zhujiemian.jpg
│   ├── zhujiemian2.jpg
│   ├── beijin.png
│   ├── re-box.png
│   ├── box1.png
│   ├── camera(1).png
│   ├── camera(2).png
│   ├── camerabord.png
│   ├── 焦距调节.svg
│   ├── 按钮.png
│   ├── book.png
│   ├── book_bird1.jpg
│   ├── lookbook.png
│   ├── 场景选择_木塞板_背景1.png
│   ├── 场景选择_河口湿地公园_小图.png
│   ├── 场景_河口湿地公园01_场景图01_底图.png
│   ├── 场景_河口湿地公园01_场景图01_交互01.png
│   ├── 场景_河口湿地公园01_场景图01_交互02.png
│   ├── 场景_河口湿地公园01_场景图01_交互03.png
│   ├── 场景_河口湿地公园01_过场图01.png
│   ├── 拍摄_河口湿地公园01_场景图01_交互01_背景图.png
│   ├── 鸟_白鹭01_水上_取景.png
│   └── 鸟_白鹭01_水上_拍摄.png
├── index.html               # 主页面 - 包含所有场景结构
├── style.css                # 所有样式文件
├── script.js                # 主要逻辑 - 包含所有交互和API调用
├── gameState.js             # 游戏状态管理
├── server.js                # 本地开发服务器（Express）
├── package.json             # 项目依赖配置
├── package-lock.json        # 依赖锁定文件
├── vercel.json              # Vercel部署配置
├── .gitignore               # Git忽略文件
├── DEPLOY.md                # 部署说明文档
├── doc.json                 # 懂鸟API文档
└── zhujiemian.jpg           # 冗余图片（可忽略）
```

---

## 🎮 场景流程说明

### 1️⃣ 主菜单场景 (`#main-menu`)
- 背景：`zhujiemian2.jpg`
- 功能：
  - 开始探索按钮 → 进入装备选取场景
  - 福州市区鸟类识别按钮 → 进入上传识别场景
  - 图鉴按钮 → 进入图鉴场景
  - 设置按钮（预留功能）

### 2️⃣ 装备选取场景 (`#equipment-select`)
- 背景：`beijin.png`
- 功能：点击 `re-box.png` → 进入相机选取场景

### 3️⃣ 相机选取场景 (`#camera-select`)
- 背景：`box1.png`
- 功能：点击 `camera(1).png` 或 `camera(2).png` 选择相机 → 进入场景选择页面

### 4️⃣ 场景选择场景 (`#scene-selection`)
- 背景：`场景选择_木塞板_背景1.png`
- 功能：点击场景缩略图（目前是河口湿地公园）→ 进入场景01

### 5️⃣ 场景01：河口湿地公园 (`#scene-hekou-01`)
- 背景：`场景_河口湿地公园01_场景图01_底图.png`
- 功能：点击交互点03 → 进入 Touch 观察阶段

---

### 6️⃣ Touch 观察阶段 (`#touch-scene`)
**重要核心场景**
- UI结构：与 Camera 阶段一致
- 包含：`camerabord.png` 相机边框
- 背景：300% 超大背景（支持拖拽平移）
- 中心有一个白色圆形指示器
- 右侧有焦距调节 UI（禁用状态）
- 功能：
  - 拖拽世界移动背景和鸟类
  - 当鸟类进入中心区域时 → 自动触发成功 → 进入 Camera 阶段

---

### 7️⃣ Camera 拍摄阶段 (`#camera-view`)
- UI结构：与 Touch 阶段完全一致（无缝衔接）
- 相机边框：`camerabord.png`
- 右上角：`按钮.png` 结束按钮
- 右侧：焦距调节 UI（可交互）
- 功能：
  - 点击右上角结束按钮 → 进入图鉴场景
  - 焦距调节旋钮可旋转
  - 场景锁定，不可拖拽

---

### 8️⃣ 上传识别场景 (`#upload-scene`)
- 背景：深色背景（#2c3e50）
- 功能：
  - 选择图片或拍照
  - 文件大小限制：2MB
  - 点击识别按钮 → 调用懂鸟AI API
  - 识别成功后 → 显示鸟类详情场景

---

### 9️⃣ 鸟类详情场景 (`#bird-detail-scene`)
- 背景：`lookbook.png`（与图鉴页面一致）
- 功能：显示懂鸟AI识别出的鸟类信息（中文名、拉丁名、置信度、百科介绍）

---

### 🔟 图鉴场景 (`#lookbook-scene`)
- 背景：`lookbook.png`
- 内容：
  - 左侧：`book_bird1.jpg` 大白鹭图片
  - 右侧：大白鹭详细介绍文本

---

## 🎨 样式和布局
### 核心容器
- `#game-container`：固定尺寸 1280x720px，使用 `transform: scale()` 自适应屏幕
- 场景切换：通过 `scene` 类 + `active` 类控制显示/隐藏

### 响应式设计
- PC端/横屏：保持1280x720比例，居中缩放
- 手机/竖屏：自动旋转90度，保持1280x720比例

---

## 🔌 API 集成说明

### 懂鸟AI API
- **API Key**：`BmVwWZ6fxwsaSvrZ8AEmkeZT`
- **API文档**：见 `doc.json`
- **代理实现**：
  - 本地开发：`server.js` 中的代理（完全正常工作）
  - Vercel部署：需要额外的代理服务（见 `API_DEPLOYMENT.md`）

### ⚠️ 重要：关于CORS跨域问题
懂鸟AI API (`https://ai.open.hhodata.com`) **不允许直接从浏览器调用**，会遇到跨域问题：
- ✅ **本地开发**：`npm start` 启动本地服务器，代理正常工作
- ❌ **Vercel纯静态部署**：需要额外的代理服务（推荐 Cloudflare Workers）
- 详细解决方案见 `API_DEPLOYMENT.md`

### API流程
1. 上传图片 → 获得 recognitionId
2. 轮询查询识别结果
3. 获取到鸟类信息
4. 根据动物ID获取百科资料
5. 显示详情页面

---

## 🚀 部署说明

### 本地开发
```bash
npm install
npm start
访问：http://localhost:3000
```

### Vercel 部署
- 已配置 `vercel.json`
- 直接连接 GitHub 仓库即可自动部署
- 静态资源 + Serverless Function 代理

---

## ⚠️ 已知问题和待优化
1. 场景选择页面、Touch阶段、Camera阶段 可以进一步优化视觉效果
2. 图鉴目前只有一个示例，可以扩展更多鸟类
3. 懂鸟API调用可能有配额限制，注意监控使用量

---

## 📝 核心技术要点
- **纯前端**：HTML + CSS + JavaScript（无框架）
- **固定分辨率自适应**：1280x720 基准 + scale 缩放
- **场景管理**：多个 section 切换，通过 active 类控制
- **API代理**：解决跨域问题
- **图片压缩/验证**：文件大小限制

---

## 🎯 给下一位开发者的建议
1. 先从 `index.html` 了解页面结构
2. 再看 `style.css` 了解样式
3. 最后看 `script.js` 理解交互逻辑
4. 主要流程在 script.js 的 switchScene 和各个按钮事件中
5. API 调用部分在 uploadImage, pollRecognitionResult, getEncyclopediaData 函数
