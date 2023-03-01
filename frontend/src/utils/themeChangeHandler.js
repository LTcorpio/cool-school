const { getCurrentInstance } = require("vue");
const { proxy } = getCurrentInstance();

export default {
    changeTheme: (themeName) => {
        proxy.$socket.send({
            action: 'themeChange',
            globalTheme: themeName,
            chartTheme: themeName === 'dark' ? 'dark' : 'walden',
            socketType: 'themeChange'
        })
    }
}
