import express, { Request, Response } from 'express';
import { getAccountBalanceOfToken, getCirculatingSupply, getTokenTotalSupply, getBurnedTokenAmount, getContractSourceCode, getContractTransactions } from '../services/bsc-scan.service';
import { getTokenHolders } from '../services/covalent.service';
import { getHoneyPotInfo } from '../services/honeypot.service';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


const router = express.Router();

const moralisServerUrl: string = process.env.MORALIS_SERVER_URL!;
const moralisAppId: string = process.env.MORALIS_APP_ID!;
const moralisSecret: string = process.env.MORALIS_SECRET!;

router.get('/api/info', async (req: Request, res: Response) => {
    // 1.1
    // @TODO -> pass token contract address and chain ID (BSC, ETH, Polygon)
    return res.status(200).send(await lookForTokenAndSave(req.body.address));
})

async function lookForTokenAndSave(contractAddress: string) {
    const totalSupply = (await getTokenTotalSupply(contractAddress)).result;
    const circulatingSupply = (await getCirculatingSupply(contractAddress)).result;
    const tokenHoldersAmount = (await getTokenHolders(contractAddress))?.length;
    const honeyPotInfo = (await getHoneyPotInfo(contractAddress)).IsHoneypot;
    await delay(1000);
    const burnedTokens = (await getBurnedTokenAmount(contractAddress));
    await delay(1000);
    const top10Holders = (await getTokenHolders(contractAddress, 10))?.map(tokenHolder => tokenHolder.address);
    const sourceCode = (await getContractSourceCode(contractAddress)).result;
    const creatorAddress = (await getContractTransactions(contractAddress)).result[0]?.from
    return `${await creatorAddress}`
}

export { router as infoRouter };