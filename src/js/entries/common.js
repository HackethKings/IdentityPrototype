import Account from "lib/Account";
import Factory from "lib/contracts/Factory";
import Vue from "vue";
import Store from "js/store";
import web3 from "lib/web3";
import bus from 'js/bus';

export default class Common {
    constructor(router, App) {
        const self = this;
        this.vue = new Vue({
            el: '#app',
            components: {App},
            router,
            store: Store,
            async created() {
                bus.$on('contractInvalid', () => {
                    this.$store.commit('setStatus', false);
                });
                web3.init();
                const TimeConstrainedCounter = await Factory.TimeConstrainedCounter();
                const accounts = await Account.getAccounts();
                window.contract = TimeConstrainedCounter;
                self.setAccounts(accounts);
                this.$store.commit('setStatus', true);
                if (web3.usesInjectedWeb3) {
                    //Taken from https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md
                    var account = window.web3.eth.accounts[0];
                    var accountInterval = setInterval(() => {
                        if (window.web3.eth.accounts[0] !== account) {
                            account = window.web3.eth.accounts[0];
                            Account.getAccounts().then((accounts) => {
                                self.setAccounts(accounts);
                            });
                        }
                    }, 100);
                }
                /*
                @
                TODO: load localkeys from localstorage
                TODO: check local storage for key
                TODO: if key present create challengemsg transaction
                 */
            }
        });
    }

    async setAccounts(accounts) {
        let mainAccount = accounts[0];
        const balance = await Factory.getBalance(mainAccount);
        this.vue.$store.commit('setAccounts', accounts);
        this.vue.$store.commit('setMainAccount', mainAccount);
        this.vue.$store.commit('setUser', {
            wallet_address: mainAccount,
            balance,
            balanceDisplay: web3.getWeb3().fromWei(balance, 'ether') + 'Ξ'
        });
    }

}
