const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 分院学生数量查询接口
 * {
 *   action: 'getData',
 *   socketType: 'studentAgg',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'studentAgg'
 * }
 */
let studentCountImpl = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT secondary_college, stu_count
                   FROM aggr_student
                   ORDER BY stu_count DESC`
        db.all(sql, (err, rows) => {
            try {
                resolve({
                    status: 0,
                    msg: '成功',
                    data: rows
                })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

module.exports = studentCountImpl;
