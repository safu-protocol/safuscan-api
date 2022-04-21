import fetch from 'node-fetch';
import { BscScanData } from '../models/bsc-scan.response'

const burnAddressesList: string[] = [
    '0x000000000000000000000000000000000000dead',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000001',
    '0x0000000000000000000000000000000000000005',
    '0x0000000000000000000000000000000000000003',
    '0x0000000000000000000000000000000000000004',
    '0x0000000000000000000000000000000000000002',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0x1111111111111111111111111111111111111111',
    '0xdead000000000000000042069420694206942069',
    '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    '0x6666666666666666666666666666666666666666',
    '0x3333333333333333333333333333333333333333',
    '0x64b00b5ec6df675e94736bdcc006dbd9a0b8b00b',
    '0x8888888888888888888888888888888888888888',
    '0x0000000000000000000000000000000000000008',
    '0x2222222222222222222222222222222222222222',
    '0xffffffffffffffffffffffffffffffffffffffff',
    '0x0000000000000000000000000000000000000007',
    '0x0000000000000000000000000000000000000006',
    '0x0000000000000000000000000000000000000009',
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
];

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

export async function getBurnedTokenAmount(contractAddress: string) {

    const accountBalance = async(burnAddress: string) => (await getAccountBalanceOfToken(contractAddress, burnAddress)).result 

   return burnAddressesList.map(async burnAddress => {
    await new Promise(f => setTimeout(f, 200));
        const balance = await accountBalance(burnAddress);
        if(balance > 0) { 
            return balance
        }
    })[0];
}

export async function getContractSourceCode(contractAddress: string) {
    const url = "https://api.bscscan.com/api" +
    "?module=contract" +
    "&action=getsourcecode" +
    `&address=${contractAddress}` +
    `&apikey=${process.env.BSC_API_KEY}`

    return await fetch(url)
        .then(res => res.json())
        .then(json => new BscScanData(json));
}