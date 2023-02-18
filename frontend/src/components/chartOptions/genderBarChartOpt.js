import { reactive } from 'vue'

export let option = reactive({
    dataset: {
        source: []
    },
    title: {
        text: '各分院学生性别比例',
        left: '3%',
        top: '3%'
    },
    grid: {
        left: '26%',
        top: '12%',
        bottom: '18%'
    },
    legend: {
        orient: 'horizontal',
        right: '4%',
        bottom: '4%',
        icon: 'pin',
        itemGap: 60
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
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
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            rotate: 15
        },
        splitLine: {
            show: false
        }
    },
    series: [
        {
            type: 'bar',
            stack: 'gender',
            barWidth: '50%',
            itemStyle: {
                borderRadius: [ 10, 0, 0, 10 ],
                color: {
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                        { offset: 0, color: '#83bff6' },
                        { offset: 1, color: '#188df0' }
                    ],
                    globalCoord: false
                }
            },
            label: {
                show: true,
                position: 'inside'
            },
            emphasis: {
                focus: 'series'
            }
        },
        {
            type: 'bar',
            stack: 'gender',
            barWidth: '50%',
            itemStyle: {
                borderRadius: [ 0, 10, 10, 0 ],
                color: {
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                        { offset: 0, color: '#C71585' },
                        { offset: 1, color: '#FF69B4' }
                    ],
                    globalCoord: false
                }
            },
            label: {
                show: true,
                position: 'inside'
            },
            emphasis: {
                focus: 'series'
            }
        }
    ],
    animation: true,
    animationDuration: 1000,
    animationDurationUpdate: 1000,
    animationEasing: 'cubicOut',
    animationEasingUpdate: 'cubicOut',
})
