const express = require('express')
const router = express.Router()

const path = require('path')
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(path.join(__dirname, '../bigscreen.db'))

// 性别查询接口：[POST({range})] api/gender
router.post('/gender', (req, res) => {
    // 请求体是一个body { range: 'primary'|'secondary' }，根据range的取值判断返回全院还是分院的学生性别数据
    const SQL = `SELECT * FROM gender_${req.body['range']}`
    if (['primary', 'secondary'].includes(req.body['range'])) {
        db.all(SQL, (err, rows) => {
            res.send({ status: 0, msg: '成功', data: rows })
        })
    } else {
        res.send({ status: 1, msg: '失败' })
    }
})

// 姓氏查询接口：[POST] api/surname
router.post('/surname', (req, res) => {
    const SQL = `SELECT surname AS 'name', count AS 'value' FROM surname_aggr`
    db.all(SQL, (err, rows) => {
        if (!err) {
            res.send({ status: 0, msg: '成功', data: rows.sort((a, b) => b.count - a.count) })
        } else {
            res.send({ status: 1, msg: '失败' })
        }
    })
})

// 疫情填报数据查询接口：[POST({begin,end})] api/corona
router.post('/corona', (req, res) => {
    // 请求体是一个body { begin: 'DATE', end: 'DATE' }，返回指定时间段内的疫情填报数据
    const SQL = `SELECT history_date, secondary_college, ratio
                 FROM corona_submit
                 WHERE history_date BETWEEN '${req.body["begin"]}' AND '${req.body["end"]}'`
    db.all(SQL, (err, rows) => {
        if (!err) {
            res.send({ status: 0, msg: '成功', data: rows })
        } else {
            res.send({ status: 1, msg: '失败' })
        }
    })
})

// 地区ID查询接口：[POST(<regionName>)] api/region/<regionName>
router.post('/region/:regionName', (req, res) => {
    const SQL = `SELECT region_id, region_name FROM region_map WHERE region_name='${req.params['regionName']}'`
    db.all(SQL, (err, rows) => {
        if (!err) {
            res.send({ status: 0, msg: '成功', data: rows })
        } else {
            res.send({ status: 1, msg: '失败' })
        }
    })
})

// 各省份生源数量查询接口：[POST({province})] api/region
router.post('/region', (req, res) => {
    // 请求体是一个body { province: 'PROVINCE' }，返回指定省份(下钻)的生源数量
    // 如果省份是'全国'，则返回各个省份的数据
    const SQL1 = `SELECT city as 'name', count as 'value' FROM province_city_count WHERE province='${req.body['province']}'`
    const SQL2 = `SELECT province as 'name', SUM(count) AS 'value' FROM province_city_count GROUP BY province`
    const SQL = req.body['province'] === '全国' ? SQL2 : SQL1
    db.all(SQL, (err, rows) => {
        if (!err) {
            res.send({ status: 0, msg: '成功', data: rows })
        } else {
            res.send({ status: 1, msg: '失败' })
        }
    })
})

// 仅数字查询接口：[POST] api/digits
router.post('/digits', (req, res) => {
    const SQL = `SELECT * FROM basic_number`
    db.all(SQL, (err, rows) => {
        if (!err) {
            res.send({ status: 0, msg: '成功', data: rows })
        } else {
            res.send({ status: 1, msg: '失败' })
        }
    })
})

// 每月进出校人员查询接口：[POST{begin,end}] api/pass_in_out
router.post('/pass_in_out', (req, res) => {
    const SQL = `SELECT * FROM passin_count
                 WHERE date BETWEEN '${req.body["begin"]}' AND '${req.body["end"]}'`
    db.all(SQL, (err, rows) => {
        if (!err) {
            res.send({
                status: 0,
                msg: '成功',
                data: rows,
                dataRange: Array.from(new Set(rows.map(item => {
                    let date = item['date'].split('-')
                    return `${date[0]}-${date[1]}`
                })))
            })
        } else {
            res.send({ status: 1, msg: '失败' })
        }
    })
})

module.exports = router
