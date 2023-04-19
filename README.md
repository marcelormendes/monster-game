# MONSTER GAME

![MonsterGameIcon](https://gateway.pinata.cloud/ipfs/QmNwqqGG4NF1rvmwXkCa5pA7NUhVrHaYVehf13R6a1CYah)

## Requirements

- YARN
- TRUFFLE
- GANACHE
- MUMBAI-TESTNET

## Installation

1. Install truffle

```bash
npm install truffle -g
```

2. Setup repo

3. Install dependencies by running:

```bash
yarn add
```

## Test Classes

```bash
truffle test
```

## Deploy

After initiate ganache on your local system, execute those commands below:

```bash
truffle compile
```

```bash
truffle migrate
```

You can also run:

```bash
truffle migrate --network matic
```

If you want to deploy to mumbai-testnet

### Scripts

This project contain any scripts that can help you to test the process, follow bellow the explanation of each of them:

fund-contract.js -> this script is responsible to fund the MonsterGame Contract with 5000000000000000000 LINK TOKEN

```bash
truffle exec ./scripts/fund-contract.js
```

mint-monster.js -> this script is exclusive for those that are running the project via Ganache Local, so after you Mint a Monster on frontend, get the requestId hash on console.log and run that script passing on first argument the requestId hash and second argument a random number.

```bash
truffle exec ./scripts/mint-monster.js 0x5274beb803f4198a24a3ed0f362321cf628284da463cc2403d18577367248e3f 11
```

set-contract-properties -> this script is responsible to update some parameters on the MonsterGame contract, for now we are just using to update mint price(first argument) and monster total(second argument), but in the future there will be updates to use all functions available from MonsterGame Contract

```bash
truffle exec ./scripts/set-contract-properties.js 15 5
```
