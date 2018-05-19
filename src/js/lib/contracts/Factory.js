"use strict";
import bus from 'js/bus';

import web3 from "../web3";

const contract = require('truffle-contract');
const _TimeConstrainedCounter = require('TimeConstrainedCounter');
const _FlipContract = require('FlipContract');
let _objs = {}, _users = null;
const Factory = {
    async TimeConstrainedCounter() {
        if (_objs.TimeConstrainedCounter instanceof Promise) {
            return await _objs.TimeConstrainedCounter;
        } else if (_objs.TimeConstrainedCounter) {
            return _objs.TimeConstrainedCounter;
        }
        _objs.TimeConstrainedCounter = this.get('TimeConstrainedCounter');
        _objs.TimeConstrainedCounter = await _objs.TimeConstrainedCounter;
        return _objs.TimeConstrainedCounter;
    },
    async FlipContract() {
        if (_objs.FlipContract instanceof Promise) {
            return await _objs.FlipContract;
        } else if (_objs.FlipContract) {
            return _objs.FlipContract;
        }
        _objs.FlipContract = this.get('FlipContract');
        _objs.FlipContract = await _objs.FlipContract;
        return _objs.FlipContract;
    },
    async deployNewContract(name, from) {

        const contractDefaults = {
            from: from,
            gas: 4712388,
            gasPrice: 10000000000
        };
        let obj = '';
        switch (name) {
            case 'TimeConstrainedCounter':
                obj = contract(_TimeConstrainedCounter);
                break;
            case 'FlipContract':
                obj = contract(_FlipContract);
                break;
        }

        obj.setProvider(web3.getWeb3().currentProvider);
        obj.defaults(contractDefaults);
        const deployed = await obj.new();
        return deployed;
    },
    /**
     * Get contract instance
     * @param name
     * @returns {Promise<*>}
     */
    async get(name) {
        let obj = '';
        switch (name) {
            case 'TimeConstrainedCounter':
                obj = contract(_TimeConstrainedCounter);
                break;
            case 'FlipContract':
                obj = contract(_FlipContract);
                console.log("XXXXX",)
                break;
        }

        obj.setProvider(web3.getWeb3().currentProvider);

        /**
         * Metamask has tendency to hang up on first call to network, if it cant connect for some their bug in code, it will stall indifinetely
         */
        let hasConnected = false;
        setTimeout(function () {
            if (!hasConnected) {
                console.error("Connection to ethereum node has stalled");
            }
        }, 2000);
        return obj.deployed().then(async (deployed) => {
            hasConnected = true;
            if (!deployed) {
                // alert("Niepoprawny kontrakt");
                bus.$emit('contractInvalid');
            }
            // const isImplemented = await deployed.implementsERC721();
            // if (!isImplemented) {
            //     bus.$emit('contractInvalid');
            // alert("Contract invalid, is not implementing ERC721");
            // }
            return deployed;
        });
    },
    async getBalance(address) {
        return new Promise((resolve) => {
            if (!address) {
                return resolve(0);
            }
            web3.getWeb3().eth.getBalance(address, (error, result) => {
                resolve(result);
            });
        });
    }
};
export default Factory;
