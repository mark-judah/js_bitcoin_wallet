const mainnet='8332';
const testnet='18332';

const getBlockchainInfo = async (req, res) => {

    console.log("############")
    let response=await fetch(`http://127.0.0.1:${testnet}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: '{"jsonrpc": "1.0", "id":"curltest", "method": "getblockchaininfo", "params": [] }'
    });
    

    if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
            response.status);
        return await response.status;
    }else{
        response.json().then(function (data) {
            console.log(data);
            return  res.status(200).json({ 'getBlockchainInfo':data })
    
        });
    
    }
    
   
}

const getNetworkInfo = async (req, res) => {
    let response=await fetch(`http://127.0.0.1:${testnet}`, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;',
            'Authorization': 'Basic ' + btoa('kimuts:123456')
        },
        body: '{"jsonrpc": "1.0", "id":"curltest", "method": "getnetworkinfo", "params": [] }'
    });
    

    if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
            response.status);
        return await response.status;
    }else{
        response.json().then(function (data) {
            console.log(data);
            return  res.status(200).json({ 'getnetworkinfo':data })
    
        });
    
    }
    
   
}
module.exports = {
    getBlockchainInfo,
    getNetworkInfo
}
