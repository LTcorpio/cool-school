const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 每月进出校人员查询接口
 * {
 *   action: 'getData',
 *   socketType: 'pass_in_out',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'pass_in_out',
 *   api_body: { begin: '2022-09-01', end: '2022-12-08', source: 'in_count' }
 * }
 */
let inOutImpl = (request) => {
    const { begin, end, source } = request.api_body
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, date, ${ source }
                   FROM inout_count
                   WHERE date BETWEEN '${ begin }' AND '${ end }'`
        db.all(sql, (err, rows) => {
            try {
                resolve({
                    status: 0, msg: '成功', data: rows,
                    dataRange: Array.from(new Set(rows.map(item => {
                        let date = item['date'].split('-')
                        return `${ date[0] }-${ date[1] }`
                    })))
                })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

module.exports = inOutImpl;
