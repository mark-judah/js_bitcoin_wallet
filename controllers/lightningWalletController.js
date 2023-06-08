const LightningRpc = require('@jbaczuk/c-lightning-rpc');
const { response } = require('express');
const file_system = require("fs")
const file_system_promises = require("fs").promises;
const path = require("path");
const { spawn } = require("child_process");
var tcpPortUsed = require('tcp-port-used');


const createConfig = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;

    const port = await findFreePort()

    var network = 'network=testnet'
    var alias = `alias=${walletAlias}`
    var rgb = 'rgb=000000'
    var bitcoin_rpcuser = 'bitcoin-rpcuser=kimuts'
    var bitcoin_rpcpassword = 'bitcoin-rpcpassword=123456'
    var bitcoin_rpcconnect = 'bitcoin-rpcconnect=127.0.0.1'
    var bitcoin_rpcport = 'bitcoin-rpcport=18332'
    var bitcoin_cli = 'bitcoin-rpcport=18332'
    var bitcoin_datadir = `bitcoin-datadir=/home/jk/.lightning/testnet/dirs/${walletAlias}`
    var announce_addr = '#announce-addr='
    var lightning_dir = `lightning-dir=/home/jk/.lightning/testnet/dirs/${walletAlias}`
    var rpc_file = `rpc-file=/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`
    var rpc_file_mode = 'rpc-file-mode=0600'
    var log_file = 'log-file=/home/jk/.lightning/lightning.log'
    var log_level = 'log-level=debug'
    var addr = `addr=127.0.0.1:${port}`

    const config = `
    ${network}\n
    ${alias}\n
    ${rgb}\n
    ${bitcoin_rpcuser}\n
    ${bitcoin_rpcpassword}\n
    ${bitcoin_rpcconnect}\n
    ${bitcoin_rpcport}\n
    ${bitcoin_cli}\n
    ${bitcoin_datadir}\n
    ${announce_addr}\n
    ${lightning_dir}\n
    ${rpc_file}\n
    ${rpc_file_mode}\n
    ${log_file}\n
    ${log_level}\n
    ${addr}\n`

    const homedir = require('os').homedir();

    try {
        //if folder doesn't exist, create one
        if (!file_system.existsSync(path.join(homedir, '/.lightning/'))) {
            await file_system_promises.mkdir(path.join(homedir, '/.lightning/'))
        }
        await file_system_promises.appendFile(path.join(homedir, '/.lightning/testnet', `config-${walletAlias}`), config.replace(/ [ \r\n]+/gm, "\n").trim())
        return res.json('Config file created');
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Failed to create config file" });
    }
};

const loadInstance = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;

    const ls = spawn("lightningd", [`--conf=/home/jk/.lightning/testnet/config-${walletAlias}`]);

    try {
        ls.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on("data", data => {
            console.log(`stderr: ${data}`);

        });

        ls.on('error', (error) => {
            console.log(`error: ${error.message}`);
            return res.json(`error: ${error.message}`);
        });

        ls.on("close", code => {
            console.log(`child process exited with code ${code}`);

        });
        return res.json('Instance loaded');
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Failed to load instance" });
    }

};
const killInstance = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;

    const homedir = require('os').homedir();

    var buffer = file_system.readFileSync(homedir + `/.lightning/testnet/dirs/${walletAlias}/lightningd-testnet.pid`);
    console.log(buffer.toString().trim());
    var pidInt = parseInt(buffer.toString().trim())
    try {
        process.kill(pidInt)
        return res.json("Process killed:" + buffer.toString().trim());
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Process is not runnnig" });
    }

}

const getNodeInfo = async (req, res) => {
    const params = req.body;
    const rpcFile = params.rpcFile;

    lightningRpc = new LightningRpc(rpcFile)

    try {
        console.log("Get node info handler called");

        const response = await lightningRpc.getinfo();
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error retrieving node info:", error);
        return res.status(500).json({ error: "Failed to retrieve node info" });
    }
};

const listNodes = async (req, res) => {
    const params = req.body;
    const rpcFile = params.rpcFile;

    lightningRpc = new LightningRpc(rpcFile)

    try {
        console.log("List Nodes handler called");

        const params = req.body;
        const nodeID = params.nodeID;

        console.log(nodeID)

        const response = await lightningRpc.listnodes(nodeID);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error(`Error listing node: ${nodeID}:`, error);
        return res.status(500).json({ error: `Failed to list node: ${nodeID}` });
    }
};


const newAddress = async (req, res) => {
    const params = req.body;
    const rpcFile = params.rpcFile;

    lightningRpc = new LightningRpc(rpcFile)

    var addresstype = '';


    if (params.network == 'mainnet') {
        addresstype = 'p2sh-segwit'
    } else {
        addresstype = 'bech32'
    }

    try {
        console.log("Get new lightning address handler called");

        const response = await lightningRpc.newaddr(addresstype);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error creating new address:", error);
        return res.status(500).json({ error: "Failed to create new address" });
    }
};

const listFunds = async (req, res) => {
    const params = req.body;
    const rpcFile = params.rpcFile;

    lightningRpc = new LightningRpc(rpcFile)
    try {
        console.log("List funds handler called");

        const response = await lightningRpc.listfunds();
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error listing funds:", error);
        return res.status(500).json({ error: "Failed to list funds" });
    }
};


async function findFreePort() {
    var freePort = 0

    for (let i = 19000; i >= 19000; i++) {
        var port = tcpPortUsed.check(i, '127.0.0.1')
            .then(function (inUse) {
                console.log(`Port ${port} usage: ` + inUse);
                return inUse
            })

        try {
            const value = await port;
            if (value) {
                console.log(`Port ${i} in use`)
            } else {
                freePort = i
                break
            }

        } catch (err) {
            console.log(err);
            break
        }
    }
    return freePort
}

module.exports = {
    createConfig,
    loadInstance,
    killInstance,
    getNodeInfo,
    listNodes,
    newAddress,
    listFunds

}