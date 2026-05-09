import type {
  SecurityAlert,
  SecurityReport,
  SecurityStatus,
  ChatMessage,
} from './types';
import { VERIFIED_SOLANA_TOKENS, CHAIN_NAMES } from './types';
import { fetchLiFiQuote, parseLiFiQuoteResponse } from './lifi';

const SLIPPAGE_THRESHOLD = 1.5;

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * SOC Directive 1: Slippage Analysis
 * If slippage or price impact exceeds 1.5%, issue CRITICAL alert.
 */
function checkSlippage(slippage: number, priceImpact: number): SecurityAlert | null {
  const maxImpact = Math.max(slippage, priceImpact);
  if (maxImpact > SLIPPAGE_THRESHOLD) {
    return {
      severity: 'critical',
      directive: 'SOC-DIR-001',
      title: 'CRITICAL: Excessive Slippage Detected',
      description: `Price impact of ${maxImpact.toFixed(2)}% exceeds the maximum safe threshold of ${SLIPPAGE_THRESHOLD}%.`,
      details: `Slippage: ${slippage.toFixed(2)}% | Price Impact: ${priceImpact.toFixed(2)}% | Threshold: ${SLIPPAGE_THRESHOLD}%`,
      requiresConfirmation: true,
    };
  }
  return null;
}

/**
 * SOC Directive 2: Asset Verification
 * If destination asset is not SOL, USDC, or USDT, issue TRUST WARNING.
 */
function checkAssetVerification(destinationToken: string): SecurityAlert | null {
  const verifiedSymbols = Object.keys(VERIFIED_SOLANA_TOKENS);
  if (!verifiedSymbols.includes(destinationToken.toUpperCase())) {
    return {
      severity: 'warning',
      directive: 'SOC-DIR-002',
      title: 'TRUST WARNING: Unverified Destination Asset',
      description: `"${destinationToken}" is not in the verified high-liquidity token list (SOL, USDC, USDT).`,
      details: `Token "${destinationToken}" requires manual contract address verification before proceeding.`,
      requiresConfirmation: true,
    };
  }
  return null;
}

/**
 * SOC Directive 3: Generate Security Report
 */
function generateSecurityReport(
  parsedQuote: ReturnType<typeof parseLiFiQuoteResponse>,
  alerts: SecurityAlert[]
): SecurityReport {
  let status: SecurityStatus = 'safe';
  if (alerts.some((a) => a.severity === 'critical')) status = 'blocked';
  else if (alerts.some((a) => a.severity === 'warning')) status = 'warning';

  return {
    route: {
      steps: parsedQuote.routeSteps,
      totalSteps: parsedQuote.routeSteps.length,
    },
    providers: parsedQuote.providers,
    networkFees: `$${parsedQuote.totalFeesUSD}`,
    slippage: parsedQuote.slippage,
    priceImpact: parsedQuote.priceImpact,
    securityStatus: status,
    estimatedTime: parsedQuote.estimatedTime,
    sourceChain: CHAIN_NAMES[parsedQuote.sourceChain] || parsedQuote.sourceChain,
    destinationChain: CHAIN_NAMES[parsedQuote.destinationChain] || parsedQuote.destinationChain || 'Solana',
    sourceToken: parsedQuote.sourceToken,
    destinationToken: parsedQuote.destinationToken,
    inputAmount: parsedQuote.fromAmount,
    outputAmount: parsedQuote.toAmount,
  };
}

/**
 * Parse natural language bridge request.
 */
function parseUserIntent(message: string): {
  fromChain?: string;
  fromToken?: string;
  toToken?: string;
  amount?: string;
} | null {
  const lower = message.toLowerCase();

  // Pattern: "bridge 1 ETH from ethereum to SOL on solana"
  const bridgePattern = /(?:bridge|swap|send|move|transfer)\s+([\d.]+)\s+(\w+)\s+(?:from\s+)?(\w+)\s+(?:to\s+)(\w+)/i;
  const match = lower.match(bridgePattern);

  if (match) {
    return {
      amount: match[1],
      fromToken: match[2].toUpperCase(),
      fromChain: match[3].toLowerCase(),
      toToken: match[4].toUpperCase(),
    };
  }

  // Simpler pattern: "bridge 1 ETH to SOL"
  const simplePattern = /(?:bridge|swap|send|move|transfer)\s+([\d.]+)\s+(\w+)\s+to\s+(\w+)/i;
  const simpleMatch = lower.match(simplePattern);

  if (simpleMatch) {
    return {
      amount: simpleMatch[1],
      fromToken: simpleMatch[2].toUpperCase(),
      toToken: simpleMatch[3].toUpperCase(),
    };
  }

  return null;
}

/**
 * Main Sentinel agent processor.
 * Takes user message, processes intent, fetches LI.FI data, runs security directives.
 */
export async function processSentinelMessage(
  userMessage: string,
  walletAddress?: string
): Promise<ChatMessage[]> {
  const responses: ChatMessage[] = [];

  // Check for greetings / help
  const lower = userMessage.toLowerCase().trim();
  if (['hello', 'hi', 'hey', 'help', 'start', 'what can you do'].some(g => lower.includes(g))) {
    responses.push({
      id: generateId(),
      role: 'sentinel',
      content: `SENTINEL v1.0 // Security Operations Agent

I monitor and secure cross-chain asset transfers to Solana via the LI.FI protocol. All routes are analyzed through three SOC directives before execution:

DIR-001 > Slippage guard (threshold: 1.5%)
DIR-002 > Asset verification (SOL, USDC, USDT trusted)
DIR-003 > Full transparency report on every route

To initiate a bridge request, use a command like:
"bridge 0.5 ETH from ethereum to SOL"
"swap 100 USDC from polygon to USDT"

${!walletAddress ? '⚠ Connect your Solana wallet to enable transaction signing.' : '✓ Wallet connected: ' + walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4)}`,
      timestamp: new Date(),
    });
    return responses;
  }

  // Parse user intent
  const intent = parseUserIntent(userMessage);

  if (!intent) {
    responses.push({
      id: generateId(),
      role: 'sentinel',
      content: `Unable to parse bridge intent. Please use the format:
"bridge [amount] [token] from [chain] to [token]"

Example: "bridge 1 ETH from ethereum to SOL"
Supported chains: Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche, Base`,
      timestamp: new Date(),
    });
    return responses;
  }

  // Acknowledge and begin processing
  responses.push({
    id: generateId(),
    role: 'system',
    content: `INITIATING SECURITY SCAN // ${intent.amount} ${intent.fromToken} → ${intent.toToken}`,
    timestamp: new Date(),
  });

  try {
    // Determine chain IDs for LI.FI
    const chainMap: Record<string, string> = {
      ethereum: '1', eth: '1',
      polygon: '137', matic: '137',
      bsc: '56', bnb: '56',
      arbitrum: '42161', arb: '42161',
      optimism: '10', op: '10',
      avalanche: '43114', avax: '43114',
      base: '8453',
      solana: 'SOL', sol: 'SOL',
    };

    const tokenAddressMap: Record<string, string> = {
      ETH: '0x0000000000000000000000000000000000000000',
      MATIC: '0x0000000000000000000000000000000000000000',
      BNB: '0x0000000000000000000000000000000000000000',
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      SOL: 'So11111111111111111111111111111111111111112',
    };

    const fromChain = chainMap[intent.fromChain || 'ethereum'] || '1';
    const toChain = 'SOL'; // Always bridging TO Solana

    const fromTokenAddr = tokenAddressMap[intent.fromToken || 'ETH'] || intent.fromToken;
    const toTokenAddr = tokenAddressMap[intent.toToken || 'SOL'] || intent.toToken;

    // Estimate amount in smallest denomination (simplified)
    const decimals = ['USDC', 'USDT'].includes(intent.fromToken || '') ? 6 : 18;
    const fromAmount = (parseFloat(intent.amount || '0') * Math.pow(10, decimals)).toString();

    const quoteData = await fetchLiFiQuote({
      fromChain,
      toChain,
      fromToken: fromTokenAddr,
      toToken: toTokenAddr,
      fromAmount,
      fromAddress: walletAddress || '',
      toAddress: walletAddress || '',
    });

    const parsed = parseLiFiQuoteResponse(quoteData);

    // Run SOC Directives
    const alerts: SecurityAlert[] = [];

    const slippageAlert = checkSlippage(parsed.slippage, parsed.priceImpact);
    if (slippageAlert) alerts.push(slippageAlert);

    const assetAlert = checkAssetVerification(intent.toToken || 'SOL');
    if (assetAlert) alerts.push(assetAlert);

    // Generate Security Report (Directive 3)
    const report = generateSecurityReport(parsed, alerts);

    // Build response messages
    if (alerts.length > 0) {
      for (const alert of alerts) {
        responses.push({
          id: generateId(),
          role: 'sentinel',
          content: '',
          timestamp: new Date(),
          securityAlert: alert,
        });
      }
    }

    // Always include the security report
    responses.push({
      id: generateId(),
      role: 'sentinel',
      content: '',
      timestamp: new Date(),
      securityReport: report,
    });

    // Final recommendation
    const statusText = report.securityStatus === 'safe'
      ? 'ALL DIRECTIVES PASSED. Route is cleared for execution.'
      : report.securityStatus === 'warning'
      ? 'WARNING FLAGS RAISED. Review alerts above before proceeding.'
      : 'ROUTE BLOCKED. Critical security violation detected. Manual override required.';

    responses.push({
      id: generateId(),
      role: 'sentinel',
      content: `SECURITY ASSESSMENT: ${statusText}`,
      timestamp: new Date(),
    });

  } catch (error: any) {
    responses.push({
      id: generateId(),
      role: 'sentinel',
      content: `SCAN FAILED // ${error.message || 'Unable to fetch route data from LI.FI.'}

This may be due to:
- Unsupported token pair or chain
- Insufficient liquidity for the requested amount
- Network connectivity issue

Please verify your parameters and try again.`,
      timestamp: new Date(),
    });
  }

  return responses;
}