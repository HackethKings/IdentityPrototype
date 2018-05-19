import Vue from 'vue';
import VueRouter from 'vue-router';
import 'sass/app.scss';
import App from 'js/views/App';
import DefaultRoutes from 'js/routes/index';
import Common from "js/entries/common";

import BlockUI from 'vue-blockui';

import axios from 'axios';
import VueAxios from 'vue-axios';
import BootstrapVue from 'bootstrap-vue';

const routes = DefaultRoutes;
const router = new VueRouter({
    mode: 'history',
    routes,
});
Vue.router = router;
Vue.use(BootstrapVue);
Vue.use(VueRouter);

Vue.use(VueAxios, axios);
Vue.use(BlockUI);
// Vue.filter('img', function ($val) {
//     return '/img/' + $val;
// });
// Vue.axios.interceptors.response.use(undefined, err => {
//     let res = err.response;
//     // Unauthorized Access
//     if (
//         res.status === 401 &&
//         ['UnauthorizedAccess', 'InvalidToken'].indexOf(res.data.code) > -1
//     ) {
//         // Vue.auth.logout({redirect: {name: 'home'}});
//         return Promise.reject(err);
//     }
//
//     // System Error
//
//     else if (res.status === 500) {
//         // Vue.router.push({name: 'error-500'});
//         return Promise.reject(err);
//     }
// });


new Common(router, App);
