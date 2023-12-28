import express from 'express';
import {ethers} from 'ethers';
import {JSONFilePreset} from 'lowdb/node';
import contractData from '../contracts/voting.json' assert {type: 'json'};

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

const defaultData = {votes: []};
const db = await JSONFilePreset('db.json', defaultData);

app.post('/vote-cast', (req, res) => {
    const {round, voter, candidateId, voteCount} = req.body;
    console.log(
        `Vote cast in round ${round} by ${voter} for candidate ${candidateId}`
    );

    db.update(({votes}) => {
        votes.push({
            round: round.toString(),
            voter,
            candidateId: candidateId.toString(),
            voteCount: voteCount.toString(),
        });
    });
    console.log('Updated Database Entry:', db.data);
    res.status(200).json({message: 'Vote cast successfully'});
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
