const { ethers } = require("hardhat");

async function main() {
    // Get the contract factories
    const LotinuToken = await ethers.getContractFactory("LotinuToken");
    const LotinuStaking = await ethers.getContractFactory("LotinuStaking");

    // Deploy LOTINU token
    console.log("Deploying LOTINU token...");
    const token = await LotinuToken.deploy();
    await token.deployed();
    console.log("LOTINU token deployed to:", token.address);

    // Deploy staking contract
    console.log("Deploying staking contract...");
    const staking = await LotinuStaking.deploy(token.address);
    await staking.deployed();
    console.log("Staking contract deployed to:", staking.address);

    // Transfer some tokens to the staking contract for rewards
    const amount = ethers.utils.parseEther("100000000"); // 100 million tokens
    await token.transfer(staking.address, amount);
    console.log("Transferred initial rewards to staking contract");

    console.log("\nDeployment complete! Update these addresses in app.js:");
    console.log("tokenAddress =", token.address);
    console.log("stakingAddress =", staking.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
