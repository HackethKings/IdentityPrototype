"use strict";
import bus from 'js/bus';

import web3 from "../web3";

const contract = require('truffle-contract');
const _TimeConstrainedCounter = require('TimeConstrainedCounter');
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
