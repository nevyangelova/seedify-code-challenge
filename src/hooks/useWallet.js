import {useState, useEffect} from 'react';
import Web3 from 'web3';

export const useWallet = () => {
    const [accounts, setAccounts] = useState([]);
    const [web3, setWeb3] = useState(null);
    const [error, setError] = useState('');
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

    const SEPOLIA_CHAIN_ID = '0xaa36a7';

    const switchToSepolia = async (web3Instance) => {
        try {
            await web3Instance.currentProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: SEPOLIA_CHAIN_ID}],
            });
            setIsCorrectNetwork(true);
        } catch (switchError) {
            setError('Could not switch to Sepolia:', switchError);
            setIsCorrectNetwork(false);
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const accounts = await web3Instance.eth.getAccounts();
                setAccounts(accounts);

                switchToSepolia(web3Instance);
            } catch (error) {
                setError(`Connection error: ${error.message}`);
                setIsCorrectNetwork(false);
            }
        } else {
            setError('Please install MetaMask!');
            setIsCorrectNetwork(false);
        }
    };

    const logout = () => {
        setAccounts([]);
        setIsCorrectNetwork(false);
    };

    useEffect(() => {
        connectWallet();

        if (window.ethereum) {
            const handleAccountsChanged = (accounts) => {
                // Update accounts state when the MetaMask accounts change
                if (accounts.length === 0) {
                    setError('Please connect to MetaMask.');
                    setAccounts([]);
                } else {
                    setAccounts(accounts);
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);

            // Cleanup function to remove listener
            return () =>
                window.ethereum.removeListener(
                    'accountsChanged',
                    handleAccountsChanged
                );
        }
    }, []);

    return {web3, accounts, connectWallet, error, logout, isCorrectNetwork};
};
