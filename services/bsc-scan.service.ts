import fetch from 'node-fetch';
import { BscScanData } from '../models/bsc-scan.response'

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