import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import iView from 'iview';
import Cookies from 'js-cookie';
import VueLazyload from 'vue-lazyload';



import Routers from './router';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(Vuex);
Vue.use(VueLazyload, {
    // preLoad: 1.3,
    // error: 'dist/error.png',
    // loading: 'dist/loading.gif',
    attempt: 4,
    lazyComponent: true
});


Vue.prototype.$util = Util;

Vue.prototype.$http = Util.ajax;

Vue.prototype.$isLogin = () => {
    return Cookies.get('ES_token') != undefined;
};

Vue.prototype.$eraseLogin = () => {
    Cookies.remove('ES_token');
    store.state.islogin = false;
    store.state.username = null;
    store.state.userId = null;
    store.state.isbuyer = false;
    store.state.isseller = false;
};

Vue.prototype.$confirm_login = (go_home=true) => {
    let title = '';
    if (Vue.prototype.$isLogin) {
        title = '您还没有登陆，是否登陆商城？';
    } else {
        title = '您的登录已经过期，是否重新登录商城？';
    }
    iView.Modal.confirm({
        title: title,
        content: '',
        onOk: () => {
            Vue.prototype.$eraseLogin();
            router.push({
                name: 'login',
                query: {
                    redirectUrl: window.location.href
                }
            });
        },
        onCancel: () => {
            Cookies.remove('ES_token');
            store.state.islogin = false;
            store.state.isbuyer = false;
            store.state.isseller = false;
            if (go_home) {
                router.push({ name: 'home' });
            }
        }
    });
};

/**
 * 
 * 可以保证mounted后获取到的store.state是实时的
 */
Vue.prototype.$validate = (to, from, next) => {
    let privilege = to.meta.privilege;
    if (Vue.prototype.$isLogin()) {
        Vue.prototype.$http.get('/valid', {
            params: {
                __t: Date.parse(new Date())
            }
        }).then(response => {
            store.state.islogin = true;
            store.state.username = response.data.data.username;
            store.state.userId = response.data.data.userId;
            if (response.data.data.role === 0) {
                store.state.isbuyer = true;
            } else if (response.data.data.role === 1) {
                store.state.isseller = true;
            }
            if (privilege === 'buyer') {
                if (store.state.isbuyer === true) {
                    next();
                } else {
                    // next(false);
                    router.push({ name: 'home' });
                }
            } else if (privilege === 'seller') {
                if (store.state.isseller === true) {
                    next();
                } else {
                    // next(false);
                    router.push({ name: 'home' });
                }
            } else {
                next();
            }
        }).catch(() => {
            // 登陆过期了
            Vue.prototype.$eraseLogin();
        });
    } else {
        if (privilege != undefined) {
            router.push({ name: 'home' });
        } else {
            next();
        }
    }
};

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    // 每次刷新页面时需要请求一次/valid，并且保证了在组件mounted的时候可以获取到登陆状态
    if (from.name === null) {
        Vue.prototype.$validate(to, from, next);
    } else {
        next();
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


// 1.不应该在没有登录的情况下访问需要登录的接口
// 2.如果cookie已经过期，访问接口会出现401，则弹窗询问是否返回登录页面
// 3.对于需要登录才能请求的接口，请求前需要判断是否已经登录
Util.ajax.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        // 此时一定是登陆过期，而不是越权请求
        Vue.prototype.$confirm_login();
    } else {
        iView.Modal.error({
            title: '服务器错误',
            content: '请求"' + error.config.url + '"错误！\n' + error.response.data.msg,
        });
    }
    //请求错误时做些事
    return Promise.reject(error);
});


// 需要响应式的更新ui时，使用this.$store.state.islogin，一般用在template中
// js中判断是否登录使用this.$isLogin()
const store = new Vuex.Store({
    state: {
        islogin: false,
        userId: null,
        username: null,
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

Vue.prototype.$store1 = store;
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});