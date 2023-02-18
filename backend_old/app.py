"""
本程序是后端服务器，直接读取数据库数据，用于前端请求获取数据。
"""

import json
import os
# import jionlp
from flask import Flask, request
from flask_cors import CORS
from models.models import *


app = Flask(__name__)
app.config.from_object("models.conn_config")
db.init_app(app)
cors = CORS(app)


with open("out.json", 'r', encoding="UTF-8") as f:
    data = json.loads(f.readline())['data']


@app.route("/stu", methods=['GET', 'POST'])
def get_all():
    return {"data": data}


# 总院男女分布
@app.route("/primary/gender", methods=['GET'])
def primary_college_gender_aggregation():
    gender_list = [i.get('性别') for i in data]
    gender_dict = {}
    for i in gender_list:
        gender_dict[i] = gender_dict[i] + 1 if i in gender_dict else 0
    return gender_dict
    # 返回：{ "男": xxx, "女": xxx }


# 二级学院男女分布
@app.route("/secondary/gender", methods=['GET'])
def secondary_college_gender_aggregation():
    gender_dict = {}
    for i in data:
        secondary_college = i['学院名称']
        gender = i['性别']
        if secondary_college not in gender_dict:
            gender_dict[secondary_college] = {}
        if gender not in gender_dict[secondary_college]:
            gender_dict[secondary_college][gender] = 0
        gender_dict[secondary_college][gender] += 1
    return gender_dict
    # 返回：{ "二级学院名称": {"男": xxx, "女": xxx}, ... }


# 学生姓氏出现次数
@app.route("/stu/surname_aggr", methods=['GET'])
def student_surname():
    # surname_list = {}
    # for i in data:
    #     stu_name = i.get("姓名")
    #     # 普通姓氏
    #     if len(stu_name) <= 3:
    #         if stu_name[0] not in surname_list: surname_list[stu_name[0]] = 0
    #         surname_list[stu_name[0]] += 1
    #     else:
    #         # 新疆学生姓氏
    #         if '·' in stu_name:
    #             if stu_name.split("·")[1] not in surname_list: surname_list[stu_name.split("·")[1]] = 0
    #             surname_list[stu_name.split("·")[1]] += 1
    #         # 复姓
    #         else:
    #             if stu_name[0:2] not in surname_list: surname_list[stu_name[0:2]] = 0
    #             surname_list[stu_name[0:2]] += 1
    datas = db.session.query(surname_aggr.surname, surname_aggr.count).order_by(db.desc(surname_aggr.count)).all()
    return {"data": [{'name': i[0], 'value': i[1]} for i in datas]}


# 疫情填报数据(当日)
@app.route("/yqtb/fetchdata", methods=['GET', 'POST'])
def yqtb_today():
    # GET方法: 直接返回数据库所有数据
    # POST方法: 重新爬取数据并存入数据库后再返回数据
    if request.method == 'POST':
        try:
            os.system("python yqtb.py")
        except:
            return {"err": "SESSION已过期，无法获得数据！"}
    datas = db.session.query(yqtb.id, yqtb.secondary_college, yqtb.ratio).all()
    return_data = [{"id": i[0], "二级学院": i[1], "填报率": i[2]} for i in datas]
    return {"data": return_data}


# 疫情填报数据(历史)
@app.route("/yqtb/race")
def yqtb_realtime():
    datas = db.session.query(corona_submit.history_date, corona_submit.secondary_college, corona_submit.ratio).all()
    return_data = [{"日期": i[0], "二级学院": i[1], "填报率": i[2]} for i in datas]
    return {"data": return_data}


# 根据省份名称查询省份代号
@app.route("/map/<regionName>", methods=['GET'])
def get_region_id(regionName):
    region = db.session.query(region_map.region_id, region_map.region_name).filter(region_map.region_name == regionName).all()
    return {"data": {"region_id": region[0][0], "region_name": region[0][1]}}


# 所有省份生源总数
@app.route("/map/all_province", methods=['GET', 'POST'])
def all_province_stu_source():
    # GET方法: 直接返回数据库所有数据
    # POST方法: 重新生成数据并存入数据库后再返回数据
    # if request.method == 'POST':
    #     province_count = {}
    #     for i in data:
    #         curr_province = jionlp.parse_location(i['家庭地址'])['province']
    #         if curr_province == None: continue  # 存在不规范的家庭地址，直接过滤
    #         if curr_province not in province_count:
    #             province_count[curr_province] = 0
    #         province_count[curr_province] += 1
    
    all_province = db.session.query(aggr_all_province.province, aggr_all_province.count).all()
    return_data = [{"name": i[0], "value": i[1]} for i in all_province]  # 返回数据必须是name和value,否则visualMap不填色
    return {"data": return_data}


# 指定省份各城市生源总数
@app.route("/map/province/<provinceName>", methods=['GET', 'POST'])
def stu_source_by_province(provinceName):
    # if request.method == 'POST':
        # province_count = {}
        # for i in data:
        #     curr_province = jionlp.parse_location(i['家庭地址'])['province']
        #     curr_city = jionlp.parse_location(i['家庭地址'])['city']
        #     if curr_province == None: continue  # 存在不规范的家庭地址，直接过滤
        #     if curr_city == None: continue
        #     if curr_province not in province_count:
        #         province_count[curr_province] = {}
        #     if curr_city not in province_count[curr_province]:
        #         province_count[curr_province][curr_city] = 0
        #     province_count[curr_province][curr_city] += 1
        # for province in province_count:
        #     for city in province_count[province]:
        #         insert_data = province_city_count(province, city, province_count[province][city])
        #         db.session.add(insert_data)
        #         db.session.commit()
    
    all_city = db.session.query(province_city_count.province, province_city_count.city, province_city_count.count) \
        .filter(province_city_count.province == provinceName).all()
    all_city_aggr = [{"name": i[1], "value": i[2]} for i in all_city]
    return {"data": all_city_aggr}


# 每日进出校园学生数量统计
@app.route("/pass_in_calendar")
def pass_in_calendar():
    everyDayInAndOut = db.session.query(passin_count.date, passin_count.count).all()
    everyDayInAndOut_out = [{"date": str(i[0]), "count": i[1]} for i in everyDayInAndOut]
    return {"data": everyDayInAndOut_out}


@app.route("/pass_in_datelist")
def pass_in_datelist():
    dateList = db.session.query(passin_datelist.year, passin_datelist.month).all()
    return {"data": [{"year": i[0], "month": i[1]} for i in dateList]}


@app.route("/basic")
def basic_norm():
    basic_norms = db.session.query(basic_number.aggr_name, basic_number.aggr_count).all()
    basic_norms_all = [{"name": i[0], "value": i[1]} for i in basic_norms]
    return {"data": basic_norms_all}


if __name__ == '__main__':
    app.run(port=5000, debug=True)
