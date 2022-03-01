const {ethers} = require("hardhat");

async function getProposalParams({treasuryAddress, arbConnectorAddress}) {
    if (!treasuryAddress || !arbConnectorAddress) {
        throw new Error("address error");
    }

    const parseUnits = ethers.utils.parseUnits;

    const targets = [treasuryAddress, treasuryAddress];
    const values = ["0", "0"];
    const currBlock = await ethers.provider.getBlock("latest");
    const sigs = ["acceptAdmin()", "addSchedule(uint256,uint256,address,uint256)"];
    const calldatas = [
        ethers.utils.defaultAbiCoder.encode([], []),
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "uint256", "address", "uint256"],
            [
                currBlock.number, // drip start block
                parseUnits("1"), // drip rate, in wei
                arbConnectorAddress, // target address
                parseUnits("20000000") // 20m in total, in wei
            ]
        )
    ];
    const msg = `
UIP-003: Drip UNION tokens to Arbitrum 

# Proposals

- Accept the Treasury admin update (changing to Timelock)
- Add a new vesting schedule with the following parameters:
  - Target: ArbConnector (${arbConnectorAddress})
  - Drip rate: 1 UNION per block
  - Total amount: 20M UNION
`;
    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, msg});

    return {targets, values, sigs, calldatas, msg};
}

module.exports = {
    getProposalParams
};
