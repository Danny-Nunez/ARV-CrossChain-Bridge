import axios from "axios";
import { BACKEND_URL, S3_URL } from "../store/config";

const Web3 = require("web3");
import Torus from "@toruslabs/torus-embed";
import { BLOCKCHAIN_NETWORK } from "./config";
// import Portis from '@portis/web3';
var mime = require('mime-types')
import * as network from "../network.js";
import WalletConnectProvider from "@walletconnect/web3-provider";


export const PLATFORM_FEE = 1.5

export function getFileType(file) {
    if (file.type)
        return fileType(file.type)
    return fileType(mime.lookup(file))
}

export function fileType(type) {
    if (type.match('image.*'))
        return 'image';

    if (type.match('video.*'))
        return 'video';

    if (type.match('audio.*'))
        return 'audio';

    // etc...  
    return 'other';
}


export async function convertToCurrency(to, from) {
    try {
        // fetch data from a url endpoint
        const response = await axios
            .get(BACKEND_URL + `/nft/extras/spot_price?to=${to}&from=${from}`)
        const data = await response.data
        return data['amount']
    } catch (error) {
        console.log(error)
        return null
    }
}



export async function loadWeb3(provider = "ethereum") {
    // if (provider == 'portis') {
    //     const portis = new Portis('YOUR_DAPP_ID', 'mainnet');
    //     window.web3 = new Web3(portis.provider);
    // }
    if (provider == 'torus') {
        const torus = new Torus({
            buttonPosition: "top-right", // default: 'bottom-left'
        });
        await torus.init({
            // buildEnv: "staging", // uses staging.tor.us
            network: {
                host: BLOCKCHAIN_NETWORK, // 'mainnet'
            },
        });
        await torus.login();
        window.web3 = new Web3(torus.provider);
    }

    
    if (provider == 'ethereum' && window.ethereum) {
        try {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        catch (err) {
            console.log(err)
            return
        }
    }
    if (!window.web3 || provider == 'wallet-connect') {
        //  Create WalletConnect Provider
        const provider = new WalletConnectProvider({
        infuraId: "10c9fd2d2f144db6aa918e394faf6c89", // Required
        });

        //  Enable session (triggers QR Code modal)
        await provider.enable();
        window.web3 = new Web3(provider);
        await window.ethereum.enable()
    }

    if (!window.web3) {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        return
    }
    var reload = async ()=> {
        // var data = await loadBlockchain(provider);
        // console.log("tried", data);
        // if (data) {
        //     store.commit("updateWallet", data);
        // }
    }    

    window.web3.currentProvider.on("chainChanged", (resp) => {
        console.log(resp, "chainchanged");
        reload();
    });

    window.web3.currentProvider.on("accountsChanged", (accounts) => {
        console.log(accounts, "accountsChanged");
        reload();
    });


}

export async function getWalletSignature(token_type, onTokenSignSuccess, onTokenRequestFail) {

    // 1. Retrieve arbitrary login token from server
    // 2. Sign it using web3
    // 3. Send signed message & your eth address to server
    // 4. If server validates that you signature is valid
    // 4.1 The user with an according eth address is found - you are logged in
    // 4.2 The user with an according eth address is NOT found - you are redirected to signup page
    await loadWeb3()
    const web3 = window.web3;

    if (!web3) {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        return
    }

    var address = (await web3.eth.requestAccounts())[0]; // get user wallet address
    console.log("Address: " + address);

    var url = BACKEND_URL + '/accounts/get_auth_token/'
    axios.post(url, {
        wallet_address: address,
        token_type: token_type
    })
        .then(function (response) {
            console.log(response);

            var token = response.data['data']

            console.log("Token: " + token);
            var msg = web3.utils.toHex(token);

            web3.eth.personal.sign(msg, address, function (err, result) {
                if (err) {
                    if (typeof onTokenRequestFail == 'function') {
                        onTokenRequestFail(err);
                    }
                    console.log("Failed signing message \n" + msg + "\n - " + err);
                } else {
                    // console.log("Signed message: " + result);
                    if (typeof onTokenSignSuccess == 'function') {
                        onTokenSignSuccess(result, address);
                    }
                }
            });


        })
        .catch(function (error) {
            // We reached our target server, but it returned an error
            console.log("Autologin failed - request status " + error);
            if (typeof onTokenRequestFail == 'function') {
                onTokenRequestFail(error);
            }
        });

}

export var S3Upload =  {
    init(file, fileName, fileType, onSuccess, onFailure) {
        // var ext = fileName.split('.')[fileName.split('.').length-1]
        var name = `${Date.now()}-${fileName}`;
        name = stringToSlug(name)
        name += '.' + fileType.split('/')[1]
        console.log(name)
        network.axios.get(`/aws/sign_s3/?file_name=${name}&file_type=${fileType}`).then((response)=>{
            console.log(response);
            this.uploadFile(file, response, name, onSuccess, onFailure)
        }).catch((error)=> {
            onFailure(error);
        })
    },
    uploadFile(file, response, fileName, onSuccess, onFailure) {
        var data = response.data.data.fields
        data.file = file
        var body = new FormData();
        Object.keys(data).forEach((key)=>{
            body.append(key, data[key])
        })
       var aws = axios.create(
         {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: " "}
         }   
        )
        aws.post(response.data.data.url, body).then((response)=>{
            onSuccess(response, S3_URL+fileName);
            console.log(response);
        }).catch((error)=> {
            onFailure(error);
        })

    }
    

}


export function stringToSlug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str; 
}


export function isSafari() {
    var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
    return is_safari;  
}

export async function downloadFile(url) {
    try {    var response = await axios({
        url: url, //your url
        method: 'GET',
        responseType: 'blob', // important
    })
    //   window.URL.createObjectURL
    const blob = new Blob([response.data]);
    return blob;
}
    
    catch (err) {
        // Handle Error Here
        console.error(err);
    }

}

export function secondsToHHMMSS(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
}