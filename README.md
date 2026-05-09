# SentinelBridge 🛡️

**An AI-Powered Security Operations Center (SOC) for Web3 Bridging.**
*Built for the LI.FI Cross-Chain Hackathon Bounty*

## 🚨 The Problem: "Blind Execution"
In the current Web3 ecosystem, cross-chain bridging is treated as a simple transaction rather than a security event. Users routinely execute swaps without the tools to audit liquidity pools, verify destination contracts, or calculate true slippage. This "blind execution" leads to drained wallets, high hidden fees, and compromised funds.

## 🛡️ The Solution: SentinelBridge
SentinelBridge reframes decentralized finance through a cybersecurity lens. It acts as a **Human-in-the-Loop Firewall**, intercepting bridge requests and acting as a localized SOC analyst for the user's wallet before any transaction is signed.

## ⚙️ Core Architecture & LI.FI Integration
This project heavily utilizes the **LI.FI REST API** (`/v1/quote`) as its primary intelligence-gathering tool. 

1. **Route Simulation:** The Sentinel agent intercepts the user's bridge command and silently pings the LI.FI protocol to fetch the most efficient cross-chain route.
2. **Slippage Guard:** The agent parses the raw LI.FI return data, calculating exact price impacts. Routes with >1.5% slippage trigger an automatic security warning.
3. **Asset Verification:** The system cross-references the LI.FI destination token against a trusted list (e.g., native SOL, USDC) to prevent routing funds into unverified or malicious smart contracts.
4. **Conditional Fallback Logic:** If a user is unconnected, Sentinel injects a public audit address (`0xd8dA...`) into the LI.FI request to allow for zero-risk "Shadow Scans" of the network.

## 🚦 Security Clearance Workflow
SentinelBridge forces a strict authorization sequence:
* **Intercept & Analyze:** Data is fetched via LI.FI.
* **Triage:** Trust scores, liquidity bridges, and slippage are calculated.
* **Authorization Lock:** The `Sign & Execute` button remains disabled until the user physically checks the security acknowledgment box, ensuring informed consent.

## 🛠️ Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS
* **Security & Routing:** LI.FI Protocol API
* **UI/UX:** Terminal-based SOC interface

---
*Developed by a Cybersecurity Engineering student focused on bringing institutional-grade SOC workflows to decentralized user experiences.*
