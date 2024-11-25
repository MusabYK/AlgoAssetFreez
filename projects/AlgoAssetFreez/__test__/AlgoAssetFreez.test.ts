import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import {
  algos,
  getOrCreateKmdWalletAccount,
} from '@algorandfoundation/algokit-utils';
import { AlgoAssetFreezClient } from '../contracts/clients/AlgoAssetFreezClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: AlgoAssetFreezClient;

describe('AlgoAssetFreez', () => {
  beforeEach(fixture.beforeEach);

  let assetId: bigint|number;

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount } = fixture.context;
    const { algorand } = fixture;

    await getOrCreateKmdWalletAccount(
      { name: 'accountA', fundWith: algos(10) },
      algorand.client.algod,
      algorand.client.kmd
    );
    await getOrCreateKmdWalletAccount(
      { name: 'accountB', fundWith: algos(10) },
      algorand.client.algod,
      algorand.client.kmd
    );
    const accountA = await algorand.account.fromKmd('accountA');

    appClient = new AlgoAssetFreezClient(
      {
        sender: accountA,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );

    //Creat asset
    const assetCreated = await algorand.send.assetCreate({
      sender: accountA.addr,
      total: 10n, // minting total of 10 asset
      freeze: accountA.addr,// this is saying that the given addr i.e this AccountA can freez/unfreez asset of any account using/having the token
    });
    assetId = assetCreated.confirmation.assetIndex!

    await appClient.create.createApplication({});
  });

  test('OptIn accountB', async () => {
    const { algorand } = fixture;
    const accountB = await algorand.account.fromKmd('accountB');
    // optin accountB to the asset (assetId)
    await algorand.send.assetOptIn({
      assetId: BigInt(assetId),
      sender: accountB.addr,
    })
    console.log("accountB opted In ")
  });

  test('SendAndFreezAsset', async () => {
    const { algorand } = fixture;
    const accountA = await algorand.account.fromKmd('accountA');
    const accountB = await algorand.account.fromKmd('accountB');

    // Send asset transfer
    await algorand.send.assetTransfer({
      assetId: BigInt(assetId),
      sender: accountA.addr,
      receiver: accountB.addr,
      amount: 1n,
    }),
    console.log("Asset Transfered to accountB")
    // Freez the asset
    await algorand.send.assetFreeze({
      assetId: BigInt(assetId),
      sender: accountA.addr,
      account: accountB.addr,
      frozen: true,
    }),
    console.log("Asset is frozed in accountB")
    // check accountA asset balance
    const { balance: accountA_Balance } = await algorand.account.getAssetInformation(accountA.addr, assetId);
    expect(accountA_Balance).toBe(9n);
    console.log("accountA Asset balance = "+accountA_Balance)
    // check accountB asset balance
    const { balance: AccountB_Balance } = await algorand.account.getAssetInformation(accountB.addr, assetId);
    expect(AccountB_Balance).toBe(1n);
    console.log("accountB Asset balance = "+AccountB_Balance)
  });
});
