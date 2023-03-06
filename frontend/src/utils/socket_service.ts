export default class SocketService {
    /**
     * 单例模式
     */

    static _instance = null

    static get Instance() {
        if (!this._instance) {
            this._instance = new SocketService()
        }
        return this._instance
    }

    ws = null
    callBackMapping = {}
    connected = false
    reConnectCount = 0
    timer = null

    connect(url) {
        if (!window.WebSocket) {
            return alert("您的浏览器不支持WebSocket！")
        }
        this.ws = new WebSocket(url)
        this.ws.onopen = () => {
            console.log('[SUCCESS] 连接服务端成功')
            this.connected = true
            this.reConnectCount = 0
            clearInterval(this.timer)
        }
        this.ws.onclose = () => {
            console.log('[FAILED] 连接服务器失败，即将重连……')
            this.connected = false
            this.reConnectCount++
            this.timer = setTimeout(() =>{
                this.connect(url)
            }, this.reConnectCount * 1000)
        }
        this.ws.onmessage = (msg) => {
            const recvData = JSON.parse(msg.data)
            const socketType = recvData.socketType
            if (this.callBackMapping[socketType]) {
                const action = recvData.action
                if (action === 'getData') {
                    const realData = recvData.data
                    this.callBackMapping[socketType].call(this, realData)
                } else if (action === 'themeChange') {
                    this.callBackMapping[socketType].call(this, recvData)
                } else if (action === 'updateData') {
                    this.callBackMapping[socketType].call(this, recvData)
                }
            }
        }
    }
    registerCallBack(socketType, callBack) {
        this.callBackMapping[socketType] = callBack
    }
    unRegisterCallBack(socketType) {
        this.callBackMapping[socketType] = null
    }
    send(data) {
        // this.ws.send(JSON.stringify(data))
        if (this.connected) {
            this.reConnectCount = 0
            this.ws.send(JSON.stringify(data))
        } else {
            this.reConnectCount++
            // 否则延迟this.reConnectCount * 1000ms再次尝试请求数据,这里不写死时间是因为当多次连接是每次将时间拉长可以减少服务压力
            setTimeout(() => {
                this.ws.send(JSON.stringify(data))
            }, this.reConnectCount * 1000)
        }
    }
}
