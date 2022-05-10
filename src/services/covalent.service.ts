import fetch from "node-fetch"
import { CovalentResponse, CovalentTokenHolder } from "../models/covalent.response";
import { LiquidityPool } from "../models/liquidity.pool";
import { LiquidityPoolsStats } from "../models/liquidity.pool.stats";

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

export async function getDEXLiquidityPools(contractAddress: string): Promise<LiquidityPoolsStats> {
    const uniswap = await getLiquidityPool(contractAddress, 'uniswap_v2');
    const pancakeSwap = await getLiquidityPool(contractAddress, 'pancakeswap_v2');
    const sushiswap = await getLiquidityPool(contractAddress, 'sushiswap');

    const result = [uniswap, pancakeSwap, sushiswap].filter((exchangeData: LiquidityPool|null) => exchangeData != null);

    let totalSupply = 0;
    let totalLocked = 0;

    result.forEach((pool: LiquidityPool | null) => { 
        pool?.locked ? totalLocked += pool.locked : console.log('locked amount missing');
        pool?.amount ? totalSupply += pool.amount : console.log('total amount missing') 
    });

    return new LiquidityPoolsStats({
        liquidityPools: result,
        locked: (totalLocked / totalSupply) * 100 
    }) 
}

async function getLiquidityPool(contractAddress: string, exchange: string): Promise<LiquidityPool|null> {
    const url = "https://api.covalenthq.com/v1/56" +
        `/networks/${exchange}/assets` +
        `/?quote-currency=BNB&format=JSON&contract-addresses=${contractAddress}` +
        `&key=${process.env.COVALENT_API_KEY}`

    const result = await fetch(url)
        .then(res => res.json())
        .then((json: any) => {
            return json.data != null ? new CovalentResponse(json).data!.items[0] : null
        });

    if (result == null) return null;

    return new LiquidityPool({
        name: exchange,
        pair: result.token_1.contract_ticker_symbol + '/' + result.token_0.contract_ticker_symbol,
        amount: parseInt(result.total_supply.slice(0, -result.token_1.contract_decimals)),
        locked: parseInt(result.token_1.reserve.slice(0, -result.token_1.contract_decimals))
    })
}