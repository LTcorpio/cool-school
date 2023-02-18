import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/screen',
        name: '智慧校园数据看板',
        component: () => import('../views/ScreenPage.vue'),
        meta: {
            title: '智慧校园数据看板',
            keepAlive: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/screen'
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (typeof (to.meta.title) === 'string') {
        document.title = to.meta.title
    }
    next()
})

export default router
