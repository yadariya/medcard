export default [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "pages",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "doctor",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "requestCid",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "requestTimestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "responseCid",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "responseTimestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct MedicalCard.Page[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "doctor",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "requestCid",
				"type": "string"
			}
		],
		"name": "request",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pageId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "responseCid",
				"type": "string"
			}
		],
		"name": "response",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];