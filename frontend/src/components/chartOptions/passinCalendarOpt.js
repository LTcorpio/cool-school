import { reactive } from 'vue'

export let option = reactive({
    dataset: {
        source: []
    },
    title: {
        text: '学生进出校统计',
        left: '3%',
        top: '3%',
        textStyle: {}
    },
    tooltip: {
        position: 'top',
        textStyle: {}
        /*formatter: (params) => {
            return `<b>${ params.value.name }</b><br />${ params.marker }<b>人数</b>\t${ params.value.value }`
        }*/
    },
    visualMap: {
        show: false,
        min: 1000,
        max: 5000,
        color: [ '#d1ecf8', '#0050b3' ]
    },
    calendar: {
        top: '24%',
        bottom: '5%',
        left: 'center',
        orient: 'vertical',
        yearLabel: {
            show: false
        },
        monthLabel: {
            show: false
        },
        dayLabel: {
            margin: 15,
            firstDay: 1
        },
        splitLine: {
            show: false
        },
        itemStyle: {
            borderWidth: 10,
            opacity: 0
        },
        range: []
    },
    series: {
        name: '人数',
        type: 'heatmap',
        coordinateSystem: 'calendar',
        label: {
            show: true,
            fontSize: 22,
            formatter: function (params) {
                let currentDate = params.value.name.split("-")
                return currentDate.slice(-1)
            }
            // offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10]
        },
        itemStyle: {
            borderRadius: 12
        },
        emphasis: {
            focus: 'self',
            label: {
                show: true
            }
        }
    }
})
