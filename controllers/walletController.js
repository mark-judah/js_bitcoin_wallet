const { PrivateKey }=require("bitcore-lib");

const{mainnet,testnet}=require("bitcore-lib/lib/networks");
const Mnemonic=require("bitcore-mnemonic");

const createWallet=(network=mainnet)=>{
    var privateKey=new PrivateKey();
    //toAddress() by default uses the mainnet, to use the testnet pass the const testnet as a param
    //you can also pass "testnet" in quotes
    //you can also pass network, to allow the user to choose the network
    var address=privateKey.toAddress(network);

    return{
        privateKey:privateKey.toString(),
        address:address.toString(),
    };

};
//A hierachical deterministic wallet can create multiple adresses from one private key
//it is usefull,since someone can know the total amount of bitcoin you have by 
//adding up previous transactions. A HD wallet allows you to use a wallet once and create another
//wallet linked to the same private key

const createHDWallet=(network=testnet)=>{
    let passphrase=new Mnemonic(Mnemonic.Words.ENGLISH);
    let extended_private_key=passphrase.toHDPrivateKey(passphrase.toString(),network)

    return{
        extended_public_key:extended_private_key.privateKey.toString(),
        privateKey:extended_private_key.privateKey.toString(),
        address:extended_private_key.publicKey.toAddress().toString(),
        mnemonic:passphrase.toString()
        
    };

};

module.exports={
    createWallet,
    createHDWallet
}



