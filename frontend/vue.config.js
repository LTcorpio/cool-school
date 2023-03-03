const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    // 设置页面标题(通过修改Webpack配置)
    chainWebpack: (config) => {
        config.plugin('html')
            .tap(args => {
                args[0].title = '23毕业设计'
                return args
            })
    },
    devServer: {
        port: '8999',
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                ws: true,
                changeOrigin: true
            }
        }
    }
})
