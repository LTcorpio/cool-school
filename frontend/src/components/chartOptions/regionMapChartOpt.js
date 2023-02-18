import { reactive } from 'vue'
export let option = reactive({
    title: {
        text: '各省份生源数量',
        left: '3%',
        top: '3%'
    },
    grid: {
        left: '15%',
        right: '15%',
        top: '10%'
    },
    tooltip: {
        trigger: 'item',
        valueFormatter: (value) => isNaN(value) ? '无生源' : value
    },
    visualMap: {
        type: 'piecewise',
        show: true,
        left: '3%',
        bottom: '3%',
        color: [ '#e6f7ff', '#0050b3' ],
        seriesIndex: [ 0 ],
        itemSymbol: 'circle',
        pieces: [
            { gt: 800 },
            { gt: 500, lte: 800 },
            { gt: 300, lte: 500 },
            { gt: 200, lte: 300 },
            { gt: 100, lte: 200 },
            { gt: 50, lte: 100 },
            { gt: 10, lte: 50 },
            { gt: 0, lte: 10 },
        ]
    },
    geo: {
        type: 'map',
        map: 'china',
        zoom: 1,
        roam: true,

        itemStyle: {
            borderWidth: .5,
            borderColor: '#666',
            areaColor: "rgba(0, 0, 0, 0)"
        },
        emphasis: {
            borderWidth: .5,
            borderColor: '#eee',
            itemStyle: {
                areaColor: '#3066ba',
                shadowBlur: 15
            },
            label: {
                show: true,
                color: "#fff"
            }
        }
    },
    series: [
        {
            name: '生源数量',
            type: 'map',
            geoIndex: 0,
            data: [],
            selectedMode: false
        },
        {
            name: '学校位置',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [],
            tooltip: {
                trigger: 'none'
            },
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                formatter: '{b}',
                position: 'right',
                show: true
            },
            hoverAnimation: true,
            symbolSize: 20,
            itemStyle: {
                color: '#a57433',
                shadowBlur: 10,
                shadowColor: '#004981'
            },
            emphasis: {
                scale: true
            },
            zlevel: 1
        }
    ]
})
