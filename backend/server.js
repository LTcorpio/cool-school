// 服务启动后立即生成模拟数据
const mockData = require('./service/gen-data')
const changeMockData = require('./service/update-data')
mockData().then(r => {})

const wss = require('./service/websocket-service')
const wssInstance = wss(3090)

const interval = setInterval(async () => {
    await changeMockData(wssInstance)
}, 5000)

