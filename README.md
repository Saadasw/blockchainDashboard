# MEV Education and Analysis Platform

A comprehensive platform for learning about and analyzing Maximal Extractable Value (MEV) in blockchain networks.

## 🚀 Features

### Web Applications
1. **MEV Transaction Visualizer** - Real-time visualization of MEV transactions
2. **Arbitrage Opportunity Calculator** - Educational tool for understanding arbitrage
3. **MEV Protection Checker** - Help users avoid MEV attacks
4. **Gas Fee Predictor** - MEV-aware gas fee estimation

### Data Dashboards
1. **MEV Market Dashboard** - Track MEV trends and market data
2. **Searcher Leaderboard** - Show top MEV extractors
3. **DEX Efficiency Tracker** - Compare exchange MEV levels
4. **Cross-Chain MEV Monitor** - Multi-chain analysis

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with TimescaleDB for time-series data
- **Real-time**: WebSocket connections
- **Blockchain**: Ethereum, Polygon, BSC integration
- **APIs**: Etherscan, The Graph, DEX APIs

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mev-education-platform
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. Start the development servers:
```bash
npm run dev
```

## 🏗️ Project Structure

```
mev-education-platform/
├── frontend/                 # React frontend applications
│   ├── src/
│   │   ├── apps/            # Individual web applications
│   │   ├── dashboards/      # Data dashboards
│   │   ├── components/      # Shared components
│   │   └── utils/           # Utility functions
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   └── utils/           # Backend utilities
├── database/                 # Database schemas and migrations
└── docs/                     # Documentation
```

## 🎯 Usage

### Web Applications

1. **MEV Transaction Visualizer**
   - Navigate to `/visualizer`
   - View real-time MEV transactions
   - Filter by transaction type, amount, or time

2. **Arbitrage Opportunity Calculator**
   - Navigate to `/calculator`
   - Input token pairs and amounts
   - Calculate potential arbitrage opportunities

3. **MEV Protection Checker**
   - Navigate to `/protection`
   - Check transaction for MEV vulnerability
   - Get protection recommendations

4. **Gas Fee Predictor**
   - Navigate to `/gas-predictor`
   - Get MEV-aware gas fee estimates
   - Optimize transaction timing

### Data Dashboards

1. **MEV Market Dashboard**
   - Navigate to `/dashboard/market`
   - View MEV trends and statistics
   - Monitor market conditions

2. **Searcher Leaderboard**
   - Navigate to `/dashboard/leaderboard`
   - See top MEV extractors
   - Track performance metrics

3. **DEX Efficiency Tracker**
   - Navigate to `/dashboard/dex-efficiency`
   - Compare DEX MEV levels
   - Analyze efficiency metrics

4. **Cross-Chain MEV Monitor**
   - Navigate to `/dashboard/cross-chain`
   - Multi-chain MEV analysis
   - Cross-chain opportunity tracking

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/mev_platform

# Blockchain APIs
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGON_API_KEY=your_polygon_api_key
BSC_API_KEY=your_bsc_api_key

# DEX APIs
UNISWAP_API_KEY=your_uniswap_api_key
SUSHISWAP_API_KEY=your_sushiswap_api_key

# WebSocket
WEBSOCKET_PORT=8080

# Server
PORT=3000
NODE_ENV=development
```

## 📊 Data Sources

- **Ethereum**: Etherscan API, The Graph
- **Polygon**: Polygon API, The Graph
- **BSC**: BSCScan API
- **DEX Data**: Uniswap, SushiSwap, PancakeSwap APIs
- **MEV Data**: Flashbots API, MEV-Inspect

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.


"# blockchainDashboard" 
