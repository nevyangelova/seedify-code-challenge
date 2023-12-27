import React, {useContext, useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import Web3Context from '../contexts/Web3Context';
import {
    HeaderContainer,
    Logo,
    WalletButton,
    WalletAddress,
    Spinner,
    DropdownContent,
    DropdownButton,
    DropdownIcon,
} from './Header.root';

const Header = () => {
    const {accounts, connectWallet, logout, loggedIn} =
        useContext(Web3Context);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConnectWalletClick = async () => {
        setLoading(true);
        try {
            await connectWallet();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let timeout;
        if (loading) {
            // Set a timeout to reset loading if wallet connection takes too long
            timeout = setTimeout(() => {
                setLoading(false);
            }, 5000);
        }

        return () => clearTimeout(timeout);
    }, [loading]);

    const truncateAddress = (address) => {
        const firstPart = address.substring(0, 6);

        const lastPart = address.substring(address.length - 5);

        return `${firstPart}...${lastPart}`;
    };

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    return (
        <HeaderContainer>
            <Logo>Nevy's App</Logo>
            {loading ? (
                <Spinner />
            ) : loggedIn ? (
                <div
                    style={{position: 'relative', cursor: 'pointer'}}
                    onClick={toggleDropdown}
                >
                    <WalletAddress>
                        {truncateAddress(accounts[0])}
                        <DropdownIcon up={showDropdown}>
                        <FontAwesomeIcon icon={faCaretDown} />
                        </DropdownIcon>
                    </WalletAddress>
                    {showDropdown && (
                        <DropdownContent show={showDropdown}>
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                        </DropdownContent>
                    )}
                </div>
            ) : (
                <WalletButton onClick={handleConnectWalletClick}>
                    Connect Wallet
                </WalletButton>
            )}
        </HeaderContainer>
    );
};

export default Header;
