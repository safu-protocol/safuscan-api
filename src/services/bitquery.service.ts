import { burnAddressesList } from "../routes/info";
import fetch from "node-fetch";
import { BitqueryResponse } from "../models/bitquery.response";
import { SmartContractAttributes, SmartContractData } from "../models/bitquery.response";

export async function isOwnerRenounced(contractAddress: string): Promise<boolean> {
    const smartContractAttr = await getSmartContractAttributes(contractAddress);
    if (smartContractAttr?.ethereum?.address?.length > 0 && smartContractAttr.ethereum.address[0] != null) {
    const contractOwner = smartContractAttr.ethereum.address.smartContract?.attributes?.find((attribute: SmartContractAttributes) => attribute.name == "owner" || "_owner" || "getOwner")
    console.log(contractOwner);
    return !!burnAddressesList.find(burnAddress => burnAddress == contractOwner);
    } else return false
}

export async function getSmartContractAttributes(contractAddress: string): Promise<any> {
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
    .then(json => { 
        console.log(json.ethereum.address.attributes)
        return new BitqueryResponse(json) })
}