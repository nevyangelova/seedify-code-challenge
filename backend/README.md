# Seedify Code challenge bonus backend

Added support for multiple voting rounds by updating the Solidity contract.

Added a listener function to simulate saving votes, wallets, and selected candidates to a database using lowdb.

## Changes Made

### Updated Database Logging

Added logging of database entries after each vote is cast. Now, when a simulated vote is successfully cast, the updated database entry will be logged in the console for demonstration purposes.

### API Route for Voting

A new API route has been added to handle simulated vote submissions. This simulation does not interact with the actual smart contract but demonstrates how votes could be processed and saved. You can submit simulated votes to the `/vote-cast` endpoint using a POST request with the following JSON payload:

```json
{
    "round": 1,
    "voter": "0x123456789abcdef",
    "candidateId": 1,
    "voteCount": 1
}
```

### How to Run

Clone the repository to your local machine.

Install the required dependencies using npm. You need to use Node v17 or higher:

```Copy code
npm install
nvm use 17
node src/index.js
```

The server will start, and you will see a message indicating that it's running on http://localhost:3001. After your server has started you can test the simulation with the following CURL request:

```
curl -X POST -H "Content-Type: application/json" -d '{
    "round": 1,
    "voter": "0x123456789abcdef",
    "candidateId": 1,
    "voteCount": 1
}' http://localhost:3001/vote-cast
```

### Hardhat for deployment and smart contract

The app uses Hardhat to deploy and test the smart contract. Here's how to set it up:
Make sure you have Hardhat installed globally. If not, install it using npm:

```
npm install -g hardhat
cd contracts
npx hardhat compile
```

Deploy the smart contract to a local development network:

```
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

The smart contract will be deployed to the local network.

Run tests for the smart contract:

```
npx hardhat test
```

That's it! You have successfully deployed the smart contract and tested it using Hardhat.

Note: The Node.js API in this project is a simulation for illustrative purposes only and does not interact with the deployed smart contract. The smart contract is tested separately using Hardhat's unit testing capabilities.

This documentation provides clear instructions on how to run the Voting App, as well as how to set up and test the smart contract using Hardhat.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
