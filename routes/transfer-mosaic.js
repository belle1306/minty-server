const express = require('express');
const router = express.Router();
const symbol_sdk_1 = require('symbol-sdk');

router.post('/', async function (req, res) {

  
  const nodeUrl = 'http://api-01.us-east-1.testnet.symboldev.network:3000';
  const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);

  const epochAdjustment = await repositoryFactory
    .getEpochAdjustment()
    .toPromise();

  const networkType = symbol_sdk_1.NetworkType.TEST_NET;
  const rawAddress = req.body.address;
  const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(
    rawAddress,
  );

  const transferTransaction = symbol_sdk_1.TransferTransaction.create(
    symbol_sdk_1.Deadline.create(epochAdjustment),
    recipientAddress,
    /* start block 01 */
    //symbol_sdk_1.UInt64.fromUint(1000000)
    [
      new symbol_sdk_1.Mosaic(
        new symbol_sdk_1.MosaicId(req.body.mosaic_id),
        //This needs to be always 1 to send 1 NFT card object

        symbol_sdk_1.UInt64.fromUint(1)
      )
    ],
    /* end block 01 */
    symbol_sdk_1.PlainMessage.create('Enjoy your new NFT!'),
    networkType,
    symbol_sdk_1.UInt64.fromUint(2000000),
  );
  console.log(transferTransaction);


  // replace with sender private key
  const privateKey =
    req.body.key;

  const networkGenerationHash =
    '45FBCF2F0EA36EFA7923C9BC923D6503169651F7FA4EFC46A8EAF5AE09057EBD';

  const account = symbol_sdk_1.Account.createFromPrivateKey(
    privateKey,
    networkType,
  );
  const signedTransaction = account.sign(
    transferTransaction,
    networkGenerationHash,
  );

  const transactionRepository = repositoryFactory.createTransactionRepository();
  try {
    const response = await transactionRepository
      .announce(signedTransaction)
      .toPromise();
    console.log(response);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }






});

module.exports = router;
