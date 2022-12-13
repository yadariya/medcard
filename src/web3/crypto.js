export const AES = {
    generateIv() {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        return Buffer.from(iv).toString('base64');
    },
    async generateKey() {
        const key = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
        return Buffer.from(await window.crypto.subtle.exportKey(
            "raw",
            key
        )).toString('base64');
    },
    async encrypt(key, iv, data) {
        const _key = await window.crypto.subtle.importKey(
            "raw",
            Buffer.from(key, 'base64'),
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"],
        );
        const _iv = Uint8Array.from(Buffer.from(iv, 'base64'));
        const _enc = new TextEncoder();
        return Buffer.from(await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: _iv },
            _key,
            _enc.encode(JSON.stringify(data)),
        )).toString('base64');
    },
    async decrypt(key, iv, data) {
        const _key = await window.crypto.subtle.importKey(
            "raw",
            Buffer.from(key, 'base64'),
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"],
        );
        const _iv = Uint8Array.from(Buffer.from(iv, 'base64'));
        const _dec = new TextDecoder();
        return JSON.parse(_dec.decode(await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: _iv },
            _key,
            Buffer.from(data, 'base64'),
        )));
    }
};

export const RSA = {
    async getKey(name) {
        const storeKey = Buffer.from(name, 'utf-8').toString('base64');
        const cached = [
            window.localStorage.getItem(`private:${storeKey}`),
            window.localStorage.getItem(`public:${storeKey}`),
        ];
        if (cached[0] && cached[1]) {
            return cached;
        }

        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );
        const priv = Buffer.from(await window.crypto.subtle.exportKey(
            "pkcs8",
            keyPair.privateKey
        )).toString('base64');
        const pub = Buffer.from(await window.crypto.subtle.exportKey(
            "spki",
            keyPair.publicKey
        )).toString('base64');
        window.localStorage.setItem(`private:${storeKey}`, priv);
        window.localStorage.setItem(`public:${storeKey}`, pub);
        return [priv, pub];
    },
    async encrypt(key, data) {
        const _key = await window.crypto.subtle.importKey(
            "spki",
            Buffer.from(key, 'base64'),
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["encrypt"],
        );
        const _enc = new TextEncoder();
        return Buffer.from(await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            _key,
            _enc.encode(JSON.stringify(data)),
        )).toString('base64');
    },
    async decrypt(key, data) {
        const _key = await window.crypto.subtle.importKey(
            "pkcs8",
            Buffer.from(key, 'base64'),
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["decrypt"],
        );
        const _dec = new TextDecoder();
        return JSON.parse(_dec.decode(await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            _key,
            Buffer.from(data, 'base64'),
        )));
    }
}
