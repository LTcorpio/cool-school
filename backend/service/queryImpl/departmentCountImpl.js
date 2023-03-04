const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 部门教职工数量查询接口
 * {
 *   action: 'getData',
 *   socketType: 'departmentAgg',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'departmentAgg'
 * }
 */
let departmentCountImpl = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT department, dept_count
                   FROM aggr_department
                   ORDER BY dept_count DESC`
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

module.exports = departmentCountImpl;
