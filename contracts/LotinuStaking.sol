// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LotinuStaking is ReentrancyGuard, Ownable {
    IERC20 public stakingToken;
    
    // Staking settings
    uint256 public rewardRate = 100; // 1% per day
    uint256 public lockPeriod = 7 days;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 rewards;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    
    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }
    
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        
        // Update rewards before modifying stake
        _updateReward(msg.sender);
        
        // Transfer tokens to contract
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Update staking info
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot withdraw 0");
        require(stakes[msg.sender].amount >= amount, "Not enough staked");
        require(block.timestamp >= stakes[msg.sender].timestamp + lockPeriod, "Lock period not ended");
        
        // Update rewards before modifying stake
        _updateReward(msg.sender);
        
        // Update staking info
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;
        
        // Transfer tokens back to user
        require(stakingToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function getReward() external nonReentrant {
        _updateReward(msg.sender);
        uint256 reward = stakes[msg.sender].rewards;
        
        if (reward > 0) {
            stakes[msg.sender].rewards = 0;
            require(stakingToken.transfer(msg.sender, reward), "Transfer failed");
            emit RewardPaid(msg.sender, reward);
        }
    }
    
    function _updateReward(address account) internal {
        if (account != address(0)) {
            Stake storage stake = stakes[account];
            uint256 timeElapsed = block.timestamp - stake.timestamp;
            uint256 reward = (stake.amount * rewardRate * timeElapsed) / (100 * 1 days);
            stake.rewards = reward;
            stake.timestamp = block.timestamp;
        }
    }
    
    // View functions
    function earned(address account) public view returns (uint256) {
        Stake memory stake = stakes[account];
        uint256 timeElapsed = block.timestamp - stake.timestamp;
        return (stake.amount * rewardRate * timeElapsed) / (100 * 1 days) + stake.rewards;
    }
    
    function getStakeInfo(address account) external view returns (uint256 amount, uint256 timestamp, uint256 rewards) {
        Stake memory stake = stakes[account];
        return (stake.amount, stake.timestamp, stake.rewards);
    }
    
    // Admin functions
    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
    }
    
    function setLockPeriod(uint256 _lockPeriod) external onlyOwner {
        lockPeriod = _lockPeriod;
    }
    
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(stakingToken.transfer(msg.sender, amount), "Transfer failed");
    }
}
