import {renderHook, act} from '@testing-library/react-hooks';
import {useWallet} from '../useWallet';

class MockWeb3 {
    eth = {
        requestAccounts: jest.fn().mockResolvedValue(['0x0']),
        getAccounts: jest.fn().mockResolvedValue(['0x0']),
        currentProvider: {
            request: jest.fn().mockImplementation(({method, params}) => {
                if (method === 'wallet_switchEthereumChain') {
                    if (params[0].chainId === '0xaa36a7') {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Network switch error'));
                }
                return Promise.reject(new Error('Method not implemented'));
            }),
        },
    };
}

jest.mock('web3', () => jest.fn().mockImplementation(() => new MockWeb3()));

const mockEthereum = {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
};

global.window.ethereum = mockEthereum;

describe('useWallet', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.window.ethereum = mockEthereum;
    });

    it('initializes correctly without connected wallet', () => {
        global.window.ethereum = undefined;

        const {result} = renderHook(() => useWallet());

        expect(result.current.web3).toBeNull();
        expect(result.current.accounts).toEqual([]);
    });

    it('connects wallet correctly', async () => {
        const {result, waitFor} = renderHook(() => useWallet());

        await act(async () => {
            await result.current.connectWallet();
        });
        await waitFor(() => result.current.accounts !== null);

        expect(result.current.accounts).toEqual(['0x0']);
        expect(result.current.error).toBe('');
        expect(result.current.isCorrectNetwork).toBeTruthy();
    });

    it('reacts to account changes', async () => {
        const {result} = renderHook(() => useWallet());

        act(() => {
            mockEthereum.on.mock.calls[0][1](['0x1']);
        });

        expect(result.current.accounts).toEqual(['0x1']);
    });

    it('handles logout', () => {
        const {result} = renderHook(() => useWallet());

        act(() => {
            result.current.logout();
        });

        expect(result.current.accounts).toEqual([]);
        expect(result.current.isCorrectNetwork).toBeFalsy();
    });
});
