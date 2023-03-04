const path = require("path")
const dayjs = require("dayjs")
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(path.join(__dirname, '../bigscreen.db'))

/**
 * 生成模拟数据
 */
module.exports = async () => {
    // await run('DELETE FROM inout_count')
    let currDate = dayjs(), min = 1000, max = 5000, insertCount = 0
    for (let i = 1; i <= 100; i++) {
        let random1 = Math.floor(Math.random() * (max - min + 1)) + min,
            random2 = Math.floor(Math.random() * (max - min + 1)) + min
        // 相同date的数据不再插入
        const existingRecord = await all(`SELECT COUNT(*) AS count FROM inout_count WHERE date = ?`, [currDate.format('YYYY-MM-DD')])
        if (existingRecord[0].count === 0) {
            insertCount++
            await run(`
                INSERT INTO inout_count (id, date, out_count, in_count)
                VALUES (?, ?, ?, ?)
            `, [i, currDate.format('YYYY-MM-DD'), random1, random2])
        } else {
            if (insertCount === 0) console.log(`inout_count -- 数据是最新的`)
            else console.log(`inout_count -- ${insertCount} 条模拟数据插入成功`)
            return
        }
        currDate = currDate.subtract(1, 'day')
    }
}

// 封装db.run()方法，返回Promise对象
let run = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (error) => {
            if (error) reject(error);
            else resolve({ code: 200, msg: "操作成功" });
        });
    });
}

// 封装db.all()方法，返回Promise对象
let all = async (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}
