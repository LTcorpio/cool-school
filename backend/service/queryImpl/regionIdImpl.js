const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 地区ID查询接口
 * {
 *   action: 'getData',
 *   socketType: 'regionId',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'regionId',
 *   api_body: { regionName: '浙江省' }
 * }
 */
let regionIdImpl = (request) => {
    const { regionName } = request.api_body
    return new Promise((resolve, reject) => {
        let sql = `SELECT region_id, region_name
                   FROM region_map
                   WHERE region_name = '${ regionName }'`
        db.all(sql, (err, rows) => {
            try {
                resolve({ status: 0, msg: '成功', data: rows })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

module.exports = regionIdImpl;
