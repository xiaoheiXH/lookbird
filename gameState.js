/**
 * 游戏全局状态记录
 * 用于保存玩家在各个场景中的选择
 */
window.GameData = {
    // 玩家选择的装备信息
    equipment: {
        type: null,      // 'camera' 或 'telescope'
        model: null,     // 具体型号，如 'camera-1', 'camera-2'
        selectedAt: null // 选择时间
    },
    
    // 当前场景记录
    currentScene: 'main-menu',
    
    // 场景环境属性
    sceneAttributes: {
        'scene-hekou-01': ['water', 'tree', 'sky']
    },

    // 鸟类数据定义
    birds: {
        'bird01': {
            name: '白鹭',
            attributes: ['water', 'tree', 'sky'],
            states: {
                'water': {
                    touch: '鸟_白鹭01_水上_取景.png',
                    capture: '鸟_白鹭01_水上_拍摄.png'
                }
            }
        }
    },

    // 当前处于 Touch 环节的数据
    touchData: {
        birdId: null,
        birdState: null,
        isSuccess: false
    },
    
    // 调试方法：在控制台打印当前状态
    showStatus() {
        console.log('--- 当前游戏数据 ---');
        console.log('装备:', this.equipment);
        console.log('当前场景:', this.currentScene);
        console.log('------------------');
    }
};
