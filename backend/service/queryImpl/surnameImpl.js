const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 学生姓氏查询接口
 * {
 *   action: 'getData',
 *   socketType: 'surname',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'surname'
 * }
 */
let surnameImpl = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT surname AS 'name', count AS 'value' FROM surname_aggr`
        db.all(sql, (err, rows) => {
            try {
                resolve({ status: 0, msg: '成功', data: rows.sort((a, b) => b.value - a.value) })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

module.exports = surnameImpl;
