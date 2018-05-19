import Vuex from "vuex";
import Vue from "vue";

let state = {
    status: false,
    accounts: [],
    mainAccount: null,
    user: null,
    pendingTransactions: [],
    receipts: [],
    web3: null,
    isLoading: false,
    /** HACKETH **/
    identity: null,
    allowScanQrModal: false

};

Vue.use(Vuex);
export default new Vuex.Store({
    state,
    mutations: {
        setAccounts(state, accounts) {
            state.accounts = accounts;
        },
        setMainAccount(state, mainAccount) {
            state.mainAccount = mainAccount;
        },
        setUser(state, user) {
            state.user = user;
        },
        addPendingTransaction(state, tx) {
            state.pendingTransactions.push(tx);
        },
        removePendingTransaction(state, tx) {
            const index = state.pendingTransactions.indexOf(tx);
            state.pendingTransactions.splice(index, 1);
        },
        setStatus(state, status) {
            state.status = status;
        },
        setIsLoading(state, is) {
            state.isLoading = is;
        },
        setIdentity(state, identity) {
            state.identity = identity;
        },
        setAllowScanQrModal(state, allowScanQrModal) {
            state.allowScanQrModal = allowScanQrModal;
        }
    },
    actions: {
        async addPendingTransaction({commit, state}, tx) {
            commit('addPendingTransaction', tx);
            const receipt = await window.web3.eth.getTransactionReceiptMined(tx);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    commit('removePendingTransaction', tx);
                    resolve(receipt);
                }, 0);
            });
        }
    }
});
