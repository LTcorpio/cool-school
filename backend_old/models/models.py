from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


class region_map(db.Model):
    region_id = db.Column(db.Integer, primary_key=True)
    region_name = db.Column(db.String(255))


class yqtb(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    secondary_college = db.Column(db.String(255))
    ratio = db.Column(db.String(255))


class corona_submit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    history_date = db.Column(db.String(255))
    secondary_college = db.Column(db.String(255))
    ratio = db.Column(db.String(255))


class aggr_all_province(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    province = db.Column(db.String(255))
    count = db.Column(db.Integer)


class province_city_count(db.Model):
    __tablename__ = 'province_city_count'
    id = db.Column(db.Integer, primary_key=True)
    province = db.Column(db.String(255))
    city = db.Column(db.String(255))
    count = db.Column(db.Integer)


class surname_aggr(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    surname = db.Column(db.String(255))
    count = db.Column(db.Integer)


class passin_count(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    count = db.Column(db.Integer)


class passin_datelist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer)
    month = db.Column(db.Integer)


class basic_number(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    aggr_name = db.Column(db.String(255))
    aggr_count = db.Column(db.Integer)
