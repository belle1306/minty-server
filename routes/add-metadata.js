const express = require('express');
const router = express.Router();
const symbol_sdk_1 = require('symbol-sdk');
const epochAdjustment = "1573430406";

router.post('/', function (req, res) {

  console.log(req.body);
  var mosaic_id = req.body.mosaic_id;
  var key = req.body.key;
  var card_title = req.body.card_title;
  var description = req.body.description;
  var card_preview_ipfs_hash = req.body.card_preview_ipfs_hash;
  var card_texture_ipfs_hash = req.body.card_texture_ipfs_hash;

  var metadata = {};

  metadata['minty_card'] = true;
  metadata['card_title'] = card_title;
  metadata['description'] = description;
  metadata['card_id'] = mosaic_id;
  metadata['card_preview_ipfs_hash'] = card_preview_ipfs_hash;
  metadata['card_texture_ipfs_hash'] = card_texture_ipfs_hash;


  const networkType = symbol_sdk_1.NetworkType.TEST_NET;
  // replace with company private key
  const companyPrivateKey = key;
  const companyAccount = symbol_sdk_1.Account.createFromPrivateKey(
    companyPrivateKey,
    networkType,
  );

  // replace with mosaic id
  //Card title
  const mosaicId = new symbol_sdk_1.MosaicId(mosaic_id);
  const cardDataMetadataTransaction = symbol_sdk_1.MosaicMetadataTransaction.create(
    symbol_sdk_1.Deadline.create(epochAdjustment),
    companyAccount.address,
    symbol_sdk_1.KeyGenerator.generateUInt64Key('data'),
    mosaicId,
    JSON.stringify(metadata).length,
    JSON.stringify(metadata),
    networkType,
  );


  const aggregateTransaction = symbol_sdk_1.AggregateTransaction.createComplete(
    symbol_sdk_1.Deadline.create(epochAdjustment),
    [
      cardDataMetadataTransaction.toAggregate(companyAccount.publicAccount)
    ],
    networkType,
    [],
    symbol_sdk_1.UInt64.fromUint(2000000),
  );

  // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
  const networkGenerationHash =
    '45FBCF2F0EA36EFA7923C9BC923D6503169651F7FA4EFC46A8EAF5AE09057EBD';
  const signedTransaction = companyAccount.sign(
    aggregateTransaction,
    networkGenerationHash,
  );

  // replace with node endpoint
  const nodeUrl = 'http://api-01.us-east-1.testnet.symboldev.network:3000';
  const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
  const transactionHttp = repositoryFactory.createTransactionRepository();
  transactionHttp.announce(signedTransaction).subscribe(
    (x) => res.status(200).send(x),
    (err) => res.status(500).send(err),
  );


});

module.exports = router;
