pragma solidity ^0.8.0;

contract MedicalRecords {
    struct Record {
        string name;
        string dataHash;
        address owner;
        address[] allowed;
    }

    mapping( address => Record[]) db;  // ye hai patient to record list
    mapping( address => address[]) acc; // ye hai patient ka doc access list
    mapping( address => address[]) plist; // ye hai doctor ka patient list
    //address[] patientList; 
    //address[] Plist;
    

    function createRecordbyDOC(address _useraddress, string memory _name, string memory _dataHash) public {
        require(Isallowed(msg.sender,_useraddress),"Not allowed");
        db[_useraddress].push(Record(_name, _dataHash, _useraddress, new address[](0)));
    }
    function createRecordbyowner( string memory _name, string memory _dataHash) public{
        //require(msg.sender==db[_useraddress][0].owner,"Not allowed");
        db[msg.sender].push(Record(_name, _dataHash, msg.sender, new address[](0)));
    }

    function getRecord(address _useraddress) public view returns(Record[] memory){
        require(Isallowed(msg.sender,_useraddress)||msg.sender==db[_useraddress][0].owner,"Not Allowed");
        return db[_useraddress];
    }

    function grantAccess(address _docAddress) public{
        acc[msg.sender].push(_docAddress);
        plist[_docAddress].push(msg.sender);
    }

    function revokeAccess(address docAddress) public{
        uint i;
        uint j;
        for(i=0;i<acc[msg.sender].length;i++){
            if(acc[msg.sender][i]==docAddress){
                break;
            }
        }
        for(j=i;j<acc[msg.sender].length-1;j++){
            acc[msg.sender][j]=acc[msg.sender][j+1]; 
        }
        //delete acc[msg.sender][i];
        acc[msg.sender].pop();
        for(i=0;i<plist[docAddress].length;i++){
            if(plist[docAddress][i]==msg.sender){
                break;
            }
        }
        for(j=i;j<plist[docAddress].length-1;j++){
            plist[docAddress][j]=plist[docAddress][j+1]; 
        }
        plist[docAddress].pop();
    }

    function getAccessListForPatient(address _PaAddress) public view returns(address[] memory){
        return acc[_PaAddress];
    }

    function getPatientListForDoc() public view returns(address[] memory){
        return plist[msg.sender];
    }



    function Isallowed(address senderA, address _useraddress) private view returns (bool){
        uint i;
        while(i< acc[_useraddress].length){
            if(senderA==acc[_useraddress][i]){
                return true;
            }
            i++;
        }
        return false;
    }

}