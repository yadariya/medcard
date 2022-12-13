import { ethers } from 'ethers';
import generatorAbi from './abi/generator';
import cardAbi from './abi/card';
import { Buffer } from 'buffer';
import { encrypt as ethEncrypt } from '@metamask/eth-sig-util';

import { AES, RSA } from './crypto';
import ipfs from './ipfs';

ipfs._sendAsync = ipfs.sendAsync;
ipfs.sendAsync = function(opts, cb) {
    let options = opts || {};
    options.uri = options.uri.replace('/cat/', '/cat?arg=');
    return ipfs._sendAsync(options, cb);
}

const encoder = new TextEncoder();

window.Buffer = window.Buffer || Buffer;

window.ethereum.on('accountsChanged', (accounts) => window.location.reload());
window.ethereum.on('chainChanged', (chainId) => window.location.reload());

export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const address = provider.send("eth_requestAccounts", []).then((addresses) => addresses[0]);

export class MedicalCard {
    constructor(address) {
        this.address = address;
        this.contract = new ethers.Contract(address, cardAbi, provider);
    }

    connect() {
        if (this.connected == undefined) {
            this.connected = this.contract.connect(provider.getSigner());
        }
        return this.connected;
    }

    async request(doctor, docpubkey, pages) {
        const key = await AES.generateKey();
        const iv = AES.generateIv();

        const pair = await RSA.getKey(await address);

        const request = {
            own: await RSA.encrypt(pair[1], key),
            doc: await RSA.encrypt(docpubkey, key),
            iv: iv,
            data_iv: AES.generateIv(),
            links: await AES.encrypt(key, iv, pages.map(p => ({id: p.id, key: p.key}))),
        };

        console.log(request);

        const cid = await ipfs.addJSON(request);
        const tx = await this.connect()['request'](doctor, cid);
        const res = await tx.wait();
        console.log(res);
    }

    async response(page, data) {
        const cid = await ipfs.add(await AES.encrypt(page.key, page.request.data_iv, data));
        const tx = await this.connect()['response'](page.id, cid);
        const res = await tx.wait();
        console.log(res);
    }

    async pages() {
        const _pages = await this.contract['pages']();
        const pages = [];

        const priv = (await RSA.getKey(await address))[0];

        for (let i of _pages) {
            const page = {
                id: pages.length,
                doctor: i.doctor,
                key: null,
                request: null,
                requestCid: i.requestCid,
                requestTimestamp: new Date(i.requestTimestamp.toNumber() * 1000),
                response: null,
                responseCid: i.responseCid,
                responseTimestamp: i.responseTimestamp.isZero() ? null : new Date(i.responseTimestamp.toNumber() * 1000),
                top: true,
                links: null,
                done: !i.responseTimestamp.isZero(),
            };
            pages.push(page);
        }

        await Promise.all(
            pages.map(async p => p.request = await ipfs.catJSON(p.requestCid))
        );

        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            try {
                page.key = page.key || await RSA.decrypt(priv, page.request.own);
            } catch (e) {}
            try {
                page.key = page.key || await RSA.decrypt(priv, page.request.doc);
            } catch (e) {}
            if (page.key) {
                page.links = await AES.decrypt(
                    page.key,
                    page.request.iv,
                    page.request.links,
                );
                for (let {id, key} of page.links) {
                    pages[id].key = key;
                    if (page.done) {
                        pages[id].top = false;
                    }
                }
            }
        }

        await Promise.all(
            pages.filter(p => p.key && p.done).map(async page => {
                page.response = await AES.decrypt(
                    page.key,
                    page.request.data_iv,
                    await ipfs.cat(page.responseCid),
                );
            })
        );

        console.log(pages);

        return pages;
    }
}

class MedicalCardGenerator {
    constructor(address) {
        this.address = address;
        this.contract = new ethers.Contract(address, generatorAbi, provider);
    }

    connect() {
        if (this.connected == undefined) {
            this.connected = this.contract.connect(provider.getSigner());
        }
        return this.connected;
    }

    async createCard() {
        let tx = await this.connect()['createCard']();
        let res = await tx.wait();
        return await this.card(await address);
    }

    async card(ownerAddress) {
        let cardAddress = await this.contract['card'](ownerAddress);
        if (cardAddress == "0x0000000000000000000000000000000000000000") {
            return null;
        }
        return new MedicalCard(cardAddress);
    }
}

export const generator = new MedicalCardGenerator("0x4E7563DD93f83AF86C41109E9D0a58aC11D45bAF");