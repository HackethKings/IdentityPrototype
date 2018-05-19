<template>
    <div class="navbar d-flex w-100 fixed-top">
        <div class="navbar__logo">
            <router-link v-html="'Home'" class=" navbar__item m-0 navbar__item--logo"
                         :to="{ name: 'home' }"></router-link>
        </div>
        <div class="navbar__menu text-uppercase d-flex">
            <div class="btn navbar__item m-0 h6 btn-flat" style="vertical-align: middle;" v-if="status">
                <div class="status-dot va-m"></div>
                <span class="va-m">connected</span>
            </div>
            <div class="btn navbar__item m-0 h6 btn-flat" style="vertical-align: middle;"
                 v-if="pendingTransactions.length">pending transactions: {{pendingTransactions.length}}
            </div>
            <slot></slot>
            <!--<router-link v-if="!$auth.check()" class="btn navbar__item m-0 h6 btn-flat" :to="{ name: 'login' }">Login-->
            <!--</router-link>-->
            <!--<div v-if="$auth.check()" class="btn navbar__item m-0 h6 btn-flat" :to="{ name: 'login' }" @click="logout">-->
                <!--Logout-->
            <!--</div>-->
        </div>
        <div class="user-info-wrap" style="display: none;">
            <div class="user-info" v-if="user">Twoje imię: {{user.name}} |</div>
            <div class="user-info" v-if="mainAccount">twój portfel: {{mainAccount}} | {{user.balanceDisplay}}</div>
            <div class="user-info" v-if="contract">adres kontraktu: {{contract.address}}</div>
        </div>
    </div>
</template>
<script>

    import Vue from 'vue';
    import Component from 'vue-class-component'
    // import logo from 'img/logo.svg';
    import {mapState} from 'vuex';


    export default {

        props: ['admin'],
        data() {
            return {
                contract: null
            }
        },
        computed: {
            ...mapState(['user', 'mainAccount', 'pendingTransactions', 'status'])
        },
        mounted() {
            this.contract = window.contract;
        },
        methods: {
            logout() {
                // Vue.auth.logout({redirect: {name: 'home'}});

                // this.$auth.logout({
                //     makeRequest: true,
                //     success() {
                //         console.log('success ' + this.context);
                //     },
                //     error() {
                //         console.log('error ' + this.context);
                //     }
                // });
            }
        }
    }
</script>
