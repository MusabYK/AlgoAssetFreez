# DaoWakanda Freez Challenge
This is the AlgorandJavascript SDK that performs the following actions:
- Create two accounts, A & B
- Fund the two accounts with 10 algos each
- Using account A, create an Algorand Standard Asset (ASA)
- Opt account B into the new ASA
- Transfer 1 unit of the ASA from account A to account B
- Freeze the ASA in account B

## How to run it
1. Execute the tests defined in [./\_\_test\_\_](./__test__) by running test
2. run test in the contract folder terminal (AlgoAsset\projects\OwnershipTransfer>)

### Algokit

This template assumes you have a local network running on your machine. The easiet way to setup a local network is with [algokit](https://github.com/algorandfoundation/algokit-cli). If you don't have Algokit or its dependencies installed locally you can open this repository in a GitHub codespace via https://codespaces.new and choosing this repo.

### Build Contract

`npm run build` will compile the contract to TEAL and generate an ABI and appspec JSON in [./contracts/artifacts](./contracts/artifacts/) and a algokit TypeScript client in [./contracts/clients](./contracts/clients/).

`npm run compile-contract` or `npm run generate-client` can be used to compile the contract or generate the contract seperately.

### Run Tests

`npm run test` will execute the tests defined in [./\_\_test\_\_](./__test__)

### Lint

`npm run lint` will lint the contracts and tests with ESLint.
