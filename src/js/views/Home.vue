<template>
    <div>

        <div class="row" style="margin-top: 100px;">
            <div class="col-sm">
                <h1>Go Blockchain.<br/>Go Free.</h1>
                <div classss="p-5 flex-row d-flex v-h p-0 m-0 align-items-center justify-content-center">
                    <div id="deploy" class="animated jello">
                        <form action="" v-if="!identity" @submit.prevent="handleSubmit()">
                            <h3>Login to get free</h3>
                            <div class="input-group">
                                <input type="text" v-model="username" id="name" ref="shake" class="form-control"
                                       placeholder="username"/>
                                <div class="input-group-append">
                                    <select v-model="domain" class="custom-select">
                                        <option value=".eth">.eth</option>
                                        <option value=".hack.eth">.hack.eth</option>

                                    </select>
                                </div>
                            </div>
                            <br/>
                            <button type="submit" class="btn btn-secondary">Log in</button>
                        </form>
                        <div v-else style="margin-top: 50px;">
                            <i style="font-size: 1.6em;"><span style="text-decoration: underline;">You:</span> Normal
                                crypto investor. <br/><span
                                        style="text-decoration: underline;">Current state of crypto:</span> Another
                                shitcoin is on the rise. Send transactions without MetaMask to stop it.</i><br/>
                            <button @click="stopBitcoin" class="btn btn-light"
                                    style="margin-top: 40px;margin-left: 110px;font-size: 2em;">Stop <span style="
    text-decoration: line-through;">Bitcoin</span> Shitcoin
                            </button>
                        </div>
                    </div>
                    <QrModal
                            :username="qrIdentity.username"
                            :address="qrIdentity.address"
                            v-if="qrIdentity" @cancel="handleCancel"
                            ref="qrModal"></QrModal>
                    <ScanQrModal
                            v-if="allowScanQrModal"
                            ref="scanQrModal"></ScanQrModal>
                </div>
            </div>
            <div class="col-sm">
                <div>
                    <img :src="gif" alt="" style="max-width: 100%;"><br/>
                    <div style="font-size: 0.8em;opacity: .4;">© https://dribbble.com/mikepiechota</div>
                </div>
            </div>
        </div>
        <span style="text-transform: uppercase;opacity: .8;text-align: center;display: block;margin-top: 100px;">As seen on:</span>
        <ul class="cm-footer__list cm-footer__list--images" style="margin-top: 20px;">
            <li style="margin-right: 50px;">
                <a class="cm-footer__menu-link">
                    <img class="featured-logo wow fadeIn" data-wow-duration="0.4s" src="https://movecloser.co/wp-content/themes/movecloser/images/logos/logo-forbes-new5.png" style="visibility: visible; animation-duration: 0.4s;">
                </a>
            </li>

            <li>
                <a class="cm-footer__menu-link">
                    <img class="featured-logo wow fadeIn" data-wow-duration="0.6s"
                         src="https://movecloser.co/wp-content/themes/movecloser/images/logos/logo-polska.png"
                         style="visibility: visible; animation-duration: 0.6s;">
                </a>
            </li>
            <li>
                <a class="cm-footer__menu-link">
                    <img class="featured-logo wow fadeIn" data-wow-duration="0.8s"
                         src="https://movecloser.co/wp-content/themes/movecloser/images/sales/wyborcza.png"
                         style="visibility: visible; animation-duration: 0.8s;">
                </a>
            </li>
            <li>
                <a class="cm-footer__menu-link">
                    <img class="featured-logo wow fadeIn" data-wow-duration="1s"
                         src="https://movecloser.co/wp-content/themes/movecloser/images/sales/puls-biznesu.png"
                         style="visibility: visible; animation-duration: 1s;"></a>
            </li>
        </ul>
    </div>
</template>

<script>
    import gif from '../../welcome.gif';
    import Vue from 'vue';
    import web3 from '../lib/web3';
    import Factory from "lib/contracts/Factory";
    import Account from "lib/Account";
    import {mapState, mapMutations} from 'vuex';
    import IdentityRepository from "../lib/repositories/IdentityRepository";
    import ENS from "../lib/ENS";
    import QrModal from 'js/components/QrModal';
    import ScanQrModal from 'js/components/ScanQrModal';
    import Identity from "../lib/Identity";
    import Relay from "../lib/Relay";

    export default {
        mainAccount: null,
        address: null,
        user: {},
        data: function () {
            return {
                gif: gif,
                username: '',
                domain: '.eth',
                qrIdentity: null,
                shake: false,
                seen: false
            }
        },
        computed: {
            ...mapState(['status', 'user', 'localKeys', 'identity', 'allowScanQrModal'])
        },
        components: {QrModal, ScanQrModal},
        methods: {
            ...mapMutations(['setIdentity']),

            async handleSubmit() {
                if (!this.username || !this.username.length) {
                    const c = 'tada';
                    this.$refs.shake.classList.remove('animated');
                    this.$refs.shake.classList.remove(c);
                    this.$refs.shake.offsetHeight;
                    this.$refs.shake.classList.add('animated');
                    this.$refs.shake.classList.add(c);
                    this.$refs.shake.offsetHeight;
                    return;
                }
                const identityRepository = new IdentityRepository();
                const username = this.username + this.domain;
                const identityAddress = await
                    new ENS().getIdentityAddressByUsername(username);
                const wallet = identityRepository.generateNewWallet();
                if (identityAddress && identityAddress !== "0x0000000000000000000000000000000000000000" && identityAddress !== "0x0") {
                    //login
                    this.qrIdentity = new Identity(username, identityAddress, wallet.privateKey, wallet.address);
                    if (this.$refs.qrModal) {
                        this.$refs.qrModal.show();
                    }
                    //event NewKeyAdded
                    const contract = require('truffle-contract');
                    const _GasReturnRelay = require('GasReturnRelay.json');
                    let deployed = contract(_GasReturnRelay);
                    deployed.setProvider(web3.getWeb3().currentProvider);
                    deployed = await deployed.at(identityAddress);
                    console.log(deployed);
                    deployed.NewKeyAdded().watch((err, response) => {
                        this.$refs.qrModal.hide();
                        const identity = this.qrIdentity;
                        new IdentityRepository().setActiveIdentity(username, identityAddress, wallet.privateKey);
                        this.setIdentity(identity);
                    })
                } else {
                    //deploy
                    const identityAddress = await (new Relay()).deploy(username, wallet.address);
                    // const identityAddress = '0x12312321312391239129';// await (new Relay()).deploy(username, wallet.address);
                    const identity = new Identity(username, identityAddress, wallet.privateKey, wallet.address);
                    new IdentityRepository().setActiveIdentity(username, identityAddress, wallet.privateKey);
                    this.setIdentity(identity);
                }
            },
            // async handlePublicKeyAdded() {
            // },
            handleCancel() {
                alert('Fail adding new key to identity');
                this.qrIdentity = null;
            },
            async stopBitcoin() {
                const btc = await Factory.BitcoinPriceStoppper();
                (new Relay()).exec({
                    data: 'click()',
                    to: btc.address,
                    value: 0,
                    gasPrice: 0,
                    gasLimit: 100,
                    relayAddress: this.identity.identityAddress
                });
            }

        }
    }
</script>
