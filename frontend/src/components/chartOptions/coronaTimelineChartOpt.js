import { reactive } from "vue";

export let option = reactive({
    baseOption: {
        title: [ {
            id: 'mainTitle',
            text: '各分院疫情填报率历史数据时间线',
            left: '3%',
            top: '3%'
        }, {
            id: 'subTitle',
            text: '',
            subtext: '',
            right: '-14%',
            bottom: '14%',
            textAlign: 'right',
            textStyle: {
                fontFamily: 'Cascadia Mono',
                fontWeight: 700,
                textShadowBlur: 5
            },
            subtextStyle: {
                fontFamily: 'Cascadia Mono',
                fontWeight: 700,
                textShadowBlur: 10
            }
        } ],
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
        timeline: {
            axisType: 'category',
            orient: 'vertical',
            autoPlay: true,
            loop: false,
            realtime: false,
            inverse: true,
            playInterval: 800,
            right: '2%',
            top: '2%',
            bottom: '2%',
            width: '6%',
            symbol: 'none',
            label: {
                rotate: 15
            },
            data: []
        },
        visualMap: {
            show: false,
            dimension: 0,
            min: 80,
            max: 100,
            color: [ '#d0e8fa', '#0050b3' ]
        },
        series: {
            animationDuration: 300,
            animationDurationUpdate: 300,
            type: 'bar',
            realtimeSort: true,
            showBackground: true,
            backgroundStyle: {
                borderRadius: 18
            },
            itemStyle: {
                borderRadius: 18
            },
            label: {
                show: true,
                position: 'right',
                valueAnimation: true
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
                }
            }
        }
    },
    options: []
})
