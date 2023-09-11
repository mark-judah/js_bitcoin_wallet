const bip39 = require("bip39")
const crypto = require("crypto");
const bs58 = require('bs58');
const fs = require('fs')
const { MongoClient } = require('mongodb');
const sendBtc = require("../helpers/sendBtcUssd");

const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.0';
const client = new MongoClient(url)
const dbName = 'walletDB';

const mainnet = '8332';
const testnet = '18332';

const ussdEntry = async function (req, res) {
    console.log("USSD handler called")
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    console.log(text)

    let response = '';
    let regexExp=new RegExp("^[a-zA-Z0-9_.-]*$")
    if (text == '') {
        response = `CON Welcome to Blah Wallet 
        1. Create account
        2. Send BTC
        3. Check balance
        4. Account details
        5. Get statement`;
    } 
     else if (text == '1') {
        const result = await createAccount(phoneNumber)
        response = result;
    } 
    else if (text == '2') {
        response = `CON Enter the recipients btc address`
     } 
     else if (text.substring(0,2)=='2*') {
        console.log(text)
        if((text.split("*").length - 1)==1){
            response = `CON Enter the amount to send in BTC`
        }
        if((text.split("*").length - 1)==2){
        var recipientsAddress=text.split("*")[1];
        var sendAmount=text.split("*")[2]
        
        console.log(recipientsAddress)
        console.log(sendAmount)

        const x = await sendBtc.createRawTransaction(phoneNumber,recipientsAddress,sendAmount)
        
        response = x
        }
        
    }
    else if (text == '3') {
        const balance = await getBalance(phoneNumber)
        response = `END Wallet Balance: ${balance} BTC`;
    } 
    else if (text == '4') { 
      const walletAddress = await getAccountDetails(phoneNumber)
        response = `END Wallet Address: ${walletAddress}`

    } 
    else if (text == '5') {

    }

    res.set('Content-Type: text/plain');
    res.send(response);
}

async function createAccount(phoneNumber) {

    //create wallet mnemonic and seed phrase
    const entropy = 224
    const mnemonic = bip39.generateMnemonic(entropy)
    console.log(console.log(bip39.validateMnemonic(mnemonic)))
    const seed = await bip39.mnemonicToSeed(mnemonic).then(bytes => bytes.toString('hex'))
    console.log(seed)

    //create wallet
    const walletDatabaseDir = `/home/jk/.bitcoin/testnet3/wallets/${phoneNumber}`
    //check if wallet folder already exists
    console.log(walletDatabaseDir)
    if (fs.existsSync(walletDatabaseDir)) {
        console.log('Directory exists!')
        return 'END Your phone number is already registered.'

    } else {
        console.log('Directory not found.')
        let response = await fetch(`http://127.0.0.1:${testnet}`, {
            method: 'POST',
            headers: {
                'content-type': 'text/plain;',
                'Authorization': 'Basic ' + btoa('kimuts:123456')
            },
            body: `{"jsonrpc": "1.0", "id": "curltest", "method": "createwallet", "params": ["${phoneNumber}",false,true]}`
        });

        let x = response.json().then(function (data) {
            console.log(data);
            return data
        });

        try {
            const value = await x;
            console.log("value: "+value.result)
            return await setWalletSeed(value.result.name, seed)
        } catch (err) {
            console.log(err);

        }
    }

}
async function setWalletSeed(walletName, walletSeed) {
    console.log(walletName)
    console.log(walletSeed)
    const wifKey = genarateWifkey(walletSeed);
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

    let x = response.json().then(function (data) {
        console.log("sethdseed" + data);
        return data
    });

    try {
        const value = await x;
        console.log(value)
        if (value.result == null) {
            return await createNewAddress(walletName)
        }

    } catch (err) {
        console.log(err);

    }
}
async function createNewAddress(walletName) {
    console.log("Get new address handler called")

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${walletName}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getnewaddress", "params": []}`
    });

    let x = response.json().then(function (data) {
        console.log(data.result);
        return data.result

    });

    try {
        const walletAddress = await x;
        console.log(walletAddress)
        const db = client.db(dbName);
        const collection = db.collection('walletAddresses');
        const insertResult = await collection.insertOne({
            "walletAddress": walletAddress,
            "walletName": walletName
        })
        console.log('Inserted document =>', insertResult);

        return 'END Your account has been created successfuly, check your account details in the main menu'


    } catch (err) {
        console.log(err);

    }
}


async function getAccountDetails(phoneNumber) {
    console.log("Get account details")
    const db = client.db(dbName);
    const collection = db.collection('walletAddresses');
    const result = await collection.find({ walletName: phoneNumber }).toArray();
    console.log(result)
    try {
        const walletAddress = result[0].walletAddress
        console.log(walletAddress)
        return walletAddress
    } catch (err) {
        console.log(err);

    }

}

async function getBalance(phoneNumber) {
    if (loadWallet(phoneNumber)) {
        console.log("Get account balance")
        let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${phoneNumber}`, {
            method: 'POST',
            headers: {
                'content-type': 'text/plain;',
                'Authorization': 'Basic ' + btoa('kimuts:123456')
            },
            body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getbalances", "params": []}`
        });

        let x=response.json().then(function (data) {
            console.log(data);
            return data

        });
        try {
            const y = await x
            const balance= y.result.mine.trusted
            console.log(balance)
            return balance
        } catch (err) {
            console.log(err);

        }
    }
}

const loadWallet = async (name) => {
    console.log("Load wallet info handler called")

    console.log(name);

    let response = await fetch(`http://127.0.0.1:${testnet}/`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "loadwallet", "params": ["${name}"]}`
    });

    let x = response.json().then(function (data) {
        console.log(data);
        return data
    });

    try {
        const y = await x
        const z=y.result.name
        if (z == phoneNumber) {
            return true
        }
    } catch (err) {
        console.log(err);

    }
}

async function connectToDB() {
    await client.connect()
    console.log('Connected successfully to mongodb server');

}











connectToDB()
    .then(console.log)
    .catch(console.error)

function genarateWifkey(seed) {
    console.log("genarate hmac")
    const msg = seed;
    const key = "";
    const hmac = crypto.createHmac("sha512", key)
    const private_key_chain_code = hmac.update(msg).digest('hex');
    console.log(private_key_chain_code)
    const private_key = private_key_chain_code.slice(0, private_key_chain_code.length / 2);
    console.log(private_key)
    //todo:make dynamic-> mainet 80 testnet->EF
    // const extended = "80" + private_key + "01";
    const extended = "EF" + private_key + "01";
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
    ussdEntry
}