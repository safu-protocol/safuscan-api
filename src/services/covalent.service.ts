import fetch from "node-fetch"
import { CovalentResponse } from "../models/covalent.response";

export async function getTokenHolders(contractAddress: string, pageSize: number = 1000000000) {
    const url = "https://api.covalenthq.com/v1/56" +
        `/tokens/${contractAddress}/token_holders` +
        `/?key=${process.env.COVALENT_API_KEY}` +
        `&page-size=${pageSize}`

    return await fetch(url)
        .then(res => res.json())
        .then((json: any) => {
            return new CovalentResponse(json).data?.items
        });
};