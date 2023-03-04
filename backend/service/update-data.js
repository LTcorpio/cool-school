const path = require("path")
const dayjs = require("dayjs")
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(path.join(__dirname, '../bigscreen.db'))

module.exports = async (wss) => {
    const currDate = dayjs().format('YYYY-MM-DD')
    const existingRecord = await get('SELECT * FROM inout_count WHERE date = ?', [currDate])
    if (existingRecord) {
        const { id, date, in_count, out_count } = existingRecord
        await run('UPDATE inout_count SET in_count = ?, out_count = ? WHERE date = ?', [in_count + 1, out_count + 1, date])
    }

    // 通过WebSocket向前端发送数据更新通知
    const clients = wss.clients
    for (const client of clients) {
        const rows = await all('SELECT * FROM inout_count WHERE date = ?', [currDate])
        const wsSendMsg = JSON.stringify({
            action: 'updateData',
            updateChart: 'inout_count',
            data: rows,
            socketType: 'update_data'
        })
        client.send(wsSendMsg)
        console.log("更新数据了：", wsSendMsg)
    }
}

let run = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (error) => {
            if (error) reject(error);
            else resolve({ code: 200, msg: "操作成功" });
        });
    });
}

// db.get()只返回满足条件的第一条数据
let get = async (sql, params) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

let all = async (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}
