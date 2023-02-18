const express = require('express')
const cors = require('cors')

const app = express()

// URLEncoded解析支持
app.use(express.json())
// 跨域支持
app.use(cors())

// 路由
const router = require('./router/api')
app.use('/api', router)

app.listen(5000, () => {
    console.log("Server Running at Port 5000. http://localhost:5000")
})

const webSocketService = require('./service/websocket-service')
webSocketService.listen(3090)
