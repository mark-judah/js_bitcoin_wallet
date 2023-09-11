const mainnet = '8332';
const testnet = '18332';

async function createRawTransaction(phoneNumber, recipientsAddress, sndAmount) {
    var balance = await getBalance(phoneNumber)
    var x = await balance

    var sendAmount = Number(sndAmount)
    var minersFees = Number(0.00001);
    var transactionCost = Number(0.04) * sendAmount;
    var roundedtransactionCost = Number(transactionCost.toFixed(8))

    var totalCost = sendAmount + minersFees + roundedtransactionCost;
    console.log("totalInputsCost: ", totalCost);

    //todo: totalCost should always be less than the wallet balance
    if (x < totalCost) {
        return `END Your wallet balance is ${x} BTC, you need atleast ${totalCost} BTC to complete the transaction.`
    }



    var inputAmounts = Number(0.0);
    if (x < totalCost) {
        return `END Your wallet balance is ${x} BTC, you need atleast ${totalCost} BTC to complete the transaction.`
    } else {
        var recepientAddress = recipientsAddress;
        var transactionCostAddress = "tb1q4x37a8m8zy9maq36ftlayltlgku0zzuhkq6atg";
        //outputs should not be repeated for privacy reasons, create a new address for change
        var transactionChangeAddress = await getNewAddress(phoneNumber);

        var inputs = [];
        var outputs = [];

        var unspentTransactions = await listUnspentTransactions(phoneNumber)

        //sort unspent transactions by highest amount, to lower the input size,hence lowering the mining fee
        var sortedUnspentTransactions = [];
        var amounts = [];

        console.log('unspentTransactions.length:' +
            unspentTransactions.length);

        for (var i = Number(0); i < unspentTransactions.length; i++) {
            var amount = unspentTransactions[i]['amount'];
            amounts.push(amount);
        }
        amounts.sort((a, b) => b - a);

        var reversedAmounts = amounts.reverse();
        console.log(amounts);

        for (var i = Number(0); i < reversedAmounts.length; i++) {
            for (var j = Number(0); j < unspentTransactions.length; j++) {
                if (unspentTransactions[j]['amount'] == reversedAmounts[i]) {
                    sortedUnspentTransactions.push(unspentTransactions[i]);
                    break;
                }
            }
        }

        //todo if unspent transactions are equal to the amount being sent, the app will crash with the error
        //todo amount is out of range, to fix this, ensure that the mount being sent is not equal to the first
        //todo unspent transaction in the list of unspent transactions

        //todo confirm that the user can afford the minimum relay fee, miners fee and transaction cost before
        //initiating a transaction

        console.log(sortedUnspentTransactions.length);
        console.log(sortedUnspentTransactions);

        for (var i = Number(0); i < sortedUnspentTransactions.length; i++) {
            if (inputAmounts < totalCost) {
                inputAmounts = inputAmounts + unspentTransactions[i]['amount'];
                inputs.push({
                    "txid": `${unspentTransactions[i]['txid']}`,
                    "vout": unspentTransactions[i]['vout'],
                    "sequence": 1
                });
            } else {
                break;
            }
        }
    }
    console.log("totalInputs: " + inputs);
    console.log("totalInputs: " + inputs.length);

    var transactionChange = inputAmounts - totalCost;
    var roundedTransactionChange = transactionChange.toFixed(8);

    console.log("totalChange: " + roundedTransactionChange);

    outputs.push({ [`${recepientAddress}`]: sendAmount });
    outputs.push({ [`${transactionCostAddress}`]: roundedtransactionCost });
    outputs.push({ [`${transactionChangeAddress}`]: Number(roundedTransactionChange) });

    var totaloutput = Number(amount) + Number(roundedTransactionChange) +
        Number(roundedtransactionCost);

    console.log("totalsendAmount: " + sendAmount);
    console.log("totaloutput: " + totaloutput);

    console.log("inputs: " + JSON.stringify(inputs));
    console.log("outputs: " + JSON.stringify(outputs));


    const JSinputs = JSON.stringify(inputs)
    const JSoutputs = JSON.stringify(outputs)

    let response = await fetch(`http://127.0.0.1:${testnet}/`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "createrawtransaction", "params": [${JSinputs},${JSoutputs}]}`

    });

    var x = response.json().then(function (data) {
        console.log(data)
        return data
    });

    try {
        const y = await x
        return await signRawTransaction(phoneNumber, y.result)

    } catch (err) {
        console.log(err);

    }

}

const signRawTransaction = async (phoneNumber, transactionHexString) => {
    console.log("Sign raw transaction")

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${phoneNumber}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "signrawtransactionwithwallet", "params": ["${transactionHexString}"]}`

    });

    var x = response.json().then(function (data) {
        return data
    });

    try {
        const y = await x
        console.log(y)
        return await sendRawTransaction(y.result.hex)

    } catch (err) {
        console.log(err);
    }
}

const sendRawTransaction = async (signedTransactionHexString) => {
    console.log("Send raw transaction")

    console.log(signedTransactionHexString)



    let response = await fetch(`http://127.0.0.1:${testnet}/`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "sendrawtransaction", "params": ["${signedTransactionHexString}"]}`

    });

    var x = response.json().then(function (data) {
        return data

    });

    try {
        const y = await x
        console.log(y)
        return `END Your transaction has been completed succesfully, transaction id: ${y.result}`
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

        let x = response.json().then(function (data) {
            console.log(data);
            return data

        });
        try {
            const y = await x
            const balance = y.result.mine.trusted
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
        return true
    } catch (err) {
        console.log(err);

    }
}

const getNewAddress = async (phoneNumber) => {
    console.log("Get new address handler called")

    let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${phoneNumber}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },

        body: `{"jsonrpc": "1.0", "id": "curltest", "method": "getnewaddress", "params": []}`
    });

    var x = response.json().then(function (data) {
        console.log(data);
        return data
    });

    try {
        const y = await x
        console.log("#y"+y)
        const newAddress = y.result
        return newAddress
    } catch (err) {
        console.log(err);

    }


    // return res.status(200).json({ 'walletAddress': "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" })

}

const listUnspentTransactions = async (phoneNumber) => {
    if (loadWallet(phoneNumber)) {
        console.log("List unspent transactions")

        let response = await fetch(`http://127.0.0.1:${testnet}/wallet/${phoneNumber}`, {
            method: 'POST',
            headers: {
                'content-type': 'text/plain;',
                'Authorization': 'Basic ' + btoa('kimuts:123456')
            },

            body: `{"jsonrpc": "1.0", "id": "curltest", "method": "listunspent", "params": [0,9999999,[]]}`
        });

        var x = response.json().then(function (data) {
            console.log(data);
            return data
        });

        try {
            const y = await x
            console.log(y)
            return y.result
        } catch (err) {
            console.log(err);

        }
    }
}


module.exports = {
    createRawTransaction,
    signRawTransaction,
    sendRawTransaction
}