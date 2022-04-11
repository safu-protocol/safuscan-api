import fetch from 'node-fetch';

export async function getTokenTotalSupply(contractAddress: string) {
    const url = "https://api.bscscan.com/api" +
    "?module=stats" +
    "&action=tokensupply" +
    `&contractaddress=${contractAddress}` +
    `&apikey=${process.env.BSC_API_KEY}`

    return await fetch(url).then((response: any) => {
        return response.json ? response.json() : response.text();
    });
};

export async function getCirculatingSupply(contractAddress: string) {
    const url = "https://api.bscscan.com/api" +
    "?module=stats" +
    "&action=tokenCsupply" +
    `&contractaddress=${contractAddress}` +
    `&apikey=${process.env.BSC_API_KEY}`

    return await fetch(url).then((response: any) => {
        return response.json ? response.json() : response.text();
    });
}