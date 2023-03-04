const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 疫情填报数据查询接口
 * {
 *   action: 'getData',
 *   socketType: 'corona',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'corona',
 *   api_body: { begin: '2022-12-01', end: '2022-12-08' }
 * }
 */
let coronaImpl = (request) => {
    const { begin, end } = request.api_body
    return new Promise((resolve, reject) => {
        let sql = `SELECT history_date, secondary_college, ratio
                   FROM corona_submit
                   WHERE history_date BETWEEN '${ begin }' AND '${ end }'`
        db.all(sql, (err, rows) => {
            try {
                resolve({ status: 0, msg: '成功', data: rows })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

module.exports = coronaImpl;
