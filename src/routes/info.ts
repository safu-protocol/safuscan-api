import express, { Request, Response } from 'express';
import { getAccountBalanceOfToken, getCirculatingSupply, getTokenTotalSupply, getBurnedTokenAmount, getContractSourceCode } from '../services/bsc-scan.service';
import { getTokenHolders } from '../services/covalent.service';
import { getHoneyPotInfo } from '../services/honeypot.service';

const router = express.Router();

const moralisServerUrl: string = process.env.MORALIS_SERVER_URL!;
const moralisAppId: string = process.env.MORALIS_APP_ID!;
const moralisSecret: string = process.env.MORALIS_SECRET!;

router.get('/api/info', async (req: Request, res: Response) => {
    // 1.1
    // @TODO -> pass token contract address and chain ID (BSC, ETH, Polygon)
    console.log("Received token address: " + req.body.address);
    return res.status(200).send(await lookForToken(req.body.address));
})

async function lookForToken(contractAddress: string) {
    const totalSupply = (await getTokenTotalSupply(contractAddress)).result;
    const circulatingSupply = (await getCirculatingSupply(contractAddress)).result;
    const tokenHoldersAmount = (await getTokenHolders(contractAddress))?.length;
    const honeyPotInfo = (await getHoneyPotInfo(contractAddress)).IsHoneypot;
    await new Promise(res => setTimeout(res, 1000));
    const burnedTokens = (await getBurnedTokenAmount(contractAddress));
    const top10Holders = (await getTokenHolders(contractAddress, 10))?.map(tokenHolder => tokenHolder.address);
    const sourceCode = (await getContractSourceCode(contractAddress)).result;
    return `${await sourceCode}`
}

export { router as infoRouter };