<template>
    <div class="row" style="margin-top: 100px;">
        <div class="col-sm">
            <h1>Go Blockchain.<br/>Go Free.</h1>
            <div classss="p-5 flex-row d-flex v-h p-0 m-0 align-items-center justify-content-center">
                <div id="deploy" class="animated jello">
                    <form action="" v-if="!identity" @submit.prevent="handleSubmit()">
                        <label for="name">name:</label>
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
                    <div v-else>
                        Great! You are logged in as {{identity.username}}
                    </div>
                    <div>
                        <button class="btn btn-secondary" v-on:click="seen = !seen">Add key</button>
                    </div>
                </div>
                <QrModal
                        :username="qrIdentity.username"
                        :address="qrIdentity.address"
                        v-if="qrIdentity" @cancel="handleCancel"
                        ref="qrModal"
                        @ok="handlePublicKeyAdded"></QrModal>
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
</template>

<script>
    import gif from '../../welcome.gif';
    import Vue from 'vue';
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
                if (identityAddress) {
                    //login
                    this.qrIdentity = new Identity(username, identityAddress, wallet.privateKey, wallet.address);
                    if (this.$refs.qrModal) {
                        this.$refs.qrModal.show();
                    }
                } else {
                    //deploy
                    (new Relay()).deploy(username, wallet.address)
                }
            },
            handlePublicKeyAdded() {
                const identityRepository = new IdentityRepository();
                //successful login
                identityRepository.setActiveIdentity(this.qrIdentity.username, this.qrIdentity.identityAddress, this.qrIdentity.privateKey);
                //TODO: move this to identity repository
                this.setIdentity(this.qrIdentity);
                // console.log("success");
                this.qrIdentity = null;
            },
            handleCancel() {
                alert('Fail adding new key to identity');
                this.qrIdentity = null;
            },

        }
    }
</script>
