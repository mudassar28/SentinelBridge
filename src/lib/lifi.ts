import type { LiFiQuoteRequest } from './types';

const LIFI_API_BASE = 'https://li.quest/v1';
const DUMMY_ADDR = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const DUMMY_SOL_ADDR = '7PshV369f9WszNszNszNszNszNszNszNszNszNszNsz';

export async function fetchLiFiQuote(request: LiFiQuoteRequest) {
  const params = new URLSearchParams({
    fromChain: request.fromChain,
    toChain: request.toChain,
    fromToken: request.fromToken,
    toToken: request.toToken,
    fromAmount: request.fromAmount,
  });

  const fromAddr = request.fromAddress?.trim() || DUMMY_ADDR;
  params.set('fromAddress', fromAddr);

  const isSolDest = ['sol', 'solana', '1151111081099710'].includes(
    request.toChain?.toLowerCase()
  );
  const toAddr = request.toAddress?.trim() || (isSolDest ? DUMMY_SOL_ADDR : fromAddr);
  params.set('toAddress', toAddr);

  const response = await fetch(`${LIFI_API_BASE}/quote?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `LI.FI API error: ${response.status}`
    );
  }

  return response.json();
}

export async function fetchSupportedChains() {
  const response = await fetch(`${LIFI_API_BASE}/chains`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to fetch supported chains');
  return response.json();
}

export async function fetchTokens(chain: string) {
  const response = await fetch(`${LIFI_API_BASE}/tokens?chains=${chain}`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to fetch tokens');
  return response.json();
}

export function parseLiFiQuoteResponse(data: any) {
  const estimate = data.estimate || {};
  const action = data.action || {};

  const fromAmount = action.fromAmount
    ? (parseFloat(action.fromAmount) / Math.pow(10, action.fromToken?.decimals || 18)).toFixed(6)
    : '0';

  const toAmount = estimate.toAmount
    ? (parseFloat(estimate.toAmount) / Math.pow(10, estimate.toAmountMin ? action.toToken?.decimals || 18 : 18)).toFixed(6)
    : '0';

  const slippage = estimate.slippage ? parseFloat(estimate.slippage) * 100 : 0;

  const gasCosts = estimate.gasCosts || [];
  const totalGasUSD = gasCosts.reduce(
    (sum: number, cost: any) => sum + (parseFloat(cost.amountUSD) || 0),
    0
  );

  const feeCosts = estimate.feeCosts || [];
  const totalFeesUSD = feeCosts.reduce(
    (sum: number, cost: any) => sum + (parseFloat(cost.amountUSD) || 0),
    0
  );

  const steps = data.includedSteps || [data];
  const providers = steps.map(
    (step: any) => step.toolDetails?.name || step.tool || 'Unknown'
  );

  const routeSteps = steps.map((step: any) => ({
    type: step.type || 'bridge',
    tool: step.toolDetails?.name || step.tool || 'Unknown',
    fromChain: step.action?.fromChainId?.toString() || action.fromChainId?.toString() || '',
    toChain: step.action?.toChainId?.toString() || action.toChainId?.toString() || '',
    fromToken: step.action?.fromToken?.symbol || action.fromToken?.symbol || '',
    toToken: step.action?.toToken?.symbol || action.toToken?.symbol || '',
  }));

  const priceImpact = estimate.priceImpact
    ? Math.abs(parseFloat(estimate.priceImpact))
    : 0;

  const executionDuration = estimate.executionDuration || 0;
  const minutes = Math.ceil(executionDuration / 60);

  return {
    fromAmount,
    toAmount,
    slippage,
    priceImpact,
    totalGasUSD: totalGasUSD.toFixed(2),
    totalFeesUSD: (totalGasUSD + totalFeesUSD).toFixed(2),
    providers: [...new Set(providers)] as string[],
    routeSteps,
    estimatedTime: minutes > 0 ? `~${minutes} min` : 'Instant',
    sourceChain: action.fromToken?.chainId?.toString() || '',
    destinationChain: action.toToken?.chainId?.toString() || '',
    sourceToken: action.fromToken?.symbol || '',
    destinationToken: action.toToken?.symbol || '',
    raw: data,
  };
}