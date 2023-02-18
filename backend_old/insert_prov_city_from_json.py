import json
import sqlite3


conn = sqlite3.connect("bigscreen.db")
cur = conn.cursor()

with open("./tmp.json", 'r', encoding="UTF-8") as file:
    province_count = json.loads("".join(file.readlines()))
    for province in province_count:
        for city in province_count[province]:
            cur.execute("insert into province_city_count (province, city, count) values (?, ?, ?)", ( province, city, province_count[province][city] ))
conn.commit()
cur.close()
conn.close()
