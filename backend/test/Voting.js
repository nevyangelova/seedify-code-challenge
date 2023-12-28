import {expect} from 'chai';

describe('Voting Contract', function () {
    let Voting;
    let voting;
    let owner;
    let voter1;
    let voter2;
    let addrs;

    before(async function () {
        Voting = await ethers.getContractFactory('Voting');
        [owner, voter1, voter2, ...addrs] = await ethers.getSigners();
    });

    beforeEach(async function () {
        voting = await Voting.deploy();
        // await voting.deployed();
    });

    describe('Deployment', function () {
        it('Should correctly initialize candidates', async function () {
            const actualCandidatesCount = await voting.candidatesCount();
            expect(actualCandidatesCount).to.equal(2);

            const candidate1 = await voting.candidates(0);
            const candidate2 = await voting.candidates(1);
            expect(candidate1.name).to.equal('Candidate 1');
            expect(candidate2.name).to.equal('Candidate 2');
        });
    });

    describe('Voting', function () {
        it('Should emit a VoteCast event when a vote is cast', async function () {
            await expect(voting.connect(voter1).vote(0))
                .to.emit(voting, 'VoteCast')
                .withArgs(1, voter1.address, 0, 1);
        });

        it('Should not allow voting twice by the same voter in a round', async function () {
            await voting.connect(voter1).vote(0);
            await expect(voting.connect(voter1).vote(0)).to.be.revertedWith(
                'You have already voted.'
            );
        });

        it('Should reset votes when a new round starts', async function () {
            await voting.connect(voter1).vote(0);
            await voting.startNewRound();
            const candidate = await voting.candidates(0);
            const candidateVoteCountAfterNewRound = candidate.voteCount;

            expect(candidateVoteCountAfterNewRound).to.equal(0);
        });

        it('Should correctly count votes for multiple candidates', async function () {
            await voting.connect(voter1).vote(0);
            await voting.connect(voter2).vote(1);

            const candidate1 = await voting.candidates(0);
            const candidate1VoteCount = candidate1.voteCount;

            const candidate2 = await voting.candidates(1);
            const candidate2VoteCount = candidate2.voteCount;

            expect(candidate1VoteCount).to.equal(1);
            expect(candidate2VoteCount).to.equal(1);
        });
    });

    describe('New Round', function () {
        it('Should increment the round number', async function () {
            const initialRound = await voting.currentRound();
            await voting.startNewRound();
            const newRound = await voting.currentRound();
        
            const expectedNewRound = BigInt(initialRound) + BigInt(1);
            expect(BigInt(newRound)).to.equal(expectedNewRound);
        });

        it("Should reset all candidates' vote counts to 0", async function () {
            await voting.connect(voter1).vote(0);
            await voting.connect(voter2).vote(1);

            await voting.startNewRound();
            const candidatesCount = await voting.candidatesCount();

            for (let i = 0; i < candidatesCount; i++) {
                const candidate = await voting.candidates(i);
                expect(candidate.voteCount).to.equal(0);
            }
        });
    });
});
