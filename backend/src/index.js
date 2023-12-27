import express from 'express';
import {ethers} from 'ethers';
import {LowSync, JSONFileSync} from 'lowdb';
import contractData from '../contracts/voting.json';

const app = express();
app.use(express.json());

const contractABI = contractData.abi;
const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const votingContract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
);

const adapter = new JSONFileSync('db.json');
const db = new LowSync(adapter);
db.read();
db.data ||= {votes: []};
db.write();

votingContract.on('VoteCast', (round, voter, candidateId, voteCount) => {
    console.log(
        `Vote cast in round ${round} by ${voter} for candidate ${candidateId}`
    );

    db.data.votes.push({
        round: round.toString(),
        voter,
        candidateId: candidateId.toString(),
        voteCount: voteCount.toString(),
    });
    db.write();
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
