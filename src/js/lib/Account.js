import web3 from './web3';

const Account = {
    async getAccounts() {
        return new Promise((resolve, reject) => {
            web3.getWeb3().eth.getAccounts((err, accs) => {
                if (err != null) {
                    alert("There was an error fetching your accounts.");
                    return;
                }
                resolve(accs);
            })
        })
    },
    async getMainAccount() {
        const accounts = await this.getAccounts();
        if(accounts.length){
            return accounts[0];
        }
        return null;
    }
};

export default Account;
