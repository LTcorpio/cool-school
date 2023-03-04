const path = require("path");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(path.join(__dirname, '../../bigscreen.db'));

/**
 * 各省份生源数量查询接口
 * {
 *   action: 'getData',
 *   socketType: 'region',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'region',
 *   api_body: { province: '浙江省' }
 * }
 */
let regionImpl = (request) => {
    const { province } = request.api_body
    return new Promise((resolve, reject) => {
        let sql1 = `SELECT a.city as 'name', a.count as 'value', b.region_id as 'province_id', b.region_name as 'province_name'
                    FROM province_city_count a INNER JOIN region_map b ON a.province = b.region_name
                    WHERE a.province = '${ province }'`
        let sql2 = `SELECT province as 'name', SUM(count) AS 'value'
                    FROM province_city_count
                    GROUP BY province`
        let sql = province === '全国' ? sql2 : sql1
        db.all(sql, (err, rows) => {
            try {
                resolve({
                    status: 0,
                    msg: '成功',
                    region_meta: { province_id: rows[0]['province_id'], province_name: rows[0]['province_name'] },
                    data: rows.map(item => ({ name: item.name, value: item.value }))
                })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

module.exports = regionImpl;
