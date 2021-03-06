var accounts;
var account;
var balance;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function log(message) {
  var log = document.getElementById("log");
  log.innerHTML += message + '<br/>';
};

function refreshBalance() {
  var contract = SolarChain.deployed();

  // ETH balance

  balance = web3.eth.getBalance(account);
  var balance_element = document.getElementById("balance");
  balance_element.innerHTML = web3.fromWei(balance, "finney");

  // ApolloCoin balance
  contract.getCoinAccount.call(account, {from: account}).then(function(value) {
    var balance_element = document.getElementById("coin");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting ETH balance; see log.");
  });

  // Energy balance
  contract.getEnergyAccount.call(account, {from: account}).then(function(value) {
    var balance_element = document.getElementById("energy");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting ETH balance; see log.");
  });

};

function buyEnergy() {
  var contract = SolarChain.deployed();

  var amount = parseInt(document.getElementById("amount").value);

  setStatus("Initiating transaction... (please wait)");

  contract.buyEnergy(amount, {from: account}).then(function() {
    setStatus("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

    setInterval(refreshBalance, 1000);

    // Setup contract event listeners

    contract = SolarChain.deployed();
    
    var energySale = contract.EnergySale({fromBlock: 'latest'});
    energySale.watch(function(error, result) {
      var amount = result.args.amount;
      var msg = "EnergySale " + amount + " from " + result.args.from;
      log(msg);
    });
  });
}
