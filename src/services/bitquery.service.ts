import { burnAddressesList } from "../routes/info";
import fetch from "node-fetch";
import { BitqueryResponse, SmartContractAttributes } from "../models/bitquery.response";

export async function isOwnerRenounced(contractAddress: string): Promise<boolean> {
        const contractOwner = await getOwnerAddress(contractAddress)
        return !!burnAddressesList.find(burnAddress => burnAddress == contractOwner);
}

export async function getOwnerAddress(contractAddress: string): Promise<string | undefined> {
    const smartContractAttr = await getSmartContractAttributes(contractAddress);
    const smartContractData = smartContractAttr?.data?.ethereum?.address
    if (smartContractData != null && smartContractData?.length > 0 && smartContractData[0] != null) {
        return smartContractData[0].smartContract?.attributes?.find((attribute: SmartContractAttributes) =>
            attribute?.name == 'owner')?.address?.address
    } else return undefined
}

export async function getSmartContractAttributes(contractAddress: string): Promise<BitqueryResponse> {
    const query = `
    query {
        ethereum(network: bsc) {
          address(address: {is: "${contractAddress}"}) {
            smartContract {
              attributes {
                name
                type
                address {
                  address
                  annotation
                }
                value
              }
            }
          }
        }
      }
`;
    const url = "https://graphql.bitquery.io/";
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": `${process.env.BITQUERY_API_KEY}`
        },
        body: JSON.stringify({
            query
        })
    };

    return await fetch(url, opts)
        .then(res => res.json())
        .then(json => new BitqueryResponse(json))
}