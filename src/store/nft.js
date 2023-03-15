import networks from '../networks.json'

import * as tools from "./tools";

export var arvContracts = {
    erc721: null,
    erc721Escrow: null,
    erc20: null,
    erc1155: null,
    erc1155Escrow: null
}


export async function loadBlockchain(provider = "ethereum") {
    await tools.loadWeb3(provider);

    const web3 = window.web3;
    //revert
    // web3.eth.handleRevert = true

    // Load account
    const accounts = await web3.eth.getAccounts();

    const networkId = await web3.eth.net.getId();
    console.log("Network ID", networkId, networks)
 
    if (networks[networkId]) {
        // erc20
        // arvContracts.erc20 = new web3.eth.Contract(Artemis.abi, );
        // arvContracts.erc20.address = Artemis.networks[networkId].address
        return { accounts: accounts }
    } else {
        window.alert("Error: Smart contract not deployed to detected network.");
    }
}
