<template>
    <div class="navbar d-flex w-100 fixed-top">
        <div class="navbar__logo container">
            <div class="logo h6"
                 style="position: fixed;left: 50%;top: 10px;transform:translate(-50%,0);font-size: 1.7rem;">

                <span v-html="logo" alt="" class="logo-img"></span>
                <span style="display: inline-block;margin-left: 20px;color: #fff;">IdentityBlockchain</span>
            </div>
            <div class="col-sm" style="display: none;">
                <router-link v-html="'Home'" class="va-m h6 navbar-item"
                             :to="{ name: 'home' }"></router-link>
                <router-link v-html="'APP'" class="h6 navbar-item"
                             v-if="identity"
                             :to="{ name: 'app' }"></router-link>
            </div>
        </div>
        <div class="navbar__menu text-uppercase d-flex">
            <div class="btn navbar__item m-0 btn-flat" style="vertical-align: middle;" v-if="status">
                <div class="status-dot va-m"></div>
                <span class="va-m h6" v-if="identity">Hi, {{identity.username}}</span>
                <span class="f-l" v-if="identity" @click="scanQr" style="opacity: .5;">SCAN QR</span>
                <span class="f-l" v-if="identity" @click="logout" style="opacity: .5;">logout</span>
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
    import logo from '../../../logo.svg';
    import grant from '../../../grant.png';
    import {mapState, mapMutations} from 'vuex';
    import IdentityRepository from "../../lib/repositories/IdentityRepository";


    export default {

        props: ['admin'],
        data() {
            return {
                logo,
                grant,
                contract: null
            }
        },
        computed: {
            ...mapState(['user', 'mainAccount', 'pendingTransactions', 'status', 'identity'])
        },
        mounted() {
            this.contract = window.contract;
        },
        methods: {
            ...mapMutations(['setIdentity', 'setAllowScanQrModal']),
            logout() {
                new IdentityRepository().logout();
                this.setIdentity(null);
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
            },
            scanQr() {
                this.setAllowScanQrModal(true);

            }
        }
    }
</script>
