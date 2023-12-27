import {useState, useEffect, useCallback} from 'react';
import votingABI from '../contracts/voting.json';

const contractAddress = '0x9298B2E081E7F604028d75dF5d15155353612d4c';

export const useContract = (web3, accounts) => {
    const [contract, setContract] = useState(null);

    useEffect(() => {
        if (web3) {
            const contractInstance = new web3.eth.Contract(
                votingABI.abi,
                contractAddress
            );
            setContract(contractInstance);
        }
    }, [web3]);

    const fetchCandidates = useCallback(async () => {
        if (!contract) return [];
        const candidatesCount = await contract.methods.candidatesCount().call();
        const candidatesArray = [];
        for (let i = 0; i < candidatesCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            candidatesArray.push(candidate);
        }
        return candidatesArray;
    }, [contract]);

    const castVote = useCallback(
        async (candidateId) => {
            if (!contract || !accounts || accounts.length === 0) {
                throw new Error('No contract or account available');
            }
            await contract.methods.vote(candidateId).send({from: accounts[0]});
        },
        [contract, accounts]
    );

    const fetchVoteTransactions = async (accountAddress) => {
        const voteMethodSignature = web3.utils
            .sha3('vote(uint256)')
            .substring(0, 10);
        const sepoliaEtherscanApi = 'https://api-sepolia.etherscan.io/api';
        const apiKey = '86GCYN3DUW7JDQRGVHXRU4XM6U89F9GY2D';
        const url = `${sepoliaEtherscanApi}?module=account&action=txlist&address=${accountAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const transactions = data.result;
            return transactions.filter((tx) =>
                tx.input.startsWith(voteMethodSignature)
            );
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            return [];
        }
    };
    return {contract, fetchCandidates, castVote, fetchVoteTransactions};
};
