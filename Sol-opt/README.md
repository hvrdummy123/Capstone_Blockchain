# Solidity Gas Optimizer Tool

## 📦 Overview
This tool analyzes Solidity smart contracts for common gas inefficiencies using `slither` and custom heuristics.

## 🧰 Requirements
- Python 3.x
- [Slither](https://github.com/crytic/slither) (`pip install slither-analyzer`)
- `solc` (`npm install -g solc`)

## ▶️ Usage

```bash
python optimize_me.py contracts/Example.sol
```

## ✅ Features
- Detects loops accessing storage repeatedly
- Detects unused variables
- Prints custom gas optimization suggestions

## 📂 File Structure
- `contracts/Example.sol` — Sample test contract
- `optimize_me.py` — Main analyzer script
