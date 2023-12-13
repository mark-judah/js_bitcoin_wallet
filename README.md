<!DOCTYPE html>
<html>

<body>

<h1>Bitcoin Core Testnet Setup</h1>
<p> The Node.js and Express backend connects to a local Bitcoin Core, running as a full testnet node. Using JSON-RPC calls, it handles tasks like creating wallets, managing seeds and addresses, checking transactions, and interacting with block explorers. This setup works  with a mobile app, letting users securely manage their crypto—creating wallets, checking balances, and making transactions</p>
<h2>Installing Bitcoin Core Testnet</h2>

<p>To set up Bitcoin Core running a full testnet node:</p>
<ol>
  <li>Download and install Bitcoin Core from the official website, this project use version 22.0.</li
 <p>For detailed instructions on installing and configuring Bitcoin Core, please refer to the following guide:</p>
<p><a href="https://medium.com/coinmonks/ultimate-guide-to-bitcoin-testnet-fullnode-setup-b83da1bb22e" target="_blank">Ultimate Guide to Bitcoin Testnet Fullnode Setup</a></p>

<p>This guide provides step-by-step instructions for setting up Bitcoin Core as a full testnet node. Following these instructions will help you prepare and run a full testnet node.</p>

  <li>Run Bitcoin Core with the following command to set up for testnet:</li>
  <pre><code>
  bitcoind -testnet -daemon
  </code></pre>
  <li>Wait for the blockchain to sync (this may take some time).</li>
</ol>

<h2>Node.js Backend Project Setup</h2>

<h3>Setting Up the Node.js Backend</h3>
<p>The Node.js backend links to the locally installed Bitcoin Core testnet and exposes the following API routes:</p>

<ul>
  <li>/createMnemonic</li>
  <li>/createWalletSeed</li>
  <li>/createWallet</li>
  <li>/setWalletSeed</li>
  <li>/getWalletInfo</li>
  <li>/loadWallet</li>
  <li>/getNewAddress</li>
  <li>/deriveReceivingAddress</li>
  <li>/getAddressInfo</li>
  <li>/getReceivedByAddress</li>
  <li>/listTransactions</li>
  <li>/listUnspentTransactions</li>
  <li>/createRawTransaction</li>
  <li>/signRawTransaction</li>
  <li>/dumpWallet</li>
  <li>/sendRawTransaction</li>
  <li>/getBalances</li>
  <li>/getTransaction</li>
  <li>/unloadWallet</li>
  <li>/dumpPrivKey</li>
  <li>/deriveChangeAddress</li>
  <li>/loadWalletRequest</li>
</ul>

<h3>Backend Setup Instructions</h3>
<ol>
  <li>Clone the Node.js backend repository.</li>
  <pre><code>
  git clone https://github.com/mark-judah/js_bitcoin_wallet.git
  </code></pre>
  <li>Install project dependencies:</li>
  <pre><code>
  cd js_bitcoin_wallet
  npm install
  </code></pre>
  <li>Set up environment variables for connecting to the Bitcoin Core testnet.</li>
  <li>Run the Node.js backend:</li>
  <pre><code>
  npm start
  </code></pre>
</ol>

<h2>API Usage</h2>
<p>The mobile client can make requests to the Node.js backend API routes to interact with the Bitcoin Core testnet as needed.</p>

<h2>Frontend Interaction</h2>
<p>The frontend client at <a href="https://github.com/mark-judah/flutter_btc_wallet" target="_blank">Flutter bitcoin Client App </a> makes requests to this backend for system interactions.</p>


</body>
</html>
