"use strict";
import bus from 'js/bus';

import web3 from "../web3";

const contract = require('truffle-contract');
const _GasReturnRelay = require('GasReturnRelay.json');
const _FlipContract = require('FlipContract.json');
const _BitcoinPriceStoppper = require('BitcoinPriceStoppper.json');
const _ENS = require('ENS.json');
let _objs = {}, _users = null;
const Factory = {
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
    async GasReturnRelay() {
        if (_objs.GasReturnRelay instanceof Promise) {
            return await _objs.GasReturnRelay;
        } else if (_objs.GasReturnRelay) {
            return _objs.GasReturnRelay;
        }
        _objs.GasReturnRelay = this.get('GasReturnRelay');
        _objs.GasReturnRelay = await _objs.GasReturnRelay;
        return _objs.GasReturnRelay;
    },
    async BitcoinPriceStoppper() {
        if (_objs.BitcoinPriceStoppper instanceof Promise) {
            return await _objs.BitcoinPriceStoppper;
        } else if (_objs.BitcoinPriceStoppper) {
            return _objs.BitcoinPriceStoppper;
        }
        _objs.BitcoinPriceStoppper = this.get('BitcoinPriceStoppper');
        _objs.BitcoinPriceStoppper = await _objs.BitcoinPriceStoppper;
        return _objs.BitcoinPriceStoppper;
    },
    async ENS() {
        if (_objs.ENS instanceof Promise) {
            return await _objs.ENS;
        } else if (_objs.ENS) {
            return _objs.ENS;
        }
        _objs.ENS = this.get('ENS');
        _objs.ENS = await _objs.ENS;
        return _objs.ENS;
    },
    async deployNewContract(name, from) {

        const contractDefaults = {
            from: from,
            gas: 4712388,
            gasPrice: 10000000000
        };
        let obj = '';
        switch (name) {
            case 'FlipContract':
                obj = contract(_FlipContract);
                break;
            case 'GasReturnRelay':
                obj = contract(_GasReturnRelay);
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
            case 'FlipContract':
                obj = contract(_FlipContract);
                break;
            case 'ENS':
                obj = contract(_ENS);
                break;
            case 'BitcoinPriceStoppper':
                obj = contract(_BitcoinPriceStoppper);
                break;
            case 'GasReturnRelay':
                obj = contract(_GasReturnRelay);
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
