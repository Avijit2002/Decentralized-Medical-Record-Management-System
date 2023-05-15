//const contract = require("../artifacts/contracts/MedicalRecords.sol/MedicalRecords.json")
import {ethers} from "./ethers-5.2.umd.min.js"
//import {axios} from "./axios.min.js"
import {abi,contractAddress} from "./constants.js"

//console.log(abi,contractAddress)

// var file




let accounts
let provider
let signer


const connectButton = document.getElementById('connect-button')
const uploadButtonPatient = document.getElementById('upload-patient')
const fetchButton = document.getElementById('fetch-doc')
const fileInput = document.getElementById('file-input')
const docs = document.getElementById('docs')
const addressInput = document.getElementById('address-input')
const addressInputButton = document.getElementById('address-input-button')
const seeAccessList = document.getElementById('see-access-list')
const sharedadd = document.getElementById('acc-add')
const revokeAdd = document.getElementById('revoke-address-input')
const revokeBut = document.getElementById('revoke-address-button')



// Connecting to metamask on click
connectButton.onclick = connect
async function connect(){
    //console.log("click")
    if(typeof window.ethereum!=undefined){
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        //console.log(accounts)
        connectButton.innerHTML="connected"
        document.getElementById('address').innerHTML=accounts[0]
    }else{
        console.log("No Metamask!!!")
    }
}


// Connecting to mask and printing address
if(typeof window.ethereum!=undefined){
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    //console.log(accounts)
    connectButton.innerHTML="Wallet Connected"
    document.getElementById('address').innerHTML=accounts[0]
}else{
    console.log("No Metamask!!!")
}
window.ethereum.on("accountsChanged",()=>{
    window.location.reload
})


provider = new ethers.providers.Web3Provider(window.ethereum)  // similar to json rpc provider
signer = await provider.getSigner()
const contract = new ethers.Contract(contractAddress,abi,signer)


const formData = new FormData();
fileInput.onchange = Filedetails
async function Filedetails(e){
    console.log(e.target.files[0])
    formData.append("file", e.target.files[0]);    
}

uploadButtonPatient.onclick = UploadDocumentPatient
async function UploadDocumentPatient(){
    if(typeof window.ethereum!=undefined){
        // provider/connection to BC
        // Signer/Wallet
        // Contract
        // ABI
        //provider = new ethers.providers.Web3Provider(window.ethereum)  // similar to json rpc provider
        // finds the http url for blockchain(endpoint)
        //signer = await provider.getSigner()
        //console.log(signer)
        //const contract = new ethers.Contract(contractAddress,abi,signer)
        //console.log(contract)
        var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            data: formData,
            headers: { 
              'pinata_api_key': '438f32f3a863814aa563',
              'pinata_secret_api_key':'3e07a2d8aa4b2bbfebaf523be89ee5fbf9ad906dee02d62b69ddd7c36f39cdd8',
              "Content-Type": "multipart/form-data",
            }
          };
          var res = await axios(config)
          console.log(res.data.IpfsHash);
        const transactionResponse = await contract.createRecordbyowner("5th",res.data.IpfsHash)
        //const transactionResponse = await contract.getRecord("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
        console.log(transactionResponse)
          alert('Document Uploaded to IPFS and hash stored to blockchain') 
    }
}
//https://gateway.pinata.cloud/ipfs/



fetchButton.onclick = FetchDocument
async function FetchDocument(){
    if(typeof window.ethereum!=undefined){
        //const contract = new ethers.Contract(contractAddress,abi,signer)
        //console.log(contract)

        //const transactionResponse = await contract.createRecordbyowner("2nd","aa")
        const transactionResponse = await contract.getRecord("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
        console.log(transactionResponse)

        for(var i=0;i<transactionResponse.length;i++){
            const link = document.createElement('embed');
            link.setAttribute('src', 'https://gateway.pinata.cloud/ipfs/'+transactionResponse[i][1]);
            link.setAttribute('type', 'application/pdf');
            link.setAttribute('width', '40%');
            link.setAttribute('height', '400px');
            link.textContent = 'Document '+i;
            link.setAttribute('id', 'data');
            link.style.margin = "15px";
            //document.getElementsByClassName('mai')
            docs.appendChild(link);
        }
        //document.getElementById('data').innerHTML=
        //document.getElementById('data').href='https://gateway.pinata.cloud/ipfs/'+transactionResponse[0][1]
        //await contract.grantAccess("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
        window.preventDefault
    }
}

addressInputButton.onclick = Fetchaddress
async function Fetchaddress(){            
    var value = addressInput.value;
    //console.log(value)
    const transactionResponse = await contract.grantAccess(value)
    console.log(transactionResponse)
}

seeAccessList.onclick = seeAccessListfun
async function seeAccessListfun(){
     //console.log(contract)
     const transactionResponse = await contract.getAccessListForPatient("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
     console.log(transactionResponse)
     for(var i=0;i<transactionResponse.length;i++){
        const link = document.createElement('h5');
        link.textContent = transactionResponse[i];
        //document.getElementsByClassName('mai')
        sharedadd.appendChild(link);
    }
 }

 revokeBut.onclick = revokefun
 async function revokefun(){
    var val = revokeAdd.value;
    console.log(val)
    const transactionResponse = await contract.revokeAccess(val)
    

 }