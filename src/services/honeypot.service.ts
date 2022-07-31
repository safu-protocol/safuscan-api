import { HoneyPotData } from "../models/honeypot.response";
import fetch from "node-fetch";

export async function getHoneyPotInfo(
  contractAddress: string
): Promise<HoneyPotData | null> {
  const url =
    "https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot" +
    `?chain=bsc2&token=${contractAddress}`;

  return await fetch(url)
    .then((res) => res.json())
    .then((json) => new HoneyPotData(json))
    .catch((err) => {
      console.error(err);
      return null;
    });
}
