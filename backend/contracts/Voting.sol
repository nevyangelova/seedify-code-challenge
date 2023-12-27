pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    uint public currentRound = 1;

    event VoteCast(
        uint indexed round,
        address indexed voter,
        uint candidateId,
        uint voteCount
    );

    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) private {
        candidates[candidatesCount] = Candidate(_name, 0);
        candidatesCount++;
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId < candidatesCount, "Invalid candidate ID.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VoteCast(
            currentRound,
            msg.sender,
            _candidateId,
            candidates[_candidateId].voteCount
        );
    }

    function startNewRound() public {
        currentRound++;
        for (uint i = 0; i < candidatesCount; i++) {
            candidates[i].voteCount = 0;
        }
    }
}
