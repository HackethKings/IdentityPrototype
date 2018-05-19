<template>
    <div class="row">
        <div class="col-sm" style="text-align: center;">
            <img :src="logo" alt="" style="height: 25vh;display: inline-block;margin: 0 auto;">
            <h1>ANOTHER SHITCOIN ON THE RISE</h1>
            <h5>so much innovation. wow.</h5>
            <h5>nobody can stop it wow.</h5>
            <h1 style="margin-top: 20px;font-size: 90px;">${{price}}</h1>
        </div>
    </div>
</template>

<script>
    import logo from '../../Bitcoin.svg.png';
    import Vue from 'vue';
    import Factory from "lib/contracts/Factory";
    import Account from "lib/Account";
    import {mapState, mapMutations} from 'vuex';
    import Relay from "../lib/Relay";

    export default {
        mainAccount: null,
        address: null,
        user: {},
        data: function () {
            return {
                logo,
                price: '-9870'
            }
        },
        computed: {
            ...mapState([])
        },
        components: {},
        methods: {
            ...mapMutations([]),
        },
        async mounted() {
            const c = await Factory.BitcoinPriceStoppper();
            const p = await c.getCalculation.call();
            this.price = p;
        }
    }
</script>
