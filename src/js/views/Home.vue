<template>
    <div class="p-5 flex-row d-flex v-h p-0 m-0 align-items-center justify-content-center">
        <div id="deploy" class="animated jello">
            <form action="" v-if="!accountKey" @submit.prevent="handleSubmit()">
                <h2>Metamaskless login*</h2>
                <label for="name">name:</label>
                <input type="text" v-model="username" id="name" ref="shake"/>
                <select v-model="domain">
                    <option value=".eth">.eth</option>
                    <option value=".hack.eth">.hack.eth</option>

                </select><br/>
                <button style="font-size: 100px;background-color: #f00;" type="submit">LOGIN</button>
            </form>
        </div>
        <QrModal
                :username="qrIdentity.username"
                :address="qrIdentity.address"
                v-if="qrIdentity" @cancel="handleCancel"
                ref="qrModal"
                @ok="handlePublicKeyAdded"></QrModal>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Factory from "lib/contracts/Factory";
    import Account from "lib/Account";
    import {mapState} from 'vuex';
    import IdentityRepository from "../lib/repositories/IdentityRepository";
    import ENS from "../lib/ENS";
    import QrModal from 'js/components/QrModal';
    import Identity from "../lib/Identity";

    export default {
        mainAccount: null,
        address: null,
        user: {},
        data: function () {
            return {
                username: '',
                domain: '.eth',
                qrIdentity: null,
                shake: false
            }
        },
        computed: {
            ...mapState(['status', 'user', 'localKeys', 'accountKey'])
        },
        components: {QrModal},
        methods: {

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
                const identityAddress = await new ENS().getIdentityAddressByUsername(this.username + this.domain);
                const wallet = identityRepository.generateNewWallet();
                this.qrIdentity = new Identity(this.username, identityAddress, wallet.privateKey, wallet.address);
                if (this.$refs.qrModal) {
                    this.$refs.qrModal.show();
                }
            },
            handlePublicKeyAdded() {
                const identityRepository = new IdentityRepository();
                //successful login
                identityRepository.storeIdentity(this.qrIdentity.username, this.qrIdentity.identityAddress, this.qrIdentity.privateKey);
                console.log("success");
                this.qrIdentity = null;
            },
            handleCancel() {
                alert('Fail adding new key to identity');
                this.qrIdentity = null;
            }
        }
    }
</script>
