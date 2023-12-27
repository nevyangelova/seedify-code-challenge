import React, {createContext, useState} from 'react';
import {useWallet} from '../hooks/useWallet';
import {useContract} from '../hooks/useContract';

const Web3Context = createContext();

export const Web3Provider = ({children}) => {
    const [message, setMessage] = useState({type: '', content: ''});
    const {
        web3,
        accounts,
        connectWallet,
        error: walletError,
        logout,
        isCorrectNetwork,
    } = useWallet();
    const {contract, fetchCandidates, castVote, fetchVoteTransactions} =
        useContract(web3, accounts);

    const contextValue = {
        web3,
        accounts,
        contract,
        fetchCandidates,
        castVote,
        connectWallet,
        loggedIn: accounts && accounts.length > 0 && isCorrectNetwork,
        logout,
        message,
        setMessage,
        walletError,
        fetchVoteTransactions,
    };

    return (
        <Web3Context.Provider value={contextValue}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3Context;
