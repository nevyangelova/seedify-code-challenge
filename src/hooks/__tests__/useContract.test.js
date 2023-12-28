import {renderHook, act} from '@testing-library/react-hooks';
import {useContract} from '../useContract';

class MockWeb3 {
    eth = {
        Contract: jest.fn().mockImplementation(() => ({
            methods: {
                candidatesCount: jest.fn(() => ({
                    call: jest.fn().mockResolvedValue(2),
                })),
                candidates: jest.fn().mockImplementation((id) => ({
                    call: jest.fn().mockResolvedValue({
                        id,
                        name: `Candidate ${id}`,
                        voteCount: 0,
                    }),
                })),
                vote: jest.fn().mockImplementation(() => ({
                    send: jest.fn().mockResolvedValue({}),
                })),
            },
        })),
    };
    utils = {
        sha3: jest
            .fn()
            .mockImplementation(
                () => '0x1234567890abcdef1234567890abcdef12345678'
            ),
        isAddress: jest.fn().mockImplementation((address) => {
            // Simple regex check for Ethereum address
            return /^0x[a-fA-F0-9]{40}$/.test(address);
        }),
    };
}

describe('useContract', () => {
    let web3Instance;
    let accounts;

    beforeEach(() => {
        web3Instance = new MockWeb3('http://localhost:8545');
        accounts = ['0x0'];
    });

    it('should initialize contract correctly', async () => {
        const {result, waitFor} = renderHook(() =>
            useContract(web3Instance, accounts)
        );
        await waitFor(() => result.current.contract !== null);

        expect(result.current.contract).toBeDefined();
    });

    it('should fetch candidates correctly', async () => {
        const {result, waitFor} = renderHook(() =>
            useContract(web3Instance, accounts)
        );
        await waitFor(() => result.current.contract !== null);

        let candidates;
        await act(async () => {
            candidates = await result.current.fetchCandidates();
        });

        expect(candidates.length).toBe(2);
        expect(candidates[0].name).toBe('Candidate 0');
        expect(candidates[1].name).toBe('Candidate 1');
    });

    it('should handle error when fetching candidates', async () => {
        web3Instance.eth.Contract.mockImplementationOnce(() => ({
            methods: {
                candidatesCount: () => ({
                    call: jest
                        .fn()
                        .mockRejectedValue(
                            new Error('Error fetching candidates count')
                        ),
                }),
                candidates: () => ({call: jest.fn()}),
            },
        }));

        const {result, waitForNextUpdate} = renderHook(() =>
            useContract(web3Instance, accounts)
        );

        let error;
        try {
            await act(async () => {
                await result.current.fetchCandidates();
                await waitForNextUpdate();
            });
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toBe('Error fetching candidates count');
    });

    it('should handle vote casting correctly', async () => {
        const {result, waitFor} = renderHook(() =>
            useContract(web3Instance, accounts)
        );
        await waitFor(() => result.current.contract !== null);

        await act(async () => {
            await result.current.castVote(0);
        });

        expect(result.current.contract.methods.vote).toHaveBeenCalledWith(0);
    });

    it('should handle error when casting a vote', async () => {
        web3Instance.eth.Contract.mockImplementationOnce(() => ({
            methods: {
                vote: () => ({
                    send: jest
                        .fn()
                        .mockRejectedValue(new Error('Error casting vote')),
                }),
            },
        }));

        const {result, waitForNextUpdate} = renderHook(() =>
            useContract(web3Instance, accounts)
        );

        let error;
        try {
            await act(async () => {
                await result.current.castVote(1);
                await waitForNextUpdate();
            });
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toBe('Error casting vote');
    });

    it('should handle error when fetching vote transactions', async () => {
        web3Instance.utils.sha3.mockReturnValue('mockedHash');

        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: () => Promise.resolve({message: 'Internal Server Error'}),
        });

        const {result, waitFor} = renderHook(() =>
            useContract(web3Instance, accounts)
        );
        await waitFor(() => result.current.contract);

        let error;
        try {
            await result.current.fetchVoteTransactions(accounts[0]);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toContain('Error: 500');
    });

    it('should handle missing web3 instance', async () => {
        const {result} = renderHook(() => useContract(null, accounts));
        expect(result.current.contract).toBeNull();
    });

    it('should fetch vote transactions successfully', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () =>
                Promise.resolve({
                    result: [
                        {
                            input:
                                web3Instance.utils
                                    .sha3('vote(uint256)')
                                    .substring(0, 10) + 'additionalData',
                        },
                    ],
                }),
        });

        const {result, waitFor} = renderHook(() =>
            useContract(web3Instance, accounts)
        );
        await waitFor(() => result.current.contract);

        let transactions;
        await act(async () => {
            transactions = await result.current.fetchVoteTransactions(
                accounts[0]
            );
        });

        expect(transactions.length).toBeGreaterThan(0);
    });
});
