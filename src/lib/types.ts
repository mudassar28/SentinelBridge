export type SecurityStatus = 'safe' | 'warning' | 'blocked';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type MessageRole = 'user' | 'sentinel' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  securityAlert?: SecurityAlert;
  securityReport?: SecurityReport;
  isTyping?: boolean;
}

export interface SecurityAlert {
  severity: AlertSeverity;
  directive: string;
  title: string;
  description: string;
  details?: string;
  requiresConfirmation?: boolean;
}

export interface SecurityReport {
  route: RouteInfo;
  providers: string[];
  networkFees: string;
  slippage: number;
  priceImpact: number;
  securityStatus: SecurityStatus;
  estimatedTime: string;
  sourceChain: string;
  destinationChain: string;
  sourceToken: string;
  destinationToken: string;
  inputAmount: string;
  outputAmount: string;
}

export interface RouteInfo {
  steps: RouteStep[];
  totalSteps: number;
}

export interface RouteStep {
  type: 'swap' | 'bridge' | 'transfer';
  tool: string;
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
}

export interface LiFiQuoteRequest {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromAddress?: string;
  toAddress?: string;
}

export interface AuditLogEntry {
  id?: string;
  timestamp: string;
  request: LiFiQuoteRequest;
  securityStatus: SecurityStatus;
  alerts: SecurityAlert[];
  userDecision: 'approved' | 'rejected' | 'pending';
  walletAddress?: string;
}

// Verified high-liquidity tokens on Solana
export const VERIFIED_SOLANA_TOKENS: Record<string, string> = {
  'SOL': 'So11111111111111111111111111111111111111112',
  'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'USDT': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

// Chain ID mapping for LI.FI
export const CHAIN_IDS: Record<string, number | string> = {
  'ethereum': 1,
  'polygon': 137,
  'bsc': 56,
  'arbitrum': 42161,
  'optimism': 10,
  'avalanche': 43114,
  'solana': 'SOL',
  'base': 8453,
};

export const CHAIN_NAMES: Record<string | number, string> = {
  1: 'Ethereum',
  137: 'Polygon',
  56: 'BNB Chain',
  42161: 'Arbitrum',
  10: 'Optimism',
  43114: 'Avalanche',
  'SOL': 'Solana',
  8453: 'Base',
};
