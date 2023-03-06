const path = require("path")
const dayjs = require("dayjs")
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(path.join(__dirname, '../bigscreen.db'))

module.exports = async (wss) => {
    let currDate = dayjs();
    const existingRecord = await get('SELECT * FROM inout_count WHERE date = ?', [currDate.format('YYYY-MM-DD')]);
    if (existingRecord) {
        console.log('inout_count -- 上一条数据：', existingRecord)
        const { id, date, in_count, out_count } = existingRecord;
        // 对inout_count表执行操作
        await run('UPDATE inout_count SET in_count = ?, out_count = ? WHERE date = ?', [in_count + 1, out_count + 1, date]);
    } else {
        let min = 1000, max = 5000, insertCount = 0;
        while (1) {
            // 相同date的数据不再插入
            const existingRecord = await all(`SELECT COUNT(*) AS count FROM inout_count WHERE date = ?`, [currDate.format('YYYY-MM-DD')])
            if (existingRecord[0].count === 0) {
                let random1 = Math.floor(Math.random() * (max - min + 1)) + min,
                    random2 = Math.floor(Math.random() * (max - min + 1)) + min
                insertCount++
                await run(`
                    INSERT INTO inout_count (date, out_count, in_count)
                    VALUES (?, ?, ?)
                `, [currDate.format('YYYY-MM-DD'), random1, random2])
            } else {
                if (insertCount === 0) console.log(`inout_count -- 数据是最新的`)
                else console.log(`inout_count -- ${insertCount} 条模拟数据插入成功`)
                return
            }
            currDate = currDate.subtract(1, 'day')
        }
    }

    // 通过WebSocket向前端发送数据更新通知
    const clients = wss.clients
    for (const client of clients) {
        // 在inout_count表中将更新后结果进行推送
        const rows = await all('SELECT * FROM inout_count WHERE date = ?', [currDate])
        const wsSendMsgToChart = JSON.stringify({
            action: 'updateData',
            data: rows,
            socketType: 'update_data'
        }), wsSendMsgToLog = JSON.stringify({
            action: 'updateData',
            updateChart: 'inout_count',
            timestamp: dayjs().unix(),
            data: rows,
            socketType: 'update_log'
        })
        // 有几个组件要更新后的数据，就要几个send
        client.send(wsSendMsgToChart)
        client.send(wsSendMsgToLog)
        console.log("更新数据了：", wsSendMsgToLog)
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
