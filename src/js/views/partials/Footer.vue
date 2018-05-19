<template>
    <div class="footer text-center p-5 mt-5 w-100 ">
        <div class="footer__logo" v-html="logo"></div>
        <span>© 2018 All rights reserved</span>
    </div>
</template>
<script>

    import Vue from 'vue';
    import Component from 'vue-class-component'
    // import logo from 'img/logo.svg';


    @Component({
        props: ['admin']
    })
    export default class Footer extends Vue {
        logo = logo
    }
</script>
