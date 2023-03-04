const apiImpl = {
    gender: require('./queryImpl/genderImpl'),
    surname: require('./queryImpl/surnameImpl'),
    corona: require('./queryImpl/coronaImpl'),
    regionId: require('./queryImpl/regionIdImpl'),
    region: require('./queryImpl/regionImpl'),
    digits: require('./queryImpl/digitsImpl'),
    pass_in_out: require('./queryImpl/inOutImpl'),
    departmentAgg: require('./queryImpl/departmentCountImpl'),
    studentAgg: require('./queryImpl/studentCountImpl')
};

module.exports = (request) => {
    if (request.action === 'getData' && apiImpl[request.api]) {
        return apiImpl[request.api](request);
    }
};
