
const { network} = require("hardhat")

module.exports = async function({getNamedAccounts,deployments}){
    const {deploy,log} = deployments
    const {deployer} = await getNamedAccounts()

    const MedicalRecords = await deploy("MedicalRecords",{
        from: deployer,
        args:[],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,

    })
}

module.exports.tags = ["all","MedicalRecords"]