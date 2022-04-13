import fetch from "node-fetch"
import { CovalentResponse } from "../models/covalent.response";

export async function getTokenHolders(contractAddress: string) {
    const url = "https://api.covalenthq.com/v1/56" +
    `/tokens/${contractAddress}/token_holders` +
    `/?key=${process.env.COVALENT_API_KEY}` +
    '&page-size=1000000000'

    return await fetch(url)
        .then(res => res.json())
        .then((json: any) => new CovalentResponse(json).data?.items.length);
};