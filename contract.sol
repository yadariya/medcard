//SPDX-License-Identifier: Dariya

pragma solidity ^0.8.1;

contract MedicalCard {

    struct Page { // part of medical record
        address doctor;
        string requestCid; // IPFS file hash (content id) from client
        uint256 requestTimestamp;
        string responseCid; // IPFS file hash (content id) from doctor
        uint256 responseTimestamp;
    }

    address private _owner; // patient
    Page[] private _pages; // medical record

    constructor(address owner) {
        _owner = owner;
    }

    function request(address doctor, string calldata requestCid) public { // from patient
        require(msg.sender == _owner, "Not owner");

        _pages.push(Page(doctor, requestCid, block.timestamp, "", 0));
    }

    function response(uint256 pageId, string calldata responseCid) public { // from doctor
        Page storage page = _pages[pageId];

        require(msg.sender == page.doctor, "Not a doctor");
        require(page.responseTimestamp == 0, "Page is already filled");

        page.responseCid = responseCid;
        page.responseTimestamp = block.timestamp;
    }

    function pages() public view returns (Page[] memory) {
        return _pages;
    }
}

contract MedicalCardGenerator {
    mapping(address => MedicalCard) _cards;

    function createCard() public {
        require(
            _cards[msg.sender] == MedicalCard(address(0)),
            "Every address allowed to have only Medical Card"
        );
        _cards[msg.sender] = new MedicalCard(msg.sender);
    }

    function card(address owner) public view returns (MedicalCard) {
        return _cards[owner];
    }
}
