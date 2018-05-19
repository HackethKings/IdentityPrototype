<template>
    <Layout>
    </Layout>
</template>
<script>
    import Vue from 'vue';
    import Component from 'vue-class-component'
    import Layout from './Layout';

    @Component({
        components: {
            Layout
        }
    })
    export default class App extends Vue {

    }
</script>
