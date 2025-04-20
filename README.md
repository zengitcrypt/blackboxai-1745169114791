# LOTINU Staking DApp

A decentralized staking application built on Binance Smart Chain (BSC) that allows users to stake LOTINU tokens and earn rewards.

## Features

- Stake LOTINU tokens
- Earn staking rewards (APY based)
- Lock period of 7 days
- Harvest rewards anytime
- Withdraw tokens after lock period
- Modern and responsive UI
- MetaMask integration

## Tech Stack

- Solidity (Smart Contracts)
- Hardhat (Development Environment)
- OpenZeppelin (Contract Standards)
- HTML/TailwindCSS (Frontend)
- Ethers.js (Blockchain Interaction)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd lotinu-staking
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your private key and BSC network URLs

4. Compile contracts:
```bash
npm run compile
```

5. Deploy contracts:
```bash
# For testnet
npm run deploy:testnet

# For mainnet
npm run deploy:mainnet
```

6. Update contract addresses:
- Copy the deployed contract addresses
- Update `tokenAddress` and `stakingAddress` in `app.js`

7. Start the development server:
```bash
npm start
```

## Smart Contracts

### LotinuToken.sol
- ERC20 token implementation
- Initial supply: 1 billion tokens
- Burnable and mintable (by owner)

### LotinuStaking.sol
- Staking functionality
- Reward calculation
- Lock period management
- Emergency withdrawal (owner only)

## Frontend

The DApp features a modern, responsive interface with:
- Wallet connection
- Staking statistics
- Token approval
- Staking/unstaking functionality
- Reward harvesting
- Lock timer display

## Security

- ReentrancyGuard implementation
- Owner access control
- Safe math operations
- Emergency withdrawal functions
- Standard security practices

## License

MIT License
