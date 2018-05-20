<template>
    <div class="row">
        <div class="col-sm" style="text-align: center;">
            <img :src="logo" alt="" style="height: 25vh;display: inline-block;margin: 0 auto;"
                 ref="logo"
                 class="animated rubberBand">
            <h1>{{title}}</h1>
            <h2>{{subtitle}}</h2>
            <h2>nobody can stop it wow.</h2>
            <h2>invest now thank me later.</h2>
            <h1 style="margin-top: 20px;font-size: 90px;" v-if="price>0">${{price}}</h1>
            <h2 v-if="lastStopper">Last stopper:{{lastStopper}}</h2>
        </div>
    </div>
</template>

<script>
    import logo from '../../Bitcoin.svg.png';
    import jp2 from '../../janpawel.jpg';
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
                hasAdded: false,
                logo,
                title: "BIGGEST ICO TO FILL YOUR POCKET",
                subtitle: "so much innovation. wow.",
                price: '0',
                lastStopper: null
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
            setTimeout(async () => {

                const c = await Factory.BitcoinPriceStoppper();
                console.log(c);
                setInterval(async () => {
                    const p = await c.getCalculation.call();
                    this.price = p.toNumber().toString();
                    if (this.price == 0) {
                        this.logo = jp2;
                        // this.title = "POLAND SAVES WORLD AGAIN";
                        // this.title = "THANK YOU POLISH";
                        // this.subtitle = "i can buy legit ICOs again wow.";
                        const c = "rubberBand";
                        if (!this.hasAdded) {

                            this.$refs.logo.classList.remove('animated');
                            this.$refs.logo.classList.remove(c);
                            this.$refs.logo.offsetHeight;
                            this.$refs.logo.classList.add('animated');
                            this.$refs.logo.classList.add(c);
                            this.$refs.logo.offsetHeight;
                        }
                        this.hasAdded = true;
                    }
                }, 500);

                c.PriceClicked().watch((err, response) => {
                    console.log(response);
                    this.lastStopper = response.address;
                });
            }, 50);
        }
    }
</script>
