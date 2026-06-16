document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start');
    const btnSettings = document.getElementById('btn-settings');
    const btnCollection = document.getElementById('btn-collection');

    // --- 后端交互预留 ---
    const API = {
        async getSettings() {
            try {
                const response = await fetch('/api/settings');
                return await response.json();
            } catch (e) {
                console.warn('后端 API 未就绪，使用本地默认设置');
                return { musicVolume: 0.8, soundVolume: 1.0 };
            }
        },
        async saveProgress(sceneId) {
            console.log(`正在保存场景 ${sceneId} 的进度...`);
            // await fetch('/api/save-progress', { method: 'POST', ... });
        }
    };

    // 初始化加载
    API.getSettings().then(settings => {
        console.log('游戏设置已加载:', settings);
    });

    // 适配缩放逻辑
    function handleResize() {
        const container = document.getElementById('game-container');
        const designWidth = 1280;
        const designHeight = 720;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 计算缩放比例
        let scale = 1;
        const isPortrait = windowHeight > windowWidth;

        if (isPortrait) {
            // 移动端竖屏：旋转并缩放
            scale = Math.min(windowHeight / designWidth, windowWidth / designHeight);
            container.style.transform = `translate(-50%, -50%) rotate(90deg) scale(${scale})`;
        } else {
            // PC端或移动端横屏
            scale = Math.min(windowWidth / designWidth, windowHeight / designHeight);
            container.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
        
        // 始终居中
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.top = '50%';
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化执行一次

    // 开始按钮点击
    btnStart.addEventListener('click', () => {
        console.log('开始探索...');
        API.saveProgress('start-page');
        
        // 切换到装备选取页面
        document.getElementById('main-menu').classList.remove('active');
        document.getElementById('equipment-select').classList.add('active');
    });

    // 点击 re-box.png 跳转到相机选取页面
    const imgReBox = document.getElementById('img-re-box');
    if (imgReBox) {
        imgReBox.addEventListener('click', () => {
            console.log('跳转到相机选取...');
            document.getElementById('equipment-select').classList.remove('active');
            document.getElementById('camera-select').classList.add('active');
        });
    }

    // --- 相机选择逻辑 ---
    const camera1 = document.querySelector('.camera-1');
    const camera2 = document.querySelector('.camera-2');

    if (camera1) {
        camera1.addEventListener('click', () => {
            selectEquipment('camera', 'camera-1');
        });
    }

    if (camera2) {
        camera2.addEventListener('click', () => {
            selectEquipment('camera', 'camera-2');
        });
    }

    /**
     * 选择装备并记录到全局状态
     * @param {string} type 装备类型
     * @param {string} model 装备型号
     */
    function selectEquipment(type, model) {
        console.log(`已选择装备: ${type} - ${model}`);
        
        // 保存到 gameState.js 定义的全局对象中
        if (window.GameData) {
            window.GameData.equipment = {
                type: type,
                model: model,
                selectedAt: new Date().toISOString()
            };
            window.GameData.showStatus(); // 调试打印
        }

        alert(`您已选择: ${model}`);
        
        // 跳转到场景选择页面
        document.getElementById('camera-select').classList.remove('active');
        document.getElementById('scene-selection').classList.add('active');
    }

    // --- 场景选择与跳转逻辑 ---
    const thumbHekou = document.getElementById('thumb-hekou');
    if (thumbHekou) {
        thumbHekou.addEventListener('click', () => {
            console.log('选择场景：河口湿地公园01');
            if (window.GameData) {
                window.GameData.currentScene = 'scene-hekou-01';
                window.GameData.showStatus();
            }
            // 跳转到场景01
            document.getElementById('scene-selection').classList.remove('active');
            document.getElementById('scene-hekou-01').classList.add('active');
        });
    }

    // --- 场景01 交互点逻辑 ---
    const point3 = document.querySelector('.point-3');
    if (point3) {
        point3.addEventListener('click', () => {
            console.log('点击了交互点03，进入 Touch 环节');
            startTouchScene('bird01', 'water', '拍摄_河口湿地公园01_场景图01_交互01_背景图.png');
        });
    }

    const points = document.querySelectorAll('.point');
    points.forEach((point, index) => {
        // ... 其他交互点逻辑保持预留
    });

    /**
     * 开始 Touch 环节
     * @param {string} birdId 鸟类ID
     * @param {string} stateKey 环境状态(如 water)
     * @param {string} bgImage 背景图文件名
     */
    function startTouchScene(birdId, stateKey, bgImage) {
        const touchScene = document.getElementById('touch-scene');
        const touchWorld = document.getElementById('touch-world');
        const birdImg = document.getElementById('bird-portrait');
        const birdData = window.GameData.birds[birdId];
        
        // 记录数据到全局状态
        window.GameData.touchData = {
            birdId: birdId,
            birdState: stateKey,
            bgImage: bgImage, // 保存背景图
            isSuccess: false,
            worldX: -640,
            worldY: -360
        };

        // 设置背景
        const bgLayer = touchScene.querySelector('.background-layer');
        bgLayer.style.backgroundImage = `url('images/${bgImage}')`;
        
        // 设置初始立绘 (取景图)
        birdImg.src = `images/${birdData.states[stateKey].touch}`;
        
        // 随机放置鸟类在“世界”中的位置 (50%附近)
        const birdWorldX = 50 + (Math.random() - 0.5) * 20; // 40% - 60%
        const birdWorldY = 50 + (Math.random() - 0.5) * 20; 
        birdImg.style.left = birdWorldX + '%';
        birdImg.style.top = birdWorldY + '%';
        
        // 应用初始位置
        updateTouchWorldPosition();
        
        // 切换场景
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
        touchScene.classList.add('active');
    }

    // --- 拖拽 Panning 逻辑 ---
    let isPanning = false;
    let startX, startY;
    let initialWorldX, initialWorldY;

    const touchScene = document.getElementById('touch-scene');
    
    touchScene.addEventListener('mousedown', (e) => {
        if (window.GameData.touchData.isSuccess) return;
        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
        initialWorldX = window.GameData.touchData.worldX;
        initialWorldY = window.GameData.touchData.worldY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // 更新世界坐标
        window.GameData.touchData.worldX = initialWorldX + dx;
        window.GameData.touchData.worldY = initialWorldY + dy;
        
        // 限制拖拽边界 (300% 背景，容器 1280x720)
        // 世界大小 3840x2160
        const minX = -(3840 - 1280);
        const minY = -(2160 - 720);
        window.GameData.touchData.worldX = Math.max(minX, Math.min(0, window.GameData.touchData.worldX));
        window.GameData.touchData.worldY = Math.max(minY, Math.min(0, window.GameData.touchData.worldY));
        
        updateTouchWorldPosition();
        checkBirdCentered();
    });

    window.addEventListener('mouseup', () => {
        isPanning = false;
    });

    function updateTouchWorldPosition() {
        const touchWorld = document.getElementById('touch-world');
        const data = window.GameData.touchData;
        touchWorld.style.left = data.worldX + 'px';
        touchWorld.style.top = data.worldY + 'px';
    }

    function checkBirdCentered() {
        const birdImg = document.getElementById('bird-portrait');
        const viewport = document.getElementById('touch-viewport'); // 使用视口作为对准参考
        const data = window.GameData.touchData;
        if (data.isSuccess) return;

        // 获取鸟类和视口的矩形信息
        const birdRect = birdImg.getBoundingClientRect();
        const viewportRect = viewport.getBoundingClientRect();
        
        // 计算视口中心点
        const viewportCenterX = viewportRect.left + viewportRect.width / 2;
        const viewportCenterY = viewportRect.top + viewportRect.height / 2;
        
        // 计算鸟类中心点
        const birdCenterX = birdRect.left + birdRect.width / 2;
        const birdCenterY = birdRect.top + birdRect.height / 2;
        
        const distance = Math.sqrt(Math.pow(birdCenterX - viewportCenterX, 2) + Math.pow(birdCenterY - viewportCenterY, 2));
        
        // 考虑缩放
        const container = document.getElementById('game-container');
        const containerRect = container.getBoundingClientRect();
        const scale = containerRect.width / 1280;
        const tolerance = 30 * scale; // 收紧判定：从 60px 缩小到 30px
        
        if (distance < tolerance) {
            triggerTouchSuccess();
        }
    }

    function triggerTouchSuccess() {
        console.log('Touch 成功！视觉对齐中...');
        const data = window.GameData.touchData;
        data.isSuccess = true;
        
        // 获取当前 Touch 场景的实际偏移量
        const touchWorld = document.getElementById('touch-world');
        const currentWorldX = parseFloat(touchWorld.style.left) || -640;
        const currentWorldY = parseFloat(touchWorld.style.top) || -360;

        // 因为现在 Touch 和 Camera 的 UI 结构完全一致，
        // 我们只需要直接传递坐标，无需再做视口抵消计算。
        data.savedWorldX = currentWorldX;
        data.savedWorldY = currentWorldY;

        // 记录鸟类立绘的百分比位置
        const birdImg = document.getElementById('bird-portrait');
        data.savedBirdLeft = birdImg.style.left;
        data.savedBirdTop = birdImg.style.top;

        // 跳转到 Camera 场景
        enterCameraScene(data);
    }

    // --- Camera 场景逻辑 ---
    function enterCameraScene() {
        const data = window.GameData.touchData;
        const birdId = data.birdId;
        const stateKey = data.birdState;
        const bgImage = data.bgImage || '拍摄_河口湿地公园01_场景图01_交互01_背景图.png';
        
        // 初始化 Camera 场景
        const cameraScene = document.getElementById('camera-view');
        const cameraTouchWorld = document.getElementById('camera-touch-world');
        const cameraBg = document.getElementById('camera-background');
        const cameraBird = document.getElementById('camera-bird-portrait');
        const birdData = window.GameData.birds[birdId];

        // 设置背景和鸟类 (300% 缩放世界
        cameraBg.style.backgroundImage = `url('images/${bgImage}')`;
        cameraBird.src = `images/${birdData.states[stateKey].touch}`;
        
        // 保持原世界的鸟类位置
        cameraBird.style.left = data.savedBirdLeft;
        cameraBird.style.top = data.savedBirdTop;

        // 固定世界位置，确保鸟类在视口中可见
        cameraTouchWorld.style.position = 'absolute';
        cameraTouchWorld.style.width = '300%';
        cameraTouchWorld.style.height = '300%';
        cameraTouchWorld.style.left = (data.savedWorldX || -640) + 'px';
        cameraTouchWorld.style.top = (data.savedWorldY || -360) + 'px';
        cameraTouchWorld.style.transition = 'none';

        // 切换到 Camera 场景
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
        cameraScene.classList.add('active');

        // 初始化焦距调节
        initZoomControl();
    }

    let cameraWorldX = -640;
    let cameraWorldY = -360;
    let isCameraPanning = false;
    let cameraStartX, cameraStartY;
    let cameraInitialX, cameraInitialY;

    function initCameraPanning() {
        // Camera场景锁定为不可移动
        const cameraViewport = document.querySelector('.camera-viewport');
        cameraViewport.style.cursor = 'default';
    }

    function updateCameraWorldPosition() {
        const cameraTouchWorld = document.getElementById('camera-touch-world');
        cameraTouchWorld.style.position = 'absolute';
        cameraTouchWorld.style.width = '300%';
        cameraTouchWorld.style.height = '300%';
        cameraTouchWorld.style.left = cameraWorldX + 'px';
        cameraTouchWorld.style.top = cameraWorldY + 'px';
        cameraTouchWorld.style.transition = 'transform 0.1s ease-out';
    }

    let currentZoomAngle = 0;
    let isZoomDragging = false;
    let zoomStartAngle = 0;
    let zoomInitialAngle = 0;
    
    function initZoomControl() {
        const zoomControl = document.getElementById('zoom-control');
        
        // 记录初始角度
        zoomInitialAngle = currentZoomAngle;
        
        zoomControl.addEventListener('mousedown', (e) => {
            isZoomDragging = true;
            zoomStartAngle = getAngle(e);
            zoomInitialAngle = currentZoomAngle;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isZoomDragging) return;
            
            const currentAngle = getAngle(e);
            let deltaAngle = currentAngle - zoomStartAngle;
            
            // 处理跨0度的情况
            if (deltaAngle > 180) deltaAngle -= 360;
            if (deltaAngle < -180) deltaAngle += 360;
            
            // 计算新角度，改为逆时针，并限制在0到-90度
            let newAngle = zoomInitialAngle + deltaAngle;
            newAngle = Math.max(-90, Math.min(0, newAngle));
            
            currentZoomAngle = newAngle;
            zoomControl.style.transform = `rotate(${currentZoomAngle}deg)`;
        });

        window.addEventListener('mouseup', () => {
            isZoomDragging = false;
        });
    }

    // 计算鼠标相对于元素中心的角度
    function getAngle(e) {
        const zoomControl = document.getElementById('zoom-control');
        const rect = zoomControl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 计算弧度并转换为角度
        const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let degrees = radians * (180 / Math.PI);
        
        // 调整为0-360度
        degrees = (degrees + 360) % 360;
        return degrees;
    }

    // 设置按钮点击
    btnSettings.addEventListener('click', () => {
        console.log('打开设置...');
        alert('设置功能预留');
    });

    // 图鉴按钮点击
    btnCollection.addEventListener('click', () => {
        console.log('查看图鉴...');
        switchScene('lookbook-scene');
    });

    // 图鉴返回按钮
    const btnBackLookbook = document.getElementById('btn-back-lookbook');
    btnBackLookbook.addEventListener('click', () => {
        switchScene('main-menu');
    });

    // 福州市区鸟类识别按钮
    const btnIdentify = document.getElementById('btn-identify');
    btnIdentify.addEventListener('click', () => {
        switchScene('upload-scene');
    });

    // 上传页面元素
    const btnGallery = document.getElementById('btn-gallery');
    const btnCamera = document.getElementById('btn-camera');
    const btnRecognize = document.getElementById('btn-recognize');
    const fileInput = document.getElementById('file-input');
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const btnBackUpload = document.getElementById('btn-back-upload');
    const btnBackDetail = document.getElementById('btn-back-detail');

    let currentImageFile = null;

    // 选择图片
    btnGallery.addEventListener('click', () => {
        fileInput.setAttribute('capture', '');
        fileInput.click();
    });

    // 拍照
    btnCamera.addEventListener('click', () => {
        fileInput.setAttribute('capture', 'environment');
        fileInput.click();
    });

    // 文件选择处理
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            currentImageFile = e.target.files[0];
            
            // 检查文件大小（2MB限制）
            const maxSize = 2 * 1024 * 1024;
            if (currentImageFile.size > maxSize) {
                alert(`图片过大！当前图片大小: ${(currentImageFile.size / 1024 / 1024).toFixed(2)}MB，最大支持2MB。请选择更小的图片。`);
                currentImageFile = null;
                fileInput.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImage.src = event.target.result;
                previewImage.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                btnRecognize.style.display = 'inline-block';
            };
            reader.readAsDataURL(currentImageFile);
        }
    });

    // 返回按钮
    btnBackUpload.addEventListener('click', () => {
        switchScene('main-menu');
        resetUploadPage();
    });

    btnBackDetail.addEventListener('click', () => {
        switchScene('upload-scene');
    });

    function resetUploadPage() {
        currentImageFile = null;
        previewImage.src = '';
        previewImage.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        btnRecognize.style.display = 'none';
        fileInput.value = '';
    }

    function switchScene(sceneId) {
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
        document.getElementById(sceneId).classList.add('active');
    }

    // 懂鸟API配置
    const API_KEY = 'BmVwWZ6fxwsaSvrZ8AEmkeZT';
    const API_BASE = '/api/dongniao'; // 使用本地代理避免跨域

    // 识别鸟类
    btnRecognize.addEventListener('click', async () => {
        if (!currentImageFile) {
            alert('请先选择图片或拍照');
            return;
        }

        btnRecognize.textContent = '识别中...';
        btnRecognize.disabled = true;

        try {
            // 1. 上传图片获取识别ID
            const recognitionId = await uploadImage(currentImageFile);
            console.log('识别ID:', recognitionId);

            // 2. 轮询获取识别结果
            const recognitionResult = await pollRecognitionResult(recognitionId);
            console.log('识别结果:', recognitionResult);

            if (recognitionResult && recognitionResult.length > 0) {
                const firstBird = recognitionResult[0].list[0];
                const confidence = firstBird[0];
                const nameInfo = firstBird[1].split('|');
                const animalId = firstBird[2];
                const animalClass = firstBird[3];

                // 3. 获取百科资料
                const encyclopediaData = await getEncyclopediaData(animalId, animalClass);
                console.log('百科资料:', encyclopediaData);

                // 显示结果
                showBirdDetail(nameInfo, confidence, encyclopediaData);
            } else {
                alert('未能识别出鸟类，请更换图片重试');
            }
        } catch (error) {
            console.error('识别出错:', error);
            alert('识别失败: ' + (error.message || '未知错误'));
        } finally {
            btnRecognize.textContent = '识别鸟类';
            btnRecognize.disabled = false;
        }
    });

    // 上传图片
    async function uploadImage(file) {
        console.log('开始上传图片，文件大小:', file.size, '文件名:', file.name);
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('upload', '1');
        formData.append('class', 'B');
        formData.append('did', generateDeviceId());

        console.log('发送请求到:', API_BASE);
        
        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'api_key': API_KEY
                },
                body: formData
            });

            console.log('响应状态:', response.status);
            
            const text = await response.text();
            console.log('原始响应:', text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.log('响应不是JSON，直接处理');
                result = { raw: text };
            }
            
            console.log('完整响应:', result);
            
            // 处理不同的响应格式
            if (result.status === '1000' || result.data?.[0] === 1000 || result[0] === 1000) {
                const recognitionId = result.data?.[1] || result[1] || result.data?.recognitionId;
                console.log('识别ID:', recognitionId);
                return recognitionId;
            } else {
                const errorMsg = result.message || result.data?.[1] || '上传图片失败';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('上传请求出错:', error);
            throw error;
        }
    }

    // 轮询识别结果
    async function pollRecognitionResult(recognitionId, maxRetries = 15) {
        console.log('开始轮询识别结果，ID:', recognitionId);
        
        for (let i = 0; i < maxRetries; i++) {
            console.log(`第 ${i + 1} 次尝试...`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                const formData = new FormData();
                formData.append('resultid', recognitionId);

                const response = await fetch(API_BASE, {
                    method: 'POST',
                    headers: {
                        'api_key': API_KEY
                    },
                    body: formData
                });

                const text = await response.text();
                console.log('轮询原始响应:', text);
                
                let result;
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    console.log('响应不是JSON，尝试其他格式');
                    result = { raw: text };
                }
                
                console.log('识别结果响应:', result);
                
                // 处理多种响应格式
                if (result.status === '1000' || result.data?.[0] === 1000 || result[0] === 1000) {
                    const data = result.data?.[1] || result[1] || result.data;
                    console.log('识别成功:', data);
                    return data;
                } else if (result.status === '1001' || result.data?.[0] === 1001 || result[0] === 1001) {
                    console.log('结果未就绪，继续等待...');
                    continue;
                } else {
                    const errorMsg = result.message || result.data?.[1] || result[1] || '获取识别结果失败';
                    console.error('识别错误:', errorMsg);
                    throw new Error(errorMsg);
                }
            } catch (error) {
                console.error('轮询请求出错:', error);
                // 如果是最后一次尝试，抛出错误
                if (i === maxRetries - 1) {
                    throw error;
                }
                // 否则继续尝试
                console.log('继续下一次尝试...');
            }
        }
        throw new Error('识别超时，请重试');
    }

    // 获取百科资料
    async function getEncyclopediaData(animalId, animalClass) {
        console.log('获取百科资料，动物ID:', animalId, '类别:', animalClass);
        
        const formData = new FormData();
        formData.append('animalid', animalId.toString());
        formData.append('class', animalClass);

        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'api_key': API_KEY
            },
            body: formData
        });

        const result = await response.json();
        console.log('百科资料响应:', result);
        
        if (result.status === '1000' || result.data?.[0] === 1000 || result[0] === 1000) {
            const data = result.data?.[1] || result[1] || result.data;
            return data;
        } else {
            console.warn('获取百科资料失败:', result);
            return null;
        }
    }

    // 生成设备ID
    function generateDeviceId() {
        let did = localStorage.getItem('deviceId');
        if (!did) {
            did = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('deviceId', did);
        }
        return did;
    }

    // Camera阶段结束按钮
    const cameraEndButton = document.getElementById('camera-end-button');
    cameraEndButton.addEventListener('click', () => {
        console.log('Camera阶段结束，跳转到图鉴页面');
        switchScene('lookbook-scene');
    });

    // 显示鸟类详情
    function showBirdDetail(nameInfo, confidence, encyclopediaData) {
        const detailContent = document.getElementById('bird-detail-content');
        const chineseName = nameInfo[0] || '未知鸟类';
        const englishName = nameInfo[1] || '';
        const latinName = nameInfo[2] || '';

        let html = `
            <div class="bird-detail-card">
                <div class="bird-name">${chineseName}</div>
                <div class="bird-latin">${latinName}${englishName ? ' | ' + englishName : ''}</div>
                <div class="bird-conf">置信度: ${confidence.toFixed(1)}%</div>
        `;

        if (encyclopediaData && encyclopediaData.describe) {
            const desc = encyclopediaData.describe;
            html += `
                ${desc.综述 ? `<div class="bird-info-item"><div class="bird-info-label">综述</div><div class="bird-info-content">${desc.综述}</div></div>` : ''}
                ${desc.外形特征 ? `<div class="bird-info-item"><div class="bird-info-label">外形特征</div><div class="bird-info-content">${desc.外形特征}</div></div>` : ''}
                ${desc.地理分布 ? `<div class="bird-info-item"><div class="bird-info-label">地理分布</div><div class="bird-info-content">${desc.地理分布}</div></div>` : ''}
                ${desc.生活习性 ? `<div class="bird-info-item"><div class="bird-info-label">生活习性</div><div class="bird-info-content">${desc.生活习性}</div></div>` : ''}
                ${desc.保护现状 ? `<div class="bird-info-item"><div class="bird-info-label">保护现状</div><div class="bird-info-content">${desc.保护现状}</div></div>` : ''}
            `;
        } else if (encyclopediaData && encyclopediaData.描述) {
            const desc = encyclopediaData.描述;
            html += `
                ${desc.综述 ? `<div class="bird-info-item"><div class="bird-info-label">综述</div><div class="bird-info-content">${desc.综述}</div></div>` : ''}
                ${desc.外形特征 ? `<div class="bird-info-item"><div class="bird-info-label">外形特征</div><div class="bird-info-content">${desc.外形特征}</div></div>` : ''}
                ${desc.地理分布 ? `<div class="bird-info-item"><div class="bird-info-label">地理分布</div><div class="bird-info-content">${desc.地理分布}</div></div>` : ''}
                ${desc.生活习性 ? `<div class="bird-info-item"><div class="bird-info-label">生活习性</div><div class="bird-info-content">${desc.生活习性}</div></div>` : ''}
                ${desc.保护现状 ? `<div class="bird-info-item"><div class="bird-info-label">保护现状</div><div class="bird-info-content">${desc.保护现状}</div></div>` : ''}
            `;
        }

        html += '</div>';
        detailContent.innerHTML = html;
        switchScene('bird-detail-scene');
    }

    // 处理窗口调整大小时的适配逻辑（如果需要 JS 辅助）
    window.addEventListener('resize', () => {
        // 可以在这里添加针对特殊比例的 JS 调整
    });
});
