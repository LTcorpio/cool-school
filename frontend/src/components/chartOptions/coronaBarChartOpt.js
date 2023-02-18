import { reactive } from 'vue'

export let option = reactive({
    dataset: {
        source: []
    },
    title: {
        text: '各分院疫情填报率',
        left: '3%',
        top: '3%'
    },
    grid: {
        left: '8%',
        right: '15%',
        top: '14%',
        bottom: '12%'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        "valueFormatter": (params) => params + '%'
    },
    xAxis: {
        type: 'value',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'category',
        inverse: true,
        show: false
    },
    dataZoom: {
        show: false,
        yAxisIndex: 0,
        startValue: 0,
        endValue: 4
    },
    visualMap: {
        show: false,
        min: 60,
        max: 100,
        color: [ '#578aef', '#8f41e9' ],
        seriesIndex: 1
    },
    series: [
        {
            id: 'sub_name',
            type: "bar",
            barWidth: '40%',
            tooltip: {
                trigger: 'none'
            },
            itemStyle: {
                color: 'rgba(0, 0, 0, 0)'
            },
            cursor: 'default',
            label: {
                show: true,
                position: 'insideLeft',
                // color: '#fff',
                formatter: (params) => {
                    return `${ params.dataIndex + 1 }\t\t${ params.value['二级学院'] }`
                }
            }
        },
        {
            id: 'sub_data',
            name: '填报率',
            type: 'bar',
            barWidth: '40%',
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: true,
                position: 'right',
                formatter: (params) => params.value['填报率'] + '%'
            },
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)',
                borderRadius: 10
            },
            datasetIndex: 0
        }
    ],
    animation: true,
    animationDuration: 1000,
    animationDurationUpdate: 1000,
    animationEasing: 'cubicOut',
    animationEasingUpdate: 'cubicOut',
})
