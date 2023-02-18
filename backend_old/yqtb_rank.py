"""
本程序爬取疫情打卡系统，爬取出来的结果存入 SQLite3 数据库供后续直接调用。
"""

import re
import requests
import sqlite3
import datetime
from lxml import etree


# 数据库的初始化
def init_db(dbpath):
    initsql = "drop table if exists corona_submit"

    createsql = '''
        create table if not exists corona_submit (
            id integer primary key autoincrement,
            history_date varchar,
            secondary_college varchar,
            ratio varchar
        )
    '''

    conn = sqlite3.connect(dbpath)
    cursor = conn.cursor()
    cursor.execute(initsql)
    cursor.execute(createsql)
    conn.commit()
    conn.close()


def get_yqtb_data(db_path):
    # init_db(db_path)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    begin = datetime.date(2022, 11, 1)
    end = datetime.date(2022, 12, 4)
    d = begin
    delta = datetime.timedelta(days=1)
    while d <= end:
        print(d.strftime("%Y-%m-%d"))
        url = "https://wx.app.nbpt.edu.cn/weixin/yqtb/rank"
        params = {
            "date": d.strftime("%Y-%m-%d")
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.1.11.0 Safari/537.36 Language/zh wxwork/4.0.20 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk",
            "Cookie": "PHPSESSID=64615531cdfcecd5f7c47aa1f4e262f9"
        }
        resp = requests.get(url=url, params=params, headers=headers)
        html = "".join(resp.text)

        selected = etree.HTML(html).xpath("//div[@class='tab-page'][3]/div/div[@class='weui-cell']/div/text()")

        sec_college = ""
        for index, content in enumerate(re.findall("\S+", "".join(selected), re.S)):
            if (index + 1) % 2 == 1:
                sec_college = content
            else:
                submit_ratio = content + '%'
                cur.execute("insert into corona_submit (secondary_college, history_date, ratio) values (?, ?, ?)", (sec_college, d.strftime("%Y-%m-%d"), submit_ratio))

        d += delta
    conn.commit()
    cur.close()
    conn.close()


# 获取数据库的信息
# def output(dbpath):
#     con = sqlite3.connect(dbpath)
#     cur = con.cursor()
#     sql = "select * from yqtb"
#     datas = cur.execute(sql)
#     for data in datas:
#         print(data)
#     cur.close()
#     con.close()


if __name__ == "__main__":
    # 爬取数据(定时爬取)
    get_yqtb_data("bigscreen.db")
    # 供可视化使用的数据(可随时获取)
    # output("bigscreen.db")
