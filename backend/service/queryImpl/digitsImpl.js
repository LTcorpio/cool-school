const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 仅数字查询接口
 * {
 *   action: 'getData',
 *   socketType: 'digits',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'digits'
 * }
 */
let digitsImpl = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT *
                   FROM basic_number`
        db.all(sql, (err, rows) => {
            try {
                resolve({ status: 0, msg: '成功', data: rows })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

module.exports = digitsImpl;
