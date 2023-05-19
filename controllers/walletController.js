const fs = require('fs')
const bip39 = require("bip39")
const crypto = require("crypto");
const bs58 = require('bs58');

//A hierachical deterministic wallet can create multiple adresses from one seed
//it is usefull,since someone can know the total amount of bitcoin you have by 
//adding up previous transactions. A HD wallet allows you to use a wallet once and create another
//wallet linked to the same private key
const createMnemonic = async (req, res) => {
    console.log("Create mnemonic handler called")

    // Generate a random mnemonic , defaults to 128-bits of entropy
    const body = req.body;
    const entropy = body.entropy
    console.log(entropy);
    const mnemonic = bip39.generateMnemonic(entropy)

    console.log(console.log(bip39.validateMnemonic(mnemonic)))
    return res.status(200).json(mnemonic)

}
const createWalletSeed = async (req, res) => {
    console.log("Create wallet seed handler called")

    const body = req.body;
    const mnemonic = body.mnemonic

    console.log(mnemonic);

 
        const seed = await bip39.mnemonicToSeed(mnemonic).then(bytes => bytes.toString('hex'))
        console.log(seed)
        return res.status(200).json(seed)
  

}

const createWallet = async (req, res) => {

    console.log("Create wallet handler called")
    const params = req.body;
    const walletName = params.walletName
    const walletPassword = params.walletPassword
    const seed = params.seed

    console.log(walletName);
    console.log(seed);
    const walletDatabaseDir = `/home/jk/.bitcoin/wallets/${walletName}`
    //check if wallet folder already exists
    console.log(walletDatabaseDir)
    if (fs.existsSync(walletDatabaseDir)) {
        console.log('Directory exists!')
        return res.status(409).json({ 'createwallet': 'The wallet already exists' })

    } else {
        console.log('Directory not found.')
        if (walletPassword == undefined) {
            console.log("no password")

            let response = await fetch('http://127.0.0.1:8332/', {
                method: 'POST',
                headers: {
                    'content-type': 'text/plain;',
                    'Authorization': 'Basic ' + btoa('kimuts:123456')
                },
                body: `{"jsonrpc": "1.0", "id": "curltest", "method": "createwallet", "params": ["${walletName}",false,true]}`
            });


            response.json().then(function (data) {
                console.log(data);
                return res.status(response.status).json({ 'createwallet': data })

            });
            // setWalletSeed(walletName, seed);
        }else{

            let response = await fetch('http://127.0.0.1:8332/', {
                method: 'POST',
                headers: {
                    'content-type': 'text/plain;',
                    'Authorization': 'Basic ' + btoa('kimuts:123456')
                },
                body: `{"jsonrpc": "1.0", "id": "curltest", "method": "createwallet", "params": ["${walletName}",false,true,"${walletPassword}"]}`
            });


            response.json().then(function (data) {
                console.log(data);
                return res.status(response.status).json({ 'createwallet': data })

            });
            // setWalletSeed(walletName, seed);
        }
    }

};
const getWalletInfo = async (req, res) => {
    console.log("Get wallet info handler called")
    const walletName = req.body;
    const name = walletName.walletName
    console.log(name);

    let response = await fetch(`http://127.0.0.1:8332/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getwalletinfo", "params": []}`
    });

    response.json().then(function (data) {
        console.log(data);
        return res.status(response.status).json({ 'getwalletinfo': data })

    });
}

const setWalletSeed = async (req,res) => {
    console.log("Set wallet seed handler called")
    const params = req.body;
    const walletName = params.walletName
    const seed = params.seed

    console.log(walletName);
    console.log(seed);
    //generate wifKey
    const wifKey = genarateWifkey(seed);
    //set wallet seed
    console.log('Set wallet seed.')
    let response = await fetch(`http://127.0.0.1:8332/wallet/${walletName}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "sethdseed", "params": [true ,"${wifKey}"]}`
    });

    response.json().then(function (data) {
        console.log("sethdseed" + data);
        return res.status(response.status).json({ 'sethdseed': data })

    });
}

const getNewAddress = async (req, res) => {
    console.log("Get new address handler called")
    const walletName = req.body;
    const name = walletName.walletName

    let response = await fetch(`http://127.0.0.1:8332/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getnewaddress", "params": []}`
    });

    response.json().then(function (data) {
        console.log(data.result);
        return res.status(response.status).json({ 'walletAddress': data.result })

    });
    
    // return res.status(200).json({ 'walletAddress': "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" })

}

const dumpWallet = async (req, res) => {
    console.log("Get dump wallet handler called")
    const params = req.body;
    const name = params.walletName
    console.log(name);

    const walletDatabaseDir = `/home/jk/.bitcoin/wallets/${name}`

    let response = await fetch(`http://127.0.0.1:8332/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "dumpwallet", "params": ["${walletDatabaseDir}"]}`
    });

    response.json().then(function (data) {
        console.log(data);
        return res.status(response.status).json({ 'dumpWallet': data })

    });
}

function genarateWifkey(seed) {
    console.log("genarate hmac")
    const msg = seed;
    const key = "";
    const hmac = crypto.createHmac("sha512", key)
    const private_key_chain_code = hmac.update(msg).digest('hex');
    console.log(private_key_chain_code)
    const private_key = private_key_chain_code.slice(0, private_key_chain_code.length / 2);
    console.log(private_key)
    const extended = "80" + private_key + "01";
    //In Bitcoin, checksums are created by hashing data through SHA256 twice,
    // and then taking the first 4 bytes of the result:
    console.log('extended: ' + extended);
    const firstHash = crypto.createHash('sha256').update(hexStringToByteArray(extended)).digest('hex');
    console.log("firstHash: " + firstHash)
    const secondHash = crypto.createHash('sha256').update(hexStringToByteArray(firstHash)).digest('hex');
    console.log("secondHash: " + secondHash)
    const btcChecksum = secondHash.substring(0, 8);
    console.log("checksum: " + btcChecksum);
    const extendedCheksum = extended + btcChecksum;
    console.log("extendechecksum: " + extendedCheksum);
    wifKey = bs58.encode(Buffer.from(extendedCheksum, 'hex'));
    console.log(wifKey);
    return (wifKey);
}
function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw "Must have an even number of hex digits to convert to bytes";
    }/* w w w.  jav  a2 s .  c o  m*/
    var numBytes = hexString.length / 2;
    var byteArray = new Uint8Array(numBytes);
    for (var i = 0; i < numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return byteArray;
}

module.exports = {
    createMnemonic,
    createWalletSeed,
    createWallet,
    setWalletSeed,
    getWalletInfo,
    getNewAddress,
    dumpWallet
}



