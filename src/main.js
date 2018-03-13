import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Routers from './router';
import iView from 'iview';


import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';

import Cookies from 'js-cookie';

import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
    // preLoad: 1.3,
    // error: 'dist/error.png',
    // loading: 'dist/loading.gif',
    attempt: 4,
    lazyComponent: true
});

// import { Button, Table } from 'iview';
// Vue.component('Button', Button);
// Vue.component('Table', Table);

Vue.use(VueRouter);

Vue.use(iView);

Vue.use(Vuex);

Vue.prototype.$util = Util;

Vue.prototype.$http = Util.ajax;

Vue.prototype.$isLogin = () => {
    return Cookies.get('ES_token') != undefined;
};

Vue.prototype.$eraseCookie = () => {
    Cookies.remove('ES_token');
};

// 下面的url如果加载失败，将跳转到主页
// 不在该列表内的url如果请求401，将清除Cookie后重新刷新页面，刷新页面后，应不会再发出请求
let go_home_apis = [
    '/api/getcart',
    '/api/history',
    '/api/snapshot'
];

let need_go_home = (apiList, target) => {
    for (var i = 0; i < apiList.length; i++) {
        if (target === apiList[i] || target.startsWith(apiList[i])) {
            return true;
        }
    }
    return false;
}
let confirm_login = (error) => {
    let title = '';
    if (Cookies.get('ES_token') != undefined) {
        title = '您的登录已经过期，是否重新登录商城？';
    } else {
        title = '您还没有登录，是否登录商城？';
    }
    iView.Modal.confirm({
        title: title,
        content: '',
        onOk: () => {
            Cookies.remove('ES_token');
            router.push({
                name: 'login',
                query: {
                    redirectUrl: window.location.href
                }
            });
        },
        onCancel: () => {
            Cookies.remove('ES_token');
            let go_home = need_go_home(go_home_apis, error.config.url);
            if (error != undefined && go_home) {
                // 某些url请求失败如果不登录需要跳转回主页
                router.push({
                    name: 'home',
                });
            } else if (error != undefined && !go_home) {
                // 有请求&&请求过期才需要刷新页面
                window.location.reload();
            } else {
                // 没有任何请求，只是发现还没有登录，不需要刷新页面
                null;
            }
        }
    });
};

Vue.prototype.$confirm_login = confirm_login;

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


// 1.不应该在没有登录的情况下访问需要登录的接口
// 2.如果cookie已经过期，访问接口会出现401，则弹窗询问是否返回登录页面
// 3.对于需要登录才能请求的接口，请求前需要判断是否已经登录
Util.ajax.interceptors.response.use( response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        confirm_login(error);
    }
    //请求错误时做些事
    return Promise.reject(error);
});


// 需要响应式的更新ui时，使用this.$store.state.islogin，一般用在template中
// js中判断是否登录使用this.$isLogin()
const store = new Vuex.Store({
    state: {
        islogin: false,
        user_id: null,
        user_name: null,
        isbuyer: false,
        isseller: false
    },
    getters: {

    },
    mutations: {
        // increment(state) {
        //     state.user_id++;
        // }
    },
    actions: {

    }
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});

Vue.prototype.$allowSeller = () => {
    if (!store.state.isseller) {
        router.push({
            name: 'home'
        });
    }
};
Vue.prototype.$allowBuyer = () => {
    if (!store.state.isbuyer) {
        router.push({
            name: 'home'
        });
    }
};