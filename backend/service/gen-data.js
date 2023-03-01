const path = require("path")
const dayjs = require("dayjs")
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(path.join(__dirname, '../bigscreen.db'))

/**
 * 生成模拟数据
 */
module.exports = async () => {
    await run('delete from inout_count')
    console.log('inout_count -- 所有数据清空成功')

    let currDate = dayjs(), min = 1000, max = 5000
    for (let i = 1; i <= 365; i++) {
        let random1 = Math.floor(Math.random() * (max - min + 1)) + min,
            random2 = Math.floor(Math.random() * (max - min + 1)) + min
        await run(`insert into inout_count values(?, ?, ?, ?)`, [i, String(currDate.format('YYYY-MM-DD')), random1, random2])
        currDate = currDate.subtract(1, 'day')
    }
    console.log('inout_count -- 新的模拟数据插入成功')
}

// 封装db.run()方法，返回Promise对象
let run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(error) {
            if (error) reject(error);
            else resolve({ code: 200, msg: "操作成功" });
        });
    });
}
