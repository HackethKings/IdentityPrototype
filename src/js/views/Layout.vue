<template>
    <div style="margin-top: 50px;">
        <Navbar>
            <slot name="navbar"></slot>
        </Navbar>

        <div class="container site__body">
            <slot name="content">
                <router-view></router-view>
            </slot>
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
