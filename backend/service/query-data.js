const path = require("path");
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(path.join(__dirname, '../bigscreen.db'))

module.exports = (request) => {
    if (request.action === 'getData') {
        if (request.api === 'gender') return genderImpl(request)
        else if (request.api === 'surname') return surnameImpl()
        else if (request.api === 'corona') return coronaImpl(request)
        else if (request.api === 'regionId') return regionIdImpl(request)
        else if (request.api === 'region') return regionImpl(request)
        else if (request.api === 'digits') return digitsImpl()
        else if (request.api === 'pass_in_out') return inOutImpl(request)
        else if (request.api === 'departmentAgg') return departmentCountImpl()
        else if (request.api === 'studentAgg') return studentCountImpl()
    }
}

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
        let sql = `SELECT *
                   FROM gender_${ range }`
        db.all(sql, (err, rows) => {
            try {
                resolve({ status: 0, msg: '成功', data: rows })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

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
        let sql = `SELECT surname AS 'name', count AS 'value'
                   FROM surname_aggr`
        db.all(sql, (err, rows) => {
            try {
                resolve({ status: 0, msg: '成功', data: rows.sort((a, b) => b.value - a.value) })
            } catch (err) {
                reject({ status: 1, msg: '失败' })
            }
        })
    })
}

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

/**
 * 每月进出校人员查询接口
 * {
 *   action: 'getData',
 *   socketType: 'pass_in_out',  // socket唯一标识，可自行指定，于callBackMapping存储
 *   api: 'pass_in_out',
 *   api_body: { begin: '2022-09-01', end: '2022-12-08' }
 * }
 */
let inOutImpl = (request) => {
    const { begin, end } = request.api_body
    return new Promise((resolve, reject) => {
        let sql = `SELECT *
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
