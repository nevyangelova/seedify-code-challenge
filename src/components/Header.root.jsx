import styled, {keyframes} from 'styled-components';

const neonFlicker = keyframes`
  0% { opacity: 0.9; }
  5% { opacity: 1; }
  100% { opacity: 0.9; }
`;

export const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--dark-blue);
    color: var(--light-blue);
    padding: 15px 30px;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

export const Logo = styled.h1`
    font-size: 1.8em;
    margin: 0;
    text-shadow: 0 0 10px var(--light-blue), 0 0 20px (var--light-pink), 0 0 40px #fff;
    animation: ${neonFlicker} 1.5s infinite alternate;
`;

export const WalletButton = styled.button`
    color: white;
    border: 2px solid var(--light-purple);
    padding: 12px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    box-shadow: 0 0 10px var(--light-purple);
    transition: all 0.3s ease;

    &:hover {
        background-color: var(--shadow-purple);
        box-shadow: 0 0 15px var(--shadow-purple), 0 0 25px var(--shadow-purple);
    }
`;

export const WalletAddress = styled.p`
    background-color: var(--light-purple);
    box-shadow: 0 0 15px var(--shadow-purple), 0 0 25px var(--shadow-purple);
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
`;

export const DropdownButton = styled.button`
    background-color: #15092b;
    color: var(--light-purple);
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    text-align: left;
    display: block;
    width: 100%;
    &:hover {
        background-color: #222;
    }
`;

export const DropdownContent = styled.div`
    display: ${(props) => (props.show ? 'block' : 'none')};
    position: absolute;
    background-color: #222;
    width: 100%;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 5px;
    overflow: hidden;
`;

export const DropdownIcon = styled.span`
    margin-left: 10px;
    display: inline-block;
    transform: ${(props) => (props.up ? 'rotate(180deg)' : 'none')};
    transition: transform 0.3s;
`;

export const Spinner = styled.div`
    animation: spin 1s linear infinite;
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--dark-purple);
    border-radius: 50%;
    width: 30px;
    height: 30px;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
