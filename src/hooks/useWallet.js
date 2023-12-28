import {useState, useEffect} from 'react';
import Web3 from 'web3';

export const useWallet = () => {
    const [accounts, setAccounts] = useState([]);
    const [web3, setWeb3] = useState(null);
    const [error, setError] = useState('');
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

    const SEPOLIA_CHAIN_ID = '0xaa36a7';

    const initializeWeb3 = () => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        return web3Instance;
    };

    const requestAccountAccess = async (web3Instance) => {
        // good thing i checked this otherwise newly connected accounts wouldn't get requested
        const accounts = await web3Instance.eth.requestAccounts();
        if (accounts.length === 0) {
            throw new Error(
                'No accounts found. Please ensure MetaMask is connected.'
            );
        }
        setAccounts(accounts);
    };

    const switchToSepolia = async (web3Instance) => {
        try {
            await web3Instance.currentProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: SEPOLIA_CHAIN_ID}],
            });
            setIsCorrectNetwork(true);
        } catch (switchError) {
            setError(`Could not switch to Sepolia: ${switchError.message}`);
            setIsCorrectNetwork(false);
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            setError('Please install MetaMask!');
            setIsCorrectNetwork(false);
            return;
        }

        try {
            const web3Instance = initializeWeb3();
            await requestAccountAccess(web3Instance);
            await switchToSepolia(web3Instance);
            setError('');
        } catch (error) {
            setError(`Connection error: ${error.message}`);
            setIsCorrectNetwork(false);
        }
    };

    const logout = () => {
        setAccounts([]);
        setIsCorrectNetwork(false);
        setWeb3(null);
    };

    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = (newAccounts) => {
                if (newAccounts.length === 0) {
                    setError('Please connect to MetaMask.');
                    setAccounts([]);
                } else {
                    setAccounts(newAccounts);
                    setError('');
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () =>
                window.ethereum.removeListener(
                    'accountsChanged',
                    handleAccountsChanged
                );
        }
    }, []);

    return {web3, accounts, connectWallet, error, logout, isCorrectNetwork};
};
