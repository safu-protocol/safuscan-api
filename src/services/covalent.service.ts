import fetch from "node-fetch"
import { CovalentResponse, CovalentTokenHolder } from "../models/covalent.response";

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