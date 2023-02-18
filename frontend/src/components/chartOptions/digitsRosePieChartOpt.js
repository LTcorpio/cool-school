import { reactive } from 'vue'

export let option = reactive({
    dataset: [
        {
            id: 'stu_dataset',
            source: []
        },
        {
            id: 'dept_dataset',
            source: []
        }
    ],
    title: [
        {
            id: 'title',
            text: '校园人员分布',
            left: '3%',
            top: '3%'
        },
        {
            id: 'subtitle1',
            text: '学    生',
            left: '16.5%',
            bottom: '15%'
        },
        {
            id: 'subtitle2',
            text: '教 职 工',
            left: '46.5%',
            bottom: '15%'
        }
    ],
    legend: {
        type: 'scroll',
        orient: 'vertical',
        height: '80%',
        icon: 'pin',
        x: 'right',
        y: 'center',
        padding: [0, 50, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        pageButtonGap: 30
    },
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            id: 'stu',
            name: '分院学生数量',
            type: 'pie',
            roseType: 'radius',
            center: [ '20%', '50%' ],
            radius: [ '10%', '60%' ],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'inside'
            },
            emphasis: {
                label: {
                    show: true,
                    fontWeight: 'bold'
                },
                focus: 'self'
            },
            datasetIndex: 0
        },
        {
            id: 'dept',
            name: '各部门教职工数量',
            type: 'pie',
            roseType: 'radius',
            center: [ '50%', '50%' ],
            radius: [ '5%', '60%' ],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'inside'
            },
            emphasis: {
                label: {
                    show: true,
                    fontWeight: 'bold'
                },
                focus: 'self'
            },
            datasetIndex: 1
        }
    ]
})
