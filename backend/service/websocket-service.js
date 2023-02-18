const WebSocket = require('ws')
const queryData = require('./query-data')

module.exports.listen = (port) => {
    const wss = new WebSocket.Server({
        port: port
    })
    wss.on('connection', client => {
        console.log('有客户端连接成功了。')
        client.on('message', async msg => {
            console.log('客户端发送数据给服务端了：' + msg)
            let payload = JSON.parse(msg)
            const action = payload.action
            if (action === 'getData') {
                // getData获取数据 -- 根据客户端传回对象内的api值，返回指定的接口数据
                payload.data = await queryData(payload)
                client.send(JSON.stringify(payload))
            } else {
                // themeChange更改主题 / updateData更新数据，一端更改多端同步
                wss.clients.forEach(client => {
                    client.send(JSON.stringify(payload))
                })
                if (payload.action === 'themeChange') {
                    console.log("修改主题", payload)
                } else if (payload.action === 'updateData') {
                    console.log("更新数据", payload)
                }
            }
        })
    })
}
