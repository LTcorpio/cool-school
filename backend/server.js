// 服务启动后立即生成模拟数据
// const mockData = require('./service/gen-data')
const changeMockData = require('./service/update-data')
// mockData().then(r => {})

const wss = require('./service/websocket-service')
const wssInstance = wss(3090)

console.log("数据将每5~20秒更新一次")
function executeChangeMockData() {
    // 随机生成5到20之间的整数，作为延迟时间
    const delay = Math.floor(Math.random() * 16) + 5;
    console.log(`下一次更新：${ delay } 秒后`)

    // 等待延迟时间后执行changeMockData()方法
    setTimeout(async () => {
        await changeMockData(wssInstance);
        // 递归调用executeChangeMockData()方法，实现无限循环
        executeChangeMockData();
    }, delay * 1000);
}

// 初始调用
executeChangeMockData();
