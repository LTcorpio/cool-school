import { reactive } from "vue";

let maskImage = new Image()
// 词云图轮廓图片必须是base64
maskImage.src = 'data:image/png;base64,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'

import useThemeStore from '@/store/modules/theme'

const themeStore = useThemeStore()

export let option = reactive({
    title: {
        text: '学生姓氏词云图',
        left: '3%',
        top: '3%'
    },
    tooltip: {},
    toolbox: {
        feature: {
            dataView: {
                readOnly: true,
                lang: [ '学生姓氏词云图 - 数据视图', '关闭' ],
                optionToContent: function (opt) {
                    let series = opt.series;
                    let table = `<table class="table ${themeStore.globalTheme === 'dark' ? 'table-dark' : ''} table-hover table-bordered text-center" style="font-size:24px;width:80%;margin:0 auto"><tbody><tr><th>姓氏</th><th>数量</th></tr>`;
                    series[0].data.forEach(item => table += `<tr><td>${ item.name }</td><td>${ item.value }</td></tr>`)
                    table += `</tbody></table></div>`;
                    return table;
                }
            }
        },
        right: '6%',
        bottom: '3%'
    },
    visualMap: {
        show: false
    },
    series: {
        name: '姓氏',
        type: 'wordCloud',
        maskImage: maskImage,
        keepAspect: false,
        layoutAnimation: true,
        rotationRange: [ -15, 15 ],
        rotationStep: 5,
        emphasis: {
            focus: 'self',
            textStyle: {
                textShadowBlur: 8,
                textShadowColor: '#ccc'
            }
        },
        width: '80%',
        height: '60%',
        data: []
    }
})
