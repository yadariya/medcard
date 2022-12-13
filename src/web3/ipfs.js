// ipfs with infra
import IPFS from 'ipfs-infura';

const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    projectId: '2In9oZGuH7DK3Z06O0D3PDPIDKU',
    projectSecret: 'c524ea42740b4838157f19478f9d80bd',
});

ipfs.cat = async (hash) => {
    const response = await fetch(`https://ipfs.infura.io:5001/api/v0/cat?arg=${hash}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic MkluOW9aR3VIN0RLM1owNk8wRDNQRFBJREtVOmM1MjRlYTQyNzQwYjQ4MzgxNTdmMTk0NzhmOWQ4MGJk',
        }
    });
    return await response.text();
}

ipfs.catJSON = async (hash) => {
    const response = await fetch(`https://ipfs.infura.io:5001/api/v0/cat?arg=${hash}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic MkluOW9aR3VIN0RLM1owNk8wRDNQRFBJREtVOmM1MjRlYTQyNzQwYjQ4MzgxNTdmMTk0NzhmOWQ4MGJk',
        }
    });
    return await response.json();
}

export default ipfs;