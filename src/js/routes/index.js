import Home from 'js/views/Home';
import BtcGame from 'js/views/BtcGame';

export default [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: { bodyClass: 'home' },
    },
    {
        path: '/btc.html',
        name: 'btcsucks',
        component: BtcGame,

        meta: { bodyClass: 'btc-sucks' },
    },
];
