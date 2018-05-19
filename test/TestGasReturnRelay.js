const GasReturnRelay = artifacts.require("GasReturnRelay");
const FlipContract = artifacts.require("FlipContract");
const Web3EthAbi = require('web3-eth-abi');

contract("FlipContract", accounts => {
    const [owner] = accounts;
    let flipContract;
    let gasReturnRelay;

    beforeEach(async () => {
        flipContract = await FlipContract.new();
        gasReturnRelay = await GasReturnRelay.new();
    })

    it("GasReturnRelay accepts funds", async () => {
        let testAmount = 1000000;
        await gasReturnRelay.sendTransaction({from: owner, value: testAmount});
        assert((await web3.eth.getBalance(gasReturnRelay.address)).eq(testAmount));
    })

    it("FlipContract can flip", async () => {
        assert.isFalse(await flipContract.flipped.call());
        await flipContract.flip({from: owner});
        assert.isTrue(await flipContract.flipped.call());
    });

    it("GasReturnRelay can call", async () => {
        assert.isFalse(await flipContract.flipped.call());
        let data = Web3EthAbi.encodeFunctionSignature('flip()');
        await gasReturnRelay.callGasRelayed(flipContract.address, 0, data, 0, 100000, {from: owner});
        assert.isTrue(await flipContract.flipped.call());
    });

    it("GasReturnRelay can return gas", async () => {
        let testAmount = 100000;
        await gasReturnRelay.sendTransaction({from: owner, value: testAmount});

        let contractBalanceBefore = await web3.eth.getBalance(gasReturnRelay.address);

        let gasEstimate = await flipContract.flip.estimateGas({from: owner});
        console.log('gasEstimate =', gasEstimate);
        let data = Web3EthAbi.encodeFunctionSignature('flip()');

        let ownerBalanceBefore = await web3.eth.getBalance(owner);
        console.log('ownerBalanceBefore =', web3.fromWei(ownerBalanceBefore).toNumber(), "ETH");

        await gasReturnRelay.callGasRelayed(flipContract.address, 0, data, 1, 100000, {from: owner});

        let ownerBalanceAfter = await web3.eth.getBalance(owner);
        console.log('ownerBalanceAfter =', web3.fromWei(ownerBalanceAfter).toNumber(), "ETH");
        
        let contractBalanceAfter = await web3.eth.getBalance(gasReturnRelay.address);


        let gasSpent = (contractBalanceBefore - contractBalanceAfter);

        let ownerBalanceChange = (ownerBalanceBefore - ownerBalanceAfter);

        console.log('gasSpent =', gasSpent);
        console.log('ownerBalanceChange =', web3.fromWei(ownerBalanceChange), "ETH");
        
        console.log('overHead =', Math.round(((gasSpent / gasEstimate) - 1) * 100) + "%");

        assert.isAbove(gasSpent, gasEstimate*0.9);
        assert.isBelow(gasSpent, gasEstimate*1.1);
        

    });
    

})