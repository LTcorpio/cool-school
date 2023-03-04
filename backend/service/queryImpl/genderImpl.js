const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 性别查询接口
 * {
 *   action: 'getData',
 *   socketType: 'gender_primary',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'gender',
 *   api_body: { range: 'primary' }
 * }
 */
let genderImpl = (request) => {
    const { range } = request.api_body
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM gender_${ range }`
        db.all(sql, (err, rows) => {
            try {
                resolve({ status: 0, msg: '成功', data: rows })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

module.exports = genderImpl;
