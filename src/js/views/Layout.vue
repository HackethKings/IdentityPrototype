<template>
    <div>
        <Navbar>
            <slot name="navbar"></slot>
        </Navbar>

        <div class="container site__body">
            <slot name="content">
                <router-view></router-view>
            </slot>

            <ul class="cm-footer__list cm-footer__list--images">
                <li>
                    <a href="https://www.netguru.co/blog/netguru-deloitte-fast-50" class="cm-footer__menu-link">
                        <img src="https://www.netguru.co/hubfs/images/custom-modules/footer/logo_deloitte.png?t=1526654198212"
                             alt="Deloitte" class="cm-footer__menu-image">
                    </a>
                </li>
                <li>
                    <a class="cm-footer__menu-link">
                        <img src="https://www.netguru.co/hubfs/images/custom-modules/footer/logo_forbes.png?t=1526654198212"
                             alt="Forbes" class="cm-footer__menu-image cm-footer__menu-image--forbes">
                    </a>
                </li>
                <li>
                    <a class="cm-footer__menu-link">
                        <img src="https://www.netguru.co/hubfs/images/custom-modules/footer/logo_inc5000.png?t=1526654198212"
                             alt="INC5000" class="cm-footer__menu-image cm-footer__menu-image--inc">
                    </a>
                </li>
            </ul>
        </div>

        <div class="loading" v-if="isLoading">
            <img :src="'loading.jpg' | img" alt="">
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import Component from 'vue-class-component'
    import Navbar from './partials/Navbar';
    import bus from 'js/bus';
    import Factory from "lib/contracts/Factory";
    import Account from "lib/Account";
    import {mapActions, mapState, mapMutations} from 'vuex';


    Component.registerHooks([
        'beforeRouteEnter',
        'beforeRouteLeave',
        'beforeRouteUpdate' // for vue-router 2.2+
    ]);
    export default {
        data() {
            return {
            }
        },
        components: {Navbar},
        computed: {
            ...mapState(['status', 'isLoading'])
        },
        mounted() {

        },
        methods: {
            ...mapMutations(['setIsLoading']),
            ...mapActions(['addPendingTransaction']),
            handleHidden() {
            },
        }

    }
</script>
