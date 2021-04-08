const express = require('express');
const router = express.Router();
const symbol_sdk_1 = require('symbol-sdk');
const epochAdjustment = "1573430406";

router.post('/', function (req, res) {

  const networkType = symbol_sdk_1.NetworkType.TEST_NET;
  // replace with private key
  const privateKey = req.body.key;
  const account = symbol_sdk_1.Account.createFromPrivateKey(
    privateKey,
    networkType,
  );
  // replace with duration (in blocks)
  const duration = symbol_sdk_1.UInt64.fromUint(0);
  // replace with custom mosaic flags
  const isSupplyMutable = false;
  const isTransferable = true;
  const isRestrictable = false;
  // replace with custom divisibility
  const divisibility = 0;
  const nonce = symbol_sdk_1.MosaicNonce.createRandom();
  const mosaicDefinitionTransaction = symbol_sdk_1.MosaicDefinitionTransaction.create(
    symbol_sdk_1.Deadline.create(epochAdjustment),
    nonce,
    symbol_sdk_1.MosaicId.createFromNonce(nonce, account.address),
    symbol_sdk_1.MosaicFlags.create(
      isSupplyMutable,
      isTransferable,
      isRestrictable,
    ),
    divisibility,
    duration,
    networkType,
  );

  const delta = 1;
  const mosaicSupplyChangeTransaction = symbol_sdk_1.MosaicSupplyChangeTransaction.create(
    symbol_sdk_1.Deadline.create(epochAdjustment),
    mosaicDefinitionTransaction.mosaicId,
    symbol_sdk_1.MosaicSupplyChangeAction.Increase,
    symbol_sdk_1.UInt64.fromUint(delta * Math.pow(10, divisibility)),
    networkType,
  );

  const aggregateTransaction = symbol_sdk_1.AggregateTransaction.createComplete(
    symbol_sdk_1.Deadline.create(epochAdjustment),
    [
      mosaicDefinitionTransaction.toAggregate(account.publicAccount),
      mosaicSupplyChangeTransaction.toAggregate(account.publicAccount),
    ],
    networkType,
    [],
    symbol_sdk_1.UInt64.fromUint(2000000),
  );
  // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
  const networkGenerationHash =
    '45FBCF2F0EA36EFA7923C9BC923D6503169651F7FA4EFC46A8EAF5AE09057EBD';
  const signedTransaction = account.sign(
    aggregateTransaction,
    networkGenerationHash,
  );

  //console.log(signedTransaction);
  // replace with node endpoint
  const nodeUrl = 'http://api-01.us-east-1.testnet.symboldev.network:3000';
  const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
  const transactionHttp = repositoryFactory.createTransactionRepository();


  //Get mosaicId from mosaic create
  let obj = JSON.parse(JSON.stringify(mosaicSupplyChangeTransaction));
  let mosaicId = obj.transaction.mosaicId;
  console.log("NFT id: " + mosaicId);

  transactionHttp.announce(signedTransaction).subscribe(
    (x) => res.status(200).json({ id: mosaicId }),
    (err) => res.status(500).send(err),
  );

});

module.exports = router;
