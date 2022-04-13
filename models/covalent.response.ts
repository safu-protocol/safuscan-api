export class CovalentResponse {
    data?: ApiInfo


    constructor(data?: any) {
        this.data = data.data;
    };
}

class ApiInfo {
    updated_at?: Date;
    items: CovalentTokenHolder[] = [];
    pagination: any;
    error: boolean = true;
    error_message?: string;
    error_code?: string;
}

class CovalentTokenHolder {
    contract_decimals?: string;
    contract_name?: string;
    contract_ticker_symbol?: string;
    contract_address?: string;
    supports_erc?: string;
    logo_url?: string;
    address?: string;
    balance?: string;
    total_supply?: string;
    block_height?: string;
}
