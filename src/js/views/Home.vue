<template>
    <div class="p-5 flex-row d-flex p-0 m-0 align-items-stretch">
    </div>
</template>

<script>
    import Vue from 'vue';
    import Factory from "lib/contracts/Factory";
    import Account from "lib/Account";
    import {mapState} from 'vuex';

    export default {
        mainAccount: null,
        address: null,
        user: {},
        computed: {
            ...mapState(['status', 'user'])
        },
        components: {
        }
    }
</script>
