<template>
    <div class="p-5 flex-row d-flex v-h p-0 m-0 align-items-center justify-content-center">
        <div id="deploy" class="animated jello">
            <form action="" v-if="!accountKey" @submit.prevent="handleSubmit()">
                <h2>Metamaskless login*</h2>
                <label for="name">name:</label>
                <input type="text" v-model="username" id="name"/>
                <select v-model="domain">
                    <option value=".eth">.eth</option>
                    <option value=".hack.eth">.hack.eth</option>

                </select><br/>
                <button style="font-size: 100px;background-color: #f00;" type="submit">LOGIN</button>
            </form>
        </div>
        <QrModal :address="qrIdentity.address" v-if="qrIdentity" @hidden="handleCancel"
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
                qrIdentity: null
            }
        },
        computed: {
            ...mapState(['status', 'user', 'localKeys', 'accountKey'])
        },
        components: {QrModal},
        methods:{

            async handleSubmit() {
                const identityRepository = new IdentityRepository();
                const identityAddress = await new ENS().getIdentityAddressByUsername(this.username + this.domain);
                const wallet = identityRepository.generateNewWallet();
                this.qrIdentity = new Identity(this.username, identityAddress, wallet.privateKey, wallet.address);
            },
            handlePublicKeyAdded() {
                const identityRepository = new IdentityRepository();
                //successful login
                identityRepository.storeIdentity(this.qrIdentity.username, this.qrIdentity.identityAddress, this.qrIdentity.privateKey);

            },
            handleCancel() {
                alert('Fail adding new key to identity');
            }
        }
    }
</script>
