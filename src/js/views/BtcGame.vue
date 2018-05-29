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
            <h1 style="margin-top: 20px;font-size: 90px;" v-if="price>0" ref="price">${{price}}</h1>
            <h2 v-if="lastStopper">Last stopper:{{lastStopper}}</h2>
            <!--<iframe width="560" height="315" src="https://www.youtube.com/embed/xK3yuxrmCac" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>-->
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
                    const css = "rubberBand";
                    const newPrice = p.toNumber().toString();
                    if (newPrice < this.price) {
                        this.$refs.price.classList.remove('animated');
                        this.$refs.price.classList.remove('swing');
                        this.$refs.price.offsetHeight;
                        this.$refs.price.classList.add('animated');
                        this.$refs.price.classList.add('swing');
                        this.$refs.price.offsetHeight;
                    }
                    this.price = newPrice;
                    if (this.price == 0) {
                        if (!this.hasAdded) {
                            this.$refs.logo.classList.remove('animated');
                            this.$refs.logo.classList.remove(css);
                            this.$refs.logo.offsetHeight;
                            this.$refs.logo.classList.add('animated');
                            this.$refs.logo.classList.add(css);
                            this.$refs.logo.offsetHeight;
                        }
                        this.hasAdded = true;
                    }
                }, 1000);

                c.PriceClicked().watch((err, response) => {
                    console.log(response);
                    this.lastStopper = response.address;
                });
            }, 50);
        }
    }
</script>
