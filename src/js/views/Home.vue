<template>
    <div class="p-5 flex-row d-flex v-h p-0 m-0 align-items-center justify-content-center">
        <div id="deploy" class="animated jello">
            <form action="" v-if="!localKeys.length">
                <h2>Metamaskless login*</h2>
                <label for="name">name:</label>
                <input type="text" v-model="username" id="name"/>
                <select v-model="domain">
                    <option value=".eth">.eth</option>
                    <option value=".hack.eth">.hack.eth</option>

                </select><br/>
                <button style="font-size: 100px;background-color: #f00;">LOGIN</button>
            </form>
        </div>
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
        data: function () {
            return {
                username: '',
                domain: '.eth'
            }
        },
        computed: {
            ...mapState(['status', 'user', 'localKeys'])
        },
        components: {}
    }
</script>
