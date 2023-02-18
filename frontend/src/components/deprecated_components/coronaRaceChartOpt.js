import { reactive } from "vue";

export let option = reactive({
    dataset: {
        source: []
    },
    title: {
        text: '各分院疫情填报率历史数据排行',
        left: '3%',
        top: '3%'
    },
    grid: {
        left: '18%',
        right: '24%',
        top: '12%',
        bottom: '12%'
    },
    tooltip: {
        trigger: 'axis',
        valueFormatter: (params) => params + '%'
    },
    xAxis: {
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false }
    },
    yAxis: {
        type: 'category',
        inverse: true,
        axisLabel: {
            rotate: 30
        },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        animationDuration: 300,
        animationDurationUpdate: 300
    },
    visualMap: {
        show: false,
        min: 80,
        max: 100,
        color: [ '#e6f7ff', '#0050b3' ]
    },
    graphic: {
        elements: [ {
            id: 'mainTitle',
            type: 'text',
            right: '6%',
            bottom: '22%',
            style: {
                text: "日期",
                fontFamily: 'Cascadia Mono',
                fontWeight: 700,
                fill: '#ccc'
            },
            z: 100
        }, {
            id: 'subTitle',
            type: 'text',
            right: '6%',
            bottom: '16%',
            style: {
                text: "平均填报率",
                fontFamily: 'Cascadia Mono',
                fontWeight: 700,
                textShadowColor: '#888',
                textShadowBlur: 8,
                fill: '#aaa'
            },
            z: 100
        } ]
    },
    series: {
        realtimeSort: true,
        type: 'bar',
        itemStyle: {
            borderRadius: 12
        },
        universalTransition: {
            enabled: true
        },
        label: {
            show: true,
            position: 'right',
            // valueAnimation: true
        },
        markLine: {
            label: {
                position: 'start',
                formatter: (params) => {
                    return `(平均) ${ params.data.value }%`
                }
            },
            precious: 2,
            silent: true,
            data: [ {
                xAxis: 0
            } ],
            lineStyle: {
                width: 4,
                type: [ 5, 10 ],
                dashOffset: 5
            },
            animationDuration: 100,
            animationDurationUpdate: 300
        }
    },
    animationDuration: 0,
    animationDurationUpdate: 2000,
    animationEasing: 'quadraticOut',
    animationEasingUpdate: 'linear'
})
