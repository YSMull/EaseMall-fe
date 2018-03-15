const routers = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: 'home'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        name: 'goods',
        path: '/goods/:id',
        meta: {
            title: '商品信息'
        },
        component: (resolve) => require(['./views/goods.vue'], resolve)
    },
    {
        name: 'snap_goods',
        path: '/snapshot/:snapId',
        meta: {
            title: '交易快照',
            privilege: 'buyer'
        },
        component: (resolve) => require(['./views/goods.vue'], resolve)
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '用户登录'
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    },
    {
        name: 'cart',
        path: '/cart',
        meta: {
            title: '购物车',
            privilege: 'buyer'
        },
        component: (resolve) => require(['./views/cart.vue'], resolve)
    },
    {
        name: 'account',
        path: '/account',
        meta: {
            title: '账务',
            privilege: 'buyer'
        },
        component: (resolve) => require(['./views/account.vue'], resolve)
    },
    {
        name: '404',
        path: '*',
        meta: {
            title: '404'
        },
        component: (resolve) => require(['./views/404.vue'], resolve)
    },
    {
        name: 'publish_edit',
        path: '/publish/:goods_id',
        meta: {
            title: '发布',
            privilege: 'seller'
        },
        component: (resolve) => require(['./views/publish.vue'], resolve)
    },
    {
        name: 'publish',
        path: '/publish',
        meta: {
            title: '发布',
            privilege: 'seller'
        },
        component: (resolve) => require(['./views/publish.vue'], resolve)
    }
];
export default routers;