import styled, {css} from 'styled-components';

export const DashboardContainer = styled.div`
    padding: 1rem;
    margin: auto;

    @media (max-width: 768px) {
        padding: 0.5rem;
    }
`;

export const TabContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const getActiveStyles = (active) => {
    if (active) {
        return css`
            color: var(--light-blue);
            border-color: var(--light-purple);
            box-shadow: 0 0 10px var(--light-purple);
        `;
    }

    return css`
        background-color: transparent;
        color: white;
        border-color: transparent;
    `;
};

export const TabButton = styled.button.withConfig({
    shouldForwardProp: (prop) => !['active'].includes(prop),
})`
    padding: 10px 20px;
    border: 2px solid;
    cursor: pointer;
    font-size: 1em;
    margin-right: 10px;
    transition: background-color 0.3s ease, color 0.3s ease,
        box-shadow 0.3s ease;
    border-radius: 8px;

    &:hover {
        background-color: var(--shadow-purple);
        box-shadow: 0 0 15px var(--light-purple), 0 0 25px var(--light-purple);
    }

    ${({active}) => getActiveStyles(active)}
`;

export const TabContent = styled.div`
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    min-height: 100px;
`;

export const InfoText = styled.p`
    font-size: 1rem;
    margin-bottom: 0.5rem;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const TxLink = styled.a`
    font-size: 0.8rem;
    text-decoration: underline;
    color: var(--light-pink);
    margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.p`
    color: #ff6b6b;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 1rem;
`;
