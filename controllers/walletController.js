const fs = require('fs')
const bip39 = require("bip39")
const crypto = require("crypto");
const bs58 = require('bs58');
const EC = require('elliptic').ec
const hex = require('string-hex');
const base58 = require('bs58');
const mainnet = '8332';
const testnet = '18332';

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

    console.log(walletName);
    // const walletDatabaseDir = `/home/jk/.bitcoin/wallets/${walletName}`
    const walletDatabaseDir = `/home/jk/.bitcoin/testnet3/wallets/${walletName}`

    //check if wallet folder already exists
    console.log(walletDatabaseDir)
    if (fs.existsSync(walletDatabaseDir)) {
        console.log('Directory exists!')
        return res.status(409).json({ 'createwallet': 'The wallet already exists' })

    } else {
        console.log('Directory not found.')
        if (walletPassword == undefined) {
            //the password encrypts the wallet.dat file, this way, whoever hosts the node has no access 
            //if they steal 
            console.log("no password")

            let response = await fetch(`http://127.0.0.1:${testnet}`, {
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
        } else {

            let response = await fetch(`http://127.0.0.1:${testnet}`, {
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
        }
    }

};

const loadWalletRequest = async (req, res) => {
    console.log("Load wallet info handler called")
    const params = req.body;
    const walletName = params.walletName
    console.log(walletName);
    const walletDatabaseDir = `/home/jk/.bitcoin/testnet3/wallets/${walletName}`

    let response = await fetch(`http://127.0.0.1:${testnet}/`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "loadwallet", "params": ["${walletDatabaseDir}"]}`
    });

    response.json().then(function (data) {
        console.log(data);
        return res.status(response.status).json({ 'loadwallet': data })
    });


}


const unloadWallet = async (req, res) => {
    console.log("Unload wallet info handler called")
    const params = req.body;
    const walletName = params.walletName

    console.log(walletName);

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${walletName}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "unloadwallet", "params": ["${walletName}"]}`
    });

    response.json().then(function (data) {
        console.log(data);
        return res.status(response.status).json({ 'unloadwallet': data })

    });
}

const getWalletInfo = async (req, res) => {
    console.log("Get wallet info handler called")
    const walletName = req.body;
    const name = walletName.walletName
    console.log(name);
    if (loadWallet(name)) {

        let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
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
}

const setWalletSeed = async (req, res) => {
    console.log("Set wallet seed handler called")
    const params = req.body;
    const walletName = params.walletName
    const seed = params.seed

    console.log(walletName);
    console.log(seed);
    //generate wifKey
    const wifKey = generateKeys(seed)[5];
    //set wallet seed
    console.log('Set wallet seed.')
    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${walletName}`, {
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

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
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
const deriveReceivingAddress = async (req, res) => {
    console.log("Derive address handler called")
    const params = req.body;
    const name = params.walletName
    const seed = params.seedHex

    const masterPublicKey = generateKeys(seed)[3]
    const fingerPrint = getFingerPrint(masterPublicKey)
    console.log("Fingerprint: " + fingerPrint)

    const xPub = getxPub(masterPublicKey,seed);
    console.log("xPub: " + xPub)

    const xPriv = getxPriv(masterPublicKey,seed);
    console.log("xPriv: " + xPriv)

    const wifKey=generateKeys(seed)[5]

    const descriptor = `wpkh([${fingerPrint}/44/1/0/0]${xPub})`
    console.log("\n my descriptor: "+descriptor)
    const descriptorInfo = await getDescriptorInfo(name, descriptor)
    console.log("\n calulated descriptor: "+descriptorInfo)
    //cointype-> testnet 1, mainnet 0 ==> ${masterkey}/44h/1h or ${masterkey}/44h/0h
    if ((loadWallet(name))) {

        let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
            method: 'POST',
            headers: {
                'content-type': 'text/plain;',
                'Authorization': 'Basic ' + btoa('kimuts:123456')
            },

            body: `{"jsonrpc": "1.0", "id": "curltest", "method": "deriveaddresses", "params": ["${descriptorInfo}"]}`
        });

        response.json().then(async function (data) {
            console.log(data.result);
            console.log(data.error);
            if (data.result) {
                await importPrivatekey(name, generateKeys(seed)[5])
            }
            return res.status(response.status).json({ 
                'derivedAddress': data.result,
                'wifKey':wifKey
             })

        })
    }

}

const deriveChangeAddress = async (req, res) => {
    console.log("Derive change address handler called")
    const params = req.body;
    const name = params.walletName
    const seed = params.seedHex

    const masterPublicKey = generateKeys(seed)[3]
    const fingerPrint = getFingerPrint(masterPublicKey)
    console.log("Fingerprint: " + fingerPrint)

    const xPub = getxPub(masterPublicKey,seed);
    console.log("xPub: " + xPub)

    const xPriv = getxPriv(masterPublicKey,seed);
    console.log("xPriv: " + xPriv)

    const descriptor = `wpkh([${fingerPrint}/44/1/0/1]${xPub})`
    const descriptorInfo = await getDescriptorInfo(name, descriptor)
    //cointype-> testnet 1, mainnet 0 ==> ${masterkey}/44h/1h or ${masterkey}/44h/0h
    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "deriveaddresses", "params": ["${descriptorInfo}"]}`
    });

    response.json().then(async function (data) {
        console.log(data.result);
        console.log(data.error);
        if (data.result) {
            await importPrivatekey(name, generateKeys(seed)[5])
        }
        return res.status(response.status).json({ 'derivedChangeAddress': data.result })

    })
}

const getAddressInfo = async (req, res) => {
    console.log("Get address info handler called")
    const walletName = req.body;
    const name = walletName.walletName
    const walletAddress = req.body;
    const address = walletAddress.walletAddress
    console.log(address);

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getaddressinfo", "params": ["${address}"]}`
    });

    response.json().then(function (data) {
        console.log(data);
        return res.status(response.status).json({ 'getaddressinfo': data })

    });
}
const getBalances = async (req, res) => {
    console.log("Get balances handler called")
    const walletName = req.body;
    const name = walletName.walletName


    loadWallet(name)

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getbalances", "params": []}`
    });

    response.json().then(function (data) {
        console.log(data);
        return res.status(response.status).json({ 'getBalances': data })

    });

}
const getReceivedByAddress = async (req, res) => {
    console.log("Get received by address handler called")
    const walletName = req.body;
    const name = walletName.walletName

    const walletAddress = req.body;
    const address = walletAddress.walletAddress
    console.log(address);
    if (loadWallet(name)) {

        let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
            method: 'POST',
            headers: {
                'content-type': 'text/plain;',
                'Authorization': 'Basic ' + btoa('kimuts:123456')
            },
            body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getreceivedbyaddress", "params": ["${address}",0]}`
        });

        response.json().then(function (data) {
            console.log(data);
            return res.status(response.status).json({ 'getreceivedbyaddress': data })

        });
    }
}
const listTransactions = async (req, res) => {
    console.log("Get wallet transactions handler called")
    const params = req.body;
    const name = params.walletName
    console.log(name);

    if (loadWallet(name)) {

        let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
            method: 'POST',
            headers: {
                'content-type': 'text/plain;',
                'Authorization': 'Basic ' + btoa('kimuts:123456')
            },

            body: `{"jsonrpc": "1.0", "id": "curltest", "method": "listtransactions", "params": ["*"]}`
        });

        response.json().then(function (data) {
            console.log(data);
            return res.status(response.status).json({ data })

        });
    }
}
const listUnspentTransactions = async (req, res) => {
    console.log("Get unspent transactions handler called")
    const params = req.body;
    const address = params.walletAddress
    const name = params.walletName

    console.log(address);

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "listunspent", "params": [0,9999999,["${address}"]]}`
    });

    response.json().then(function (data) {
        console.log(data);
        return res.status(response.status).json({ data })

    });
}



const createRawTransaction = async (req, res) => {
    console.log("Create raw transaction handler called")
    const params = req.body;

    const inputs = JSON.stringify(params.inputs);
    const outputs = JSON.stringify(params.outputs);

    console.log(inputs)
    console.log(outputs)


    let response = await fetch(`http://127.0.0.1:${testnet}/`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "createrawtransaction", "params": [${inputs},${outputs}]}`

    });

    response.json().then(function (data) {
        return res.status(response.status).json({ data })

    });
}

const signRawTransaction = async (req, res) => {
    console.log("Sign raw transaction handler called")
    const params = req.body;

    const name = params.walletName
    const transactionHexString = params.transactionHexString;

    console.log(transactionHexString)



    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "signrawtransactionwithwallet", "params": ["${transactionHexString}"]}`

    });

    response.json().then(function (data) {
        return res.status(response.status).json({ data })

    });
}

const sendRawTransaction = async (req, res) => {
    console.log("Send raw transaction handler called")
    const params = req.body;

    const signedTransactionHexString = params.signedTransactionHexString;


    console.log(signedTransactionHexString)



    let response = await fetch(`http://127.0.0.1:${testnet}/`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "sendrawtransaction", "params": ["${signedTransactionHexString}"]}`

    });

    response.json().then(function (data) {
        return res.status(response.status).json({ data })

    });
}

const getTransaction = async (req, res) => {
    console.log("Get transaction handler called")
    const params = req.body;

    const txid = params.txid;
    const name = params.walletName

    console.log(txid)


    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "gettransaction", "params": ["${txid}"]}`

    });

    response.json().then(function (data) {
        return res.status(response.status).json({ data })

    });
}

const dumpWallet = async (req, res) => {
    console.log("Get dump wallet handler called")
    const params = req.body;
    const name = params.walletName
    console.log(name);


    const walletDatabaseDir = `/home/jk/.bitcoin/testnet3/wallets/${name}/dump-${name}`

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
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

const dumpPrivKey = async (req, res) => {
    console.log("Dump private key handler called")
    const params = req.body;
    const name = params.walletName
    const walletAddress = params.walletAddress

    console.log("Name: " + name + " Address: " + params.walletAddress);

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "dumpprivkey", "params": ["${walletAddress}"]}`
    });

    response.json().then(function (data) {
        console.log(data);
        return res.status(response.status).json({ 'dumpPrivKey': data })

    });
}
async function getDescriptorInfo(name, descriptor) {
    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getdescriptorinfo", "params": ["${descriptor}"]}`
    });

    let x = response.json().then(function (data) {
        //console.log("Descriptor info: " + JSON.stringify(data))
        return data.result.descriptor

    });

    try {
        const y = await x
        return y
    } catch (err) {
        console.log(err);

    }
}

async function importPrivatekey(name, xPriv) {
    console.log("importPrivatekey handler called")

    console.log("privKey: " + xPriv)
    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${name}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "importprivkey", "params": ["${xPriv}", "", false]}`
    });

    response.json().then(function (data) {
        console.log("Import priv key: " + data.result)
        console.log(data.error)
        return data

    })
}
async function loadWallet(name) {
    console.log("Load wallet handler called")

    console.log(name);
     const walletDatabaseDir = `/home/jk/.bitcoin/testnet3/wallets/${name.trim()}/wallet.dat`
     console.log(walletDatabaseDir);

    let response = await fetch(`http://127.0.0.1:${testnet}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "loadwallet", "params": ["${walletDatabaseDir}"]}`
    });

    response.json().then(function (data) {
        console.log(data);
        return data
    });


}
function generateKeys(seed) {
    console.log("Received seed: " + seed)
    console.log("genarate hmac")
    const key = "";
    const hmac = crypto.createHmac('sha512', Buffer.from(key))
    const extended_private_key = hmac.update(Buffer.from(seed, 'hex')).digest('hex');
    console.log("Extended Private Key: " + extended_private_key)
    const master_private_key = extended_private_key.slice(0, extended_private_key.length / 2);
    console.log("Master private key: " + master_private_key)
    const master_chain_code = extended_private_key.slice(extended_private_key.length / 2);
    console.log("Master chain code: " + master_chain_code)
    const master_public_key = getMasterPublicKey(master_private_key);
    console.log("Master public key: " + master_public_key)
    const extended_public_key = master_public_key + master_chain_code
    console.log("Extended public key: " + extended_public_key)

    //todo:make dynamic-> mainet 80 testnet->ef
    // const extended = "80" + private_key + "01";
    const extended = "ef" + master_private_key + "01";
    //In Bitcoin, checksums are created by hashing data through SHA256 twice,
    // and then taking the first 4 bytes of the result:
    console.log('extended: ' + extended);
    const btcChecksum = getCheckSum(extended);
    console.log("checksum: " + btcChecksum);
    const extendedCheksum = extended + btcChecksum;
    console.log("extendechecksum: " + extendedCheksum);
    const wifKey = bs58.encode(Buffer.from(extendedCheksum, 'hex'));
    console.log("WifKey: " + wifKey);
    return [extended_private_key, master_private_key, master_chain_code, master_public_key, extended_public_key, wifKey]
}

function getCheckSum(value) {
    const firstHash = crypto.createHash('sha256').update(Buffer.from(value, 'hex')).digest();
    console.log("firstHash: " + firstHash)
    const secondHash = crypto.createHash('sha256').update(firstHash).digest();
    console.log("secondHash: " + secondHash)
    const btcChecksum = secondHash.toString('hex').substring(0, 8);
    return btcChecksum
}

function getMasterPublicKey(master_private_key) {
    const ec = new EC('secp256k1')
    const master_private_key_bigInt = new Buffer.from(master_private_key, 'hex')

    const master_public_key_point = ec.g.mul(master_private_key_bigInt)
    const master_public_key_compressed = master_public_key_point.encode('hex', true);
    return master_public_key_compressed
}

function getFingerPrint(master_public_key) {
    const masterPublicKeyHash = crypto.createHash('sha256').update(Buffer.from(master_public_key, 'hex')).digest();
    const ripemd160Hash = crypto.createHash('ripemd160').update(masterPublicKeyHash).digest()
    const fingerPrint = ripemd160Hash.toString('hex').substring(0, 8);
    return fingerPrint
}

function getxPub(masterPublicKey,seed) {
    //private = 0x0488ade4 (xprv), public = 0x0488b21e (xpub)
    //private = 0x04358394 (tpriv) public=0x043587cf (tpub)
    const version = "043587cf"
    const depth = "01"
    const fingerPrint = getFingerPrint(masterPublicKey)
    const childNumber = "00000000"
    const chainCode = generateKeys(seed)[2]
    const key = generateKeys(seed)[3]
    const serialized = version + depth + fingerPrint + childNumber + chainCode + key
    const xPub = bs58.encode(Buffer.from(serialized + getCheckSum(serialized), 'hex'));
    return xPub
}

function getxPriv(masterPublicKey,seed) {
    //private = 0x0488ade4 (xprv), public = 0x0488b21e (xpub)
    //private = 0x04358394 (tpriv) public=0x043587cf (tpub)
    const version = "04358394"
    const depth = "01"
    const fingerPrint = getFingerPrint(masterPublicKey)
    const childNumber = "00000000"
    const chainCode = generateKeys(seed)[2]
    const key = "00" + generateKeys(seed)[1]
    const serialized = version + depth + fingerPrint + childNumber + chainCode + key
    const xPriv = bs58.encode(Buffer.from(serialized + getCheckSum(serialized), 'hex'));
    return xPriv
}

module.exports = {
    createMnemonic,
    createWalletSeed,
    createWallet,
    setWalletSeed,
    getWalletInfo,
    loadWalletRequest,
    unloadWallet,
    getNewAddress,
    deriveReceivingAddress,
    deriveChangeAddress,
    getAddressInfo,
    getBalances,
    getReceivedByAddress,
    listUnspentTransactions,
    listTransactions,
    createRawTransaction,
    signRawTransaction,
    sendRawTransaction,
    getTransaction,
    dumpWallet,
    dumpPrivKey
}



