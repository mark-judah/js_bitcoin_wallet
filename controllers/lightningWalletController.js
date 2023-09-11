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

    console.log(walletAlias)
    const port = await findFreePort()

    var network = 'network=testnet'
    var alias = `alias=${walletAlias}`
    var rgb = 'rgb=000000'
    var bitcoin_rpcuser = 'bitcoin-rpcuser=kimuts'
    var bitcoin_rpcpassword = 'bitcoin-rpcpassword=123456'
    var bitcoin_rpcconnect = 'bitcoin-rpcconnect=127.0.0.1'
    var bitcoin_rpcport = 'bitcoin-rpcport=18332'
    var bitcoin_cli = 'bitcoin-cli=/bin/bitcoin-cli'
    var bitcoin_datadir = `bitcoin-datadir=/home/jk/.lightning/testnet/dirs/${walletAlias}`
    var announce_addr = '#announce-addr='
    var lightning_dir = `lightning-dir=/home/jk/.lightning/testnet/dirs/${walletAlias}`
    var rpc_file = `rpc-file=/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`
    var rpc_file_mode = 'rpc-file-mode=0600'
    var log_file = 'log-file=/home/jk/.lightning/lightning.log'
    var log_level = 'log-level=debug'
    var bind_addr = `bind-addr=0.0.0.0:${port}`

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
    ${bind_addr}\n`

    const homedir = require('os').homedir();

    try {
        //if folder doesn't exist, create one
        if (!file_system.existsSync(path.join(homedir, '/.lightning/'))) {
            await file_system_promises.mkdir(path.join(homedir, '/.lightning/'))
        }
        await file_system_promises.appendFile(path.join(homedir, '/.lightning/testnet', `config-${walletAlias}`), config.replace(/ [ \r\n]+/gm, "\n").trim())
        return res.status(200).json('Config file created');
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
        return res.status(200).json('Instance loaded');
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

    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

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

const connectToNode = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    const id = params.id;
    const host = params.host;
    const port = params.port;

    lightningRpc = new LightningRpc(rpcFile)
    try {
        console.log("Connect to node handler called");

        const response = await lightningRpc.connect(id, host, port);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error connecting to node:", error);
        return res.status(500).json({ error: "Failed to connect to node" });
    }
};

const listPeers = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;


    lightningRpc = new LightningRpc(rpcFile)
    try {
        console.log("List peers handler called");

        const response = await lightningRpc.listpeers();
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error listing peers: ", error);
        return res.status(500).json({ error: "Failed to list peers" });
    }
};

const listNodes = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    lightningRpc = new LightningRpc(rpcFile)

    try {
        console.log("List Nodes handler called");

        const params = req.body;
        // const nodeID = params.nodeID;

        // console.log(nodeID)

        const response = await lightningRpc.listnodes();
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error(`Error listing node: ${nodeID}:`, error);
        return res.status(500).json({ error: `Failed to list node: ${nodeID}` });
    }
};


const newAddress = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

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

const fundChannel = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    const id = params.id;
    const amount = params.amount;
    const feerate = params.feerate;
    const announce = params.announce;
    const minconf = params.minconf;
    const utxos = params.utxos;
    const push_msat = params.push_msat;
    const close_to = params.close_to;
    const request_amt = params.request_amt;
    const compact_lease = params.compact_lease;
    const reserve = params.reserve;


    lightningRpc = new LightningRpc(rpcFile)

    try {
        console.log("Fund channel handler called");
        const response = await lightningRpc.fundchannel(id, amount, feerate, announce, minconf,
            utxos, push_msat, close_to, request_amt, compact_lease);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error(`Error funding channel: ${nodeID}:`, error);
        return res.status(500).json({ error: `Failed to fund channel: ${nodeID}` });
    }
};

const listChannels = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    lightningRpc = new LightningRpc(rpcFile)
    try {
        console.log("List channels handler called");

        const response = await lightningRpc.listchannels();
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error listing channels:", error);
        return res.status(500).json({ error: "Failed to list channels" });
    }
};

const createInvoice = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    const amount_msat = params.amount_msat;
    const label = params.label;
    const description = params.description;
    const expiry = params.expiry;
    const fallbacks = params.fallbacks;
    const preimage = params.preimage;
    const cltv = params.cltv;
    const deschashonly = params.deschashonly;
    const exposeprivatechannels = params.exposeprivatechannels;

    lightningRpc = new LightningRpc(rpcFile)
    try {
        console.log("Create invoice handler called");

        const response = await lightningRpc.invoice(amount_msat, label, description, expiry, fallbacks,
            preimage, exposeprivatechannels, cltv, deschashonly);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error creating nvoice:", error);
        return res.status(500).json({ error: "Failed to create invoice" });
    }
};

const getRoute = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    const id = params.id;
    const amount_msat = params.amount_msat;
    const riskfactor = params.riskfactor;
    const cltv = params.cltv;
    const fromid = params.fromid;
    const fuzzpercent = params.fuzzpercent;
    const exclude = params.exclude;
    const maxhops = params.maxhops;


    lightningRpc = new LightningRpc(rpcFile)
    try {
        console.log("Get route handler called");

        const response = await lightningRpc.getroute(id, amount_msat, riskfactor, cltv, fromid,
            fuzzpercent, exclude, maxhops);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error getting route:", error);
        return res.status(500).json({ error: "Failed to get route" });
    }
};


const payInvoice = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    const bolt11 = params.bolt11;
    const amount_msat = params.amount_msat;
    const label = params.label;
    const riskfactor = params.riskfactor;
    const maxfeepercent = params.maxfeepercent;
    const retry_for = params.retry_for;
    const maxdelay = params.maxdelay;
    const exemptfee = params.exemptfee;
    const localinvreqid = params.localinvreqid;
    const exclude = params.exclude;
    const maxfee = params.maxfee;
    const description = params.description;

    lightningRpc = new LightningRpc(rpcFile)
    try {
        console.log("pay invoice handler called");

        const response = await lightningRpc.pay(bolt11, amount_msat, label, riskfactor,
            maxfeepercent, retry_for, maxdelay, exemptfee,
            localinvreqid, exclude, maxfee, description);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error paying nvoice:", error);
        return res.status(500).json({ error: "Failed to pay invoice" });
    }
};

const sendPay = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    const route = params.route;
    const payment_hash = params.payment_hash;
    const label = params.label;
    const amount_msat = params.amount_msat;
    const bolt11 = params.bolt11;
    const payment_secret = params.payment_secret;
    const partid = params.partid;
    const localinvreqid = params.localinvreqid;
    const groupid = params.groupid;
    const payment_metadata = params.payment_metadata;
    const description = params.description;


    lightningRpc = new LightningRpc(rpcFile)
    try {
        console.log("Send pay handler called");

        const response = await lightningRpc.sendpay(route, payment_hash, label, amount_msat,
            bolt11, payment_secret, partid, localinvreqid, groupid,
            payment_metadata, description);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error sending pay:", error);
        return res.status(500).json({ error: "Failed to send pay" });
    }
};

const getPayStatus = async (req, res) => {
    const params = req.body;

    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    lightningRpc = new LightningRpc(rpcFile)

    try {
        console.log("Get pay status handler called");

        const response = await lightningRpc.paystatus();
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error retrieving pay status  info:", error);
        return res.status(500).json({ error: "Failed to retrieve pay status info" });
    }
};

const listPays = async (req, res) => {
    const params = req.body;

    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    lightningRpc = new LightningRpc(rpcFile)

    try {
        console.log("List pays handler called");

        const response = await lightningRpc.listpays();
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error listing pays:", error);
        return res.status(500).json({ error: "Failed to list pays" });
    }
};

const waitSendPay = async (req, res) => {
    const params = req.body;

    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    const payment_hash = params.payment_hash;
    const timeout = params.timeout;
    const partid = params.partid;


    lightningRpc = new LightningRpc(rpcFile)

    try {
        console.log("Wait send pay status handler called");

        const response = await lightningRpc.waitsendpay(payment_hash, timeout, partid);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error sending pay:", error);
        return res.status(500).json({ error: "Failed to send pay" });
    }
};

const listFunds = async (req, res) => {
    const params = req.body;
    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

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

const closeChannel = async (req, res) => {
    const params = req.body;

    const walletAlias = params.walletAlias;
    const rpcFile = `/home/jk/.lightning/testnet/dirs/${walletAlias}/testnet/lightning-rpc`;

    const id = params.id;
    const unilateraltimeout = params.unilateraltimeout;
    const destination = params.destination;
    const fee_negotiation_step = params.fee_negotiation_step;
    const wrong_funding = params.wrong_funding;
    const force_lease_closed = params.force_lease_closed;
    const feerange = params.feerange;

    lightningRpc = new LightningRpc(rpcFile)

    try {
        console.log("Close channel handler called");

        const response = await lightningRpc.close(id,unilateraltimeout,destination
            ,fee_negotiation_step,wrong_funding,force_lease_closed, feerange);
        console.log(response);

        return res.json(JSON.parse(response));
    } catch (error) {
        console.error("Error closing channel:", error);
        return res.status(500).json({ error: "Failed to close channel" });
    }
}


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
    connectToNode,
    listPeers,
    getRoute,
    getNodeInfo,
    listNodes,
    newAddress,
    fundChannel,
    listChannels,
    createInvoice,
    payInvoice,
    sendPay,
    waitSendPay,
    getPayStatus,
    listPays,
    listFunds,
    closeChannel
}