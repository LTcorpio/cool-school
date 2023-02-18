import { reactive } from 'vue'

export let option = reactive({
    dataset: {
        'source': []
    },
    title: {
        text: '全院学生性别比例',
        left: '3%',
        top: '3%'
    },
    legend: {
        orient: 'horizontal',
        bottom: '4%',
        right: '4%',
        icon: 'pin',
        itemGap: 60
    },
    tooltip: {
        trigger: 'item'
    },
    series: {
        type: 'pie',
        radius: [ '40%', '70%' ],
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: 10
        },
        label: {
            show: false,
            position: 'center'
        },
        emphasis: {
            label: {
                show: true,
                fontWeight: 'bold'
            },
            focus: 'self'
        }
    }
})
