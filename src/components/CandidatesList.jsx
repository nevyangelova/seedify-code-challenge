import React, {useContext, useState, useEffect, useCallback} from 'react';
import Web3Context from '../contexts/Web3Context';
import {
    CandidatesContainer,
    CandidateCard,
    CandidatePhoto,
    CandidateName,
    VoteCount,
    VoteButton,
    CandidatesGrid,
    MessageText,
    Title,
} from './CandidatesList.root';

const CandidatesList = () => {
    const {
        contract,
        fetchCandidates,
        castVote,
        message,
        setMessage,
        walletError,
    } = useContext(Web3Context);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [votingStatus, setVotingStatus] = useState({});

    const refreshCandidates = useCallback(async () => {
        setLoading(true);
        try {
            const candidatesArray = await fetchCandidates();
            setCandidates(candidatesArray);
            setMessage({type: '', content: ''});
        } catch (err) {
            setMessage({type: 'error', content: 'Failed to load candidates'});
        } finally {
            setLoading(false);
        }
    }, [fetchCandidates, setMessage]);

    useEffect(() => {
        refreshCandidates();
    }, [contract, refreshCandidates]);

    const handleVote = useCallback(
        async (candidateId) => {
            setVotingStatus((prevStatus) => ({
                ...prevStatus,
                [candidateId]: true,
            }));
            try {
                await castVote(candidateId);
                await refreshCandidates();
                setMessage({
                    type: 'success',
                    content: 'Vote cast successfully',
                });
            } catch (err) {
                setMessage({
                    type: 'error',
                    content: err.error.message || 'Failed to cast vote.',
                });
            } finally {
                setVotingStatus((prevStatus) => ({
                    ...prevStatus,
                    [candidateId]: false,
                }));
            }
        },
        [castVote, refreshCandidates, setMessage]
    );

    return (
        <CandidatesContainer>
            <Title>Candidates</Title>
            {loading ? (
                <MessageText>Loading candidates...</MessageText>
            ) : (
                <CandidatesGrid>
                    {candidates.map((candidate, index) => (
                        <CandidateCard key={index}>
                            <CandidatePhoto
                                src={`https://robohash.org/${index}?set=set2`}
                                alt='Candidate'
                            />
                            <CandidateName>{candidate.name}</CandidateName>
                            <VoteCount>
                                Votes: {candidate.voteCount.toString()}
                            </VoteCount>
                            <VoteButton
                                onClick={() => handleVote(index)}
                                disabled={votingStatus[index]}
                            >
                                {votingStatus[index] ? 'Voting...' : 'Vote'}
                            </VoteButton>
                        </CandidateCard>
                    ))}
                </CandidatesGrid>
            )}
            {message && (
                <MessageText type={message.type}>{message.content}</MessageText>
            )}
            {walletError && (
                <MessageText type={'error'}>{walletError}</MessageText>
            )}
        </CandidatesContainer>
    );
};

export default React.memo(CandidatesList);
