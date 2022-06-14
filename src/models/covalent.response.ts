export class CovalentResponse {
  data?: ApiInfo;

  constructor(data?: any) {
    this.data = data.data;
  }
}

class ApiInfo {
  updated_at?: Date;
  items: any[] = [];
  pagination: any;
  error: boolean = true;
  error_message?: string;
  error_code?: string;
}

export class CovalentTokenHolder {
  contract_decimals?: string;
  contract_name?: string;
  contract_ticker_symbol?: string;
  contract_address?: string;
  supports_erc?: string;
  logo_url?: string;
  address!: string;
  balance?: string;
  total_supply?: string;
  block_height?: string;
}

class LiquidityPoolDetails {
  exchange?: string;
  swap_count_24h?: number;
  total_liquidity_quote?: string;
  volume_24h_quote?: string;
  fee_24h_quote?: string;
  total_supply?: string;
  quote_rate?: string;
  block_height?: number;
  token_0?: LiquidityPoolTokenDetails;
  token_1?: LiquidityPoolTokenDetails;
  chain_name?: string;
  dex_name?: string;
  volume_7d_quote?: string;
  annualized_fee?: string;
}

class LiquidityPoolTokenDetails {
  contract_address?: string;
  contract_name?: string;
  volume_in_24h?: string;
  volume_out_24h?: string;
  quote_rate?: string;
  reserve?: string;
  logo_url?: string;
  contract_ticker_symbol?: string;
  contract_decimals?: number;
  volume_in_7d?: string;
  volume_out_7d?: string;
}
