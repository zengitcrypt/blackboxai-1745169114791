const stakingABI = [
    // Simplified ABI for demonstration
    "function stake(uint256 amount) external",
    "function withdraw(uint256 amount) external",
    "function getReward() external",
    "function balanceOf(address account) external view returns (uint256)",
    "function earned(address account) external view returns (uint256)",
    "function totalSupply() external view returns (uint256)",
    "function rewardRate() external view returns (uint256)"
];

const tokenABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)"
];

// BSC Testnet Addresses (Replace with mainnet addresses when deploying)
const stakingAddress = "0x0000000000000000000000000000000000000000"; // Replace with deployed address
const tokenAddress = "0x0000000000000000000000000000000000000000";   // Replace with deployed address

let provider, signer, stakingContract, tokenContract;

async function connectWallet() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === "undefined") {
            alert("Please install MetaMask!");
            return;
        }

        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create Web3 provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        // Initialize contracts
        stakingContract = new ethers.Contract(stakingAddress, stakingABI, signer);
        tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

        // Update UI
        const address = await signer.getAddress();
        document.getElementById("connectWallet").textContent = 
            address.slice(0, 6) + "..." + address.slice(-4);

        // Load initial data
        updateStats();
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet!");
    }
}

async function updateStats() {
    try {
        const address = await signer.getAddress();
        
        // Get staking stats
        const totalStaked = await stakingContract.totalStaked();
        const stakeInfo = await stakingContract.getStakeInfo(address);
        const earned = await stakingContract.earned(address);
        const rewardRate = await stakingContract.rewardRate();
        const lockPeriod = await stakingContract.lockPeriod();

        // Calculate APY
        const apy = (rewardRate * 365).toFixed(2);

        // Calculate remaining lock time
        const currentTime = Math.floor(Date.now() / 1000);
        const lockEndTime = Number(stakeInfo.timestamp) + Number(lockPeriod);
        const remainingLock = Math.max(0, lockEndTime - currentTime);
        const remainingDays = Math.ceil(remainingLock / 86400); // Convert seconds to days

        // Update UI
        document.querySelector('[data-stat="totalStaked"]').textContent = 
            ethers.utils.formatEther(totalStaked) + " LOTINU";
        document.querySelector('[data-stat="apy"]').textContent = apy + "%";
        document.querySelector('[data-stat="earned"]').textContent = 
            ethers.utils.formatEther(earned) + " LOTINU";
        document.querySelector('[data-stat="lockTimer"]').textContent = 
            remainingDays > 0 ? remainingDays + " days" : "Unlocked";
    } catch (error) {
        console.error("Error updating stats:", error);
    }
}

async function approve() {
    try {
        const amount = document.querySelector('input[type="number"]').value;
        if (!amount) {
            alert("Please enter an amount to stake");
            return;
        }

        // Show loading state
        const approveBtn = document.querySelector('.gradient-button');
        const originalText = approveBtn.textContent;
        approveBtn.textContent = 'Approving...';
        approveBtn.disabled = true;

        const tx = await tokenContract.approve(
            stakingAddress, 
            ethers.utils.parseEther(amount)
        );
        await tx.wait();
        
        // After approval, automatically stake
        await stake(amount);

        // Reset button
        approveBtn.textContent = originalText;
        approveBtn.disabled = false;
    } catch (error) {
        console.error("Error approving:", error);
        alert("Failed to approve!");
    }
}

async function stake(amount) {
    try {
        if (!amount) return;

        // Show loading state
        const approveBtn = document.querySelector('.gradient-button');
        approveBtn.textContent = 'Staking...';
        approveBtn.disabled = true;

        const tx = await stakingContract.stake(ethers.utils.parseEther(amount));
        await tx.wait();

        // Clear input and update stats
        document.querySelector('input[type="number"]').value = '';
        await updateStats();

        // Reset button and show success
        approveBtn.textContent = 'Approve';
        approveBtn.disabled = false;
        alert("Staking successful!");
    } catch (error) {
        console.error("Error staking:", error);
        alert("Failed to stake!");
    }
}

async function harvest() {
    try {
        // Show loading state
        const harvestBtn = document.querySelector('.harvest-button');
        const originalText = harvestBtn.textContent;
        harvestBtn.textContent = 'Harvesting...';
        harvestBtn.disabled = true;

        const tx = await stakingContract.getReward();
        await tx.wait();
        
        await updateStats();

        // Reset button
        harvestBtn.textContent = originalText;
        harvestBtn.disabled = false;
        alert("Rewards claimed successfully!");
    } catch (error) {
        console.error("Error harvesting:", error);
        alert("Failed to harvest rewards!");
    }
}

async function withdraw() {
    try {
        const amount = document.querySelector('input[type="number"]').value;
        if (!amount) {
            alert("Please enter an amount to withdraw");
            return;
        }

        // Show loading state
        const withdrawBtn = document.querySelector('.withdraw-button');
        const originalText = withdrawBtn.textContent;
        withdrawBtn.textContent = 'Withdrawing...';
        withdrawBtn.disabled = true;

        const tx = await stakingContract.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        
        // Clear input and update stats
        document.querySelector('input[type="number"]').value = '';
        await updateStats();

        // Reset button
        withdrawBtn.textContent = originalText;
        withdrawBtn.disabled = false;
        alert("Withdrawal successful!");
    } catch (error) {
        console.error("Error withdrawing:", error);
        alert("Failed to withdraw!");
    }
}

// Event Listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.querySelector(".gradient-button").addEventListener("click", approve);
document.querySelector(".harvest-button").addEventListener("click", harvest);
document.querySelector(".withdraw-button").addEventListener("click", withdraw);

// Check if already connected
if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
        if (accounts.length > 0) connectWallet();
    });
}
