const createWallet=(network=mainnet)=>{
    

};
//A hierachical deterministic wallet can create multiple adresses from one private key
//it is usefull,since someone can know the total amount of bitcoin you have by 
//adding up previous transactions. A HD wallet allows you to use a wallet once and create another
//wallet linked to the same private key

const createHDWallet=(network=testnet)=>{
   
};

module.exports={
    createWallet,
    createHDWallet
}



