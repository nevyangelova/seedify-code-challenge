import React, {useContext} from 'react';
import Web3Context, {Web3Provider} from './contexts/Web3Context';
import Header from './components/Header';
import CandidatesList from './components/CandidatesList';
import Dashboard from './components/Dashboard';
import './App.css';

const MainContent = () => {
    const {loggedIn} = useContext(Web3Context);

    return (
        <main>
            {loggedIn ? (
                <>
                    {' '}
                    <Dashboard />
                    <CandidatesList />
                </>
            ) : (
                <p className='info'>Please connect your wallet to access the application.</p>
            )}
        </main>
    );
};

const App = () => {
    return (
        <Web3Provider>
            <div className='App'>
                <Header />
                <MainContent />
            </div>
        </Web3Provider>
    );
};

export default App;
