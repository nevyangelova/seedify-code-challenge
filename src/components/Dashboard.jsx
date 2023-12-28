import React, {useContext, useState, useEffect} from 'react';
import Web3Context from '../contexts/Web3Context';
import {
    DashboardContainer,
    InfoText,
    TabContainer,
    TabButton,
    TabContent,
    TxLink,
} from './Dashboard.root';

const Dashboard = () => {
    const EtherscanBaseUrl = 'https://sepolia.etherscan.io/tx/';
    const {web3, contract, accounts, fetchVoteTransactions} =
        useContext(Web3Context);
    const [hasVoted, setHasVoted] = useState(false);
    const [balance, setBalance] = useState('0');
    const [error, setError] = useState('');
    const [selectedTab, setSelectedTab] = useState('overview');
    const [voteTransactions, setVoteTransactions] = useState([]);

    useEffect(() => {
        const checkVotingStatus = async () => {
            if (contract && accounts.length > 0) {
                try {
                    const status = await contract.methods
                        .voters(accounts[0])
                        .call();
                    setHasVoted(status);
                } catch (err) {
                    setError('Failed to check voting status');
                }
            }
        };

        const fetchBalance = async () => {
            if (web3 && accounts.length > 0) {
                try {
                    const balance = await web3.eth.getBalance(accounts[0]);
                    setBalance(web3.utils.fromWei(balance, 'ether'));
                } catch (err) {
                    setError('Failed to fetch balance');
                }
            }
        };

        checkVotingStatus();
        fetchBalance();
    }, [web3, contract, accounts]);

    useEffect(() => {
        const updateVoteTransactions = async () => {
            try {
                const transactions = await fetchVoteTransactions(accounts[0]);
                setVoteTransactions(transactions);
            } catch (error) {
                setError('Error fetching vote transactions: ' + error.message);
            }
        };
        if (accounts.length > 0) {
            updateVoteTransactions();
        }
    }, [accounts, fetchVoteTransactions]);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <DashboardContainer>
            <TabContainer>
                <TabButton
                    onClick={() => handleTabChange('overview')}
                    active={selectedTab === 'overview'}
                >
                    Overview
                </TabButton>
                <TabButton
                    onClick={() => handleTabChange('voting-history')}
                    active={selectedTab === 'voting-history'}
                >
                    Voting History
                </TabButton>
            </TabContainer>
            <TabContent>
                {selectedTab === 'overview' && (
                    <>
                        <InfoText>Wallet Balance: {balance} ETH</InfoText>
                        {error && <div>{error}</div>}
                    </>
                )}
                {selectedTab === 'voting-history' && (
                    <>
                        <InfoText>
                            {hasVoted
                                ? 'You have voted in this round.'
                                : 'You have not voted yet.'}
                        </InfoText>
                        <ul style={{overflow: 'scroll'}}>
                            {voteTransactions.map((tx) => {
                                const etherscanUrl = `${EtherscanBaseUrl}${tx.hash}`;

                                return (
                                    <li key={tx.hash}>
                                        <TxLink
                                            href={etherscanUrl}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            {tx.hash}
                                        </TxLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </TabContent>
            {error && <div>{error}</div>}
        </DashboardContainer>
    );
};

export default Dashboard;
