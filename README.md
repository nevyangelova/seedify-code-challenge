# Seedify Code challenge frontend

## Changes Made

-   Added Connect Wallet functionality: Click the "Connect Wallet" button to connect your wallet.

-   Added network detection and request to switch to Sepolia.

-   Added automatic address change handling.

-   Added vote casting functionality: After connecting your wallet, you can cast your vote for your preferred candidate.

-   The application displays real-time voting results on the Candidates page.

-   Simple tab dashboard to view your voting history and account balance.

### Getting Started

To run this application locally, follow these steps:

Install dependencies.

```
npm install
npm run dev
```

Open your web browser and visit http://127.0.0.1:5173/ to access the decentralized voting application.

### Unit tests

Check for edge cases using jest and react testing library

```
npm test
```

### Decisions

#### Code

Created custom hooks to encapsulate reusable logic. Optimize hooks usage for performance.
Avoid excessive context updates by memoizing values and using dependencies accordingly.
Using Context API I can pass web3 data through the component tree without having to pass props manually.
For this simple use case it might have been overdesigning but If I consider scalability then I recommend adding it.

Trade-offs: Placing it higher in the tree provides more accessibility but may cause unnecessary re-renders.

#### Testing

Using Jest for unit testing of the hooks.
Trade-offs: Unit tests are faster but may miss integration issues. Due to time limitations avoided adding snapshot tests.

### Styled components
I have chosen styled-components for this application as it gave me a little more space to be creative as opposed to the convenient
but somewhat rigid approach with Tailwind.

Trade-offs: Slight overhead and not reusable in this use case.

# Seedify Code Challenge

Challenge: Build a simple decentralized voting application using React.js with a smart contract already done

Description:
Your task is to build a simple decentralized voting application that allows users to cast their votes without the need for a central authority. A smart contract has already been created and deployed on a testnet. You will need to integrate this smart contract into your application and build the frontend and backend components.

Requirements:

1. The application should be built using React.js for the frontend.
2. The smart contract has already been created and deployed on sepolia network. You will need to integrate this contract into your application.
3. Users should be able to connect their wallets (MetaMask, for example) to the platform to cast their votes.
4. The application should display real-time voting results, including the number of votes for each candidate.
5. The application should have a dashboard for users to view their voting history and account balances.

Bonus:

1. Add support for multiple voting rounds.
2. Add listener function that saves the vote, wallet and selected candidate to a database (can be a backend implementation, firebase or lowdb)

    **Note: you need to change the smart contract to add Events**

Note: You are free to use any libraries or frameworks you see fit to complete the challenge.

Smart Contract deployed on sepolia network `0x9298B2E081E7F604028d75dF5d15155353612d4c`
