import fetch from "node-fetch"
import { CovalentResponse, CovalentTokenHolder, LiquidityPoolDetails } from "../models/covalent.response";
import { LiquidityPool } from "../models/liquidity.pool";

export async function getTokenHolders(contractAddress: string, pageSize: number = 1000000000): Promise<CovalentTokenHolder[]> {
    const url = "https://api.covalenthq.com/v1/56" +
    `/tokens/${contractAddress}/token_holders` +
    `/?key=${process.env.COVALENT_API_KEY}` +
    `&page-size=${pageSize}`

    return await fetch(url)
        .then(res => res.json())
        .then((json: any) => { 
            return json.data != null ? new CovalentResponse(json).data!.items : [] 
        });
};

export async function getTransactionHistory(contractAddress: string) {
    const url = "https://api.covalenthq.com/v1/56" +
    `/address/${contractAddress}/transactions_v2` +
    `/?key=${process.env.COVALENT_API_KEY}` +
    `&page-size=1`

    return await fetch(url)
        .then(res => res.json())
        .then((json: any) => { 
            return json.data != null ? new CovalentResponse(json).data!.items : [] 
        });
}

export async function getDEXLiquidityPools(contractAddress: string) {
    const uniswap = await getUniswapLiquidityPool(contractAddress);
    const pancakeSwap = await getPancakeSwapLiquidityPool(contractAddress);
    const sushiswap = await getSushiSwapLiquidityPool(contractAddress);

    return [uniswap, pancakeSwap, sushiswap]
}

async function getUniswapLiquidityPool(contractAddress: string): Promise<LiquidityPool> {
    const url = "https://api.covalenthq.com/v1/56" +
    `/networks/uniswap_v2/assets` +
    `/?quote-currency=BNB&format=JSON&tickers=&contract-addresses=${contractAddress}` +
    `&key=${process.env.COVALENT_API_KEY}`

    const result = await fetch(url)
        .then(res => res.json())
        .then((json: any) => { 
            return json.data != null ? new CovalentResponse(json).data!.items[0] : new CovalentResponse()
        });

    return new LiquidityPool({
        name: result.exchange,
        pair: result.token_1.contract_ticker_symbol + '/' + result.token_0.contract_ticker_symbol,
        amount: result.total_supply.slice(0, -result.token_1.contract_decimals) 
    })
}

async function getPancakeSwapLiquidityPool(contractAddress: string): Promise<LiquidityPool> {
    const url = "https://api.covalenthq.com/v1/56" +
    `/networks/pancakeswap_v2/assets` +
    `/?quote-currency=BNB&format=JSON&tickers=&contract-addresses=${contractAddress}` +
    `&key=${process.env.COVALENT_API_KEY}`

    const result = await fetch(url)
        .then(res => res.json())
        .then((json: any) => { 
            return json.data != null ? new CovalentResponse(json).data!.items[0] : new CovalentResponse()
        });

    return new LiquidityPool({
        name: result.exchange,
        pair: result.token_1.contract_ticker_symbol + '/' + result.token_0.contract_ticker_symbol,
        amount: result.total_supply.slice(0, -result.token_1.contract_decimals) 
    })
}

export async function getSushiSwapLiquidityPool(contractAddress: string): Promise<LiquidityPool> {
    const url = "https://api.covalenthq.com/v1/56" +
    `/networks/sushiswap/assets` +
    `/?quote-currency=BNB&format=JSON&tickers=&contract-addresses=${contractAddress}` +
    `&key=${process.env.COVALENT_API_KEY}`

    console.log(url);

    const result = await fetch(url)
        .then(res => res.json())
        .then((json: any) => { 
            return json.data != null ? new CovalentResponse(json).data!.items[0] : new CovalentResponse()
        });

    return new LiquidityPool({
        name: result.exchange,
        pair: result.token_1.contract_ticker_symbol + '/' + result.token_0.contract_ticker_symbol,
        amount: result.total_supply.slice(0, -result.token_1.contract_decimals) 
    })
}