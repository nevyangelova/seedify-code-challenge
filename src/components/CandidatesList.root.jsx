import styled from 'styled-components';

export const CandidatesContainer = styled.div`
    margin: 1rem auto;
    background-color: var(--dark-blue);
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 0 20px #0ff, 0 0 30px #f0f;
`;

export const Title = styled.h2`
    font-size: 2.5rem;
    color: var(--light-blue);
    margin-bottom: 2rem;
    text-align: center;
    text-shadow: 0 0 20px var(--light-blue);
`;

export const CandidatesGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
        justify-content: center;
    }
`;

export const CandidateCard = styled.div`
    border: 2px solid var(--light-blue);
    border-radius: 10px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 15px #0ff, 0 0 20px var(--light-pink);
    margin-bottom: 20px;
`;

export const CandidatePhoto = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid var(--dark-pink);
    margin-bottom: 1rem;
`;

export const CandidateName = styled.h3`
    font-size: 1.75rem;
    color: #ddd;
    margin-bottom: 1rem;
`;

export const VoteCount = styled.span`
    color: white;
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    box-shadow: inset -9px 0px 31px var(--light-purple);
    border: solid 8px #eee;
    border-bottom-color: var(--shadow-purple);
    border-left-color: transparent;
    border-radius: 4px;
    border-right-color: var(--light-blue);
    border-top-color: transparent;
`;

export const VoteButton = styled.button`
    background: linear-gradient(
        45deg,
        var(--dark-pink),
        var(--light-blue)
    );
    color: white;
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1.25rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.3s;
    &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 10px var(--light-blue), 0 0 20px var(--light-pink)
    }
`;

export const MessageText = styled.div`
    color: ${(props) => (props.type === 'error' ? '#dc3545' : 'var(--light-blue)')};
    text-align: center;
    font-size: 1.5rem;
    margin-top: 2rem;
    text-shadow: 0 0 10px
        ${(props) => (props.type === 'error' ? '#dc3545' : 'var(--light-blue)')};
`;
