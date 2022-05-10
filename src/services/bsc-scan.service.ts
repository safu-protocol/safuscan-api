import fetch from 'node-fetch';
import { BscScanData } from '../models/bsc-scan.response'
import { burnAddressesList } from '../routes/info';

export async function getTokenTotalSupply(contractAddress: string): Promise<BscScanData> {
    const url = "https://api.bscscan.com/api" +
        "?module=stats" +
        "&action=tokensupply" +
        `&contractaddress=${contractAddress}` +
        `&apikey=${process.env.BSC_API_KEY}`

    return await fetch(url)
        .then(res => res.json())
        .then(json => new BscScanData(json));
};

export async function getCirculatingSupply(contractAddress: string): Promise<BscScanData> {
    const url = "https://api.bscscan.com/api" +
        "?module=stats" +
        "&action=tokenCsupply" +
        `&contractaddress=${contractAddress}` +
        `&apikey=${process.env.BSC_API_KEY}`

    return await fetch(url)
        .then(res => res.json())
        .then(json => new BscScanData(json));
}

export async function getAccountBalanceOfToken(contractAddress: string, accountAddress: string): Promise<BscScanData> {
    const url = "https://api.bscscan.com/api" +
        "?module=account" +
        "&action=tokenbalance" +
        `&contractaddress=${contractAddress}` +
        `&address=${accountAddress}` +
        `&apikey=${process.env.BSC_API_KEY}`

    return await fetch(url)
        .then(res => res.json())
        .then(json => new BscScanData(json));
}

export async function getBurnedTokenAmount(contractAddress: string): Promise<string> {

    const accountBalance = async (burnAddress: string) => (await getAccountBalanceOfToken(contractAddress, burnAddress)).result

    return burnAddressesList.map(async (burnAddress, index) => {
        await new Promise(resolve => setTimeout(resolve, 300 * index));
        const balance = await accountBalance(burnAddress);
        if (balance > 0) {
            return balance
        }
    }
    )[0];
}

export async function getContractSourceCode(contractAddress: string): Promise<BscScanData> {
    const url = "https://api.bscscan.com/api" +
        "?module=contract" +
        "&action=getsourcecode" +
        `&address=${contractAddress}` +
        `&apikey=${process.env.BSC_API_KEY}`

    return await fetch(url)
        .then(res => res.json())
        .then(json => new BscScanData(json));
}

export async function getContractTransactions(contractAddress: string): Promise<BscScanData> {
    const url = "https://api.bscscan.com/api" +
        "?module=account" +
        "&action=txlist" +
        `&address=${contractAddress}` +
        "&startblock=0" +
        "&endblock=99999999" +
        "&page=1" +
        "&offset=1"
        "&sort=asc" +
        `&apikey=${process.env.BSC_API_KEY}`

    return await fetch(url)
        .then(res => res.json())
        .then(json => new BscScanData(json));
}