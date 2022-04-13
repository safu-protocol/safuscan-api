import express, { Request, Response } from 'express';
import { getCirculatingSupply, getTokenTotalSupply } from '../../services/bsc-scan.service';
import { getTokenHolders } from '../../services/covalent.service';

const router = express.Router();

const moralisServerUrl: string = process.env.MORALIS_SERVER_URL!;
const moralisAppId: string = process.env.MORALIS_APP_ID!;
const moralisSecret: string = process.env.MORALIS_SECRET!;

router.get('/api/info', async (req: Request, res: Response) => {
    // 1.1
    // @TODO -> pass token contract address and chain ID (BSC, ETH, Polygon)
    return res.status(200).send(await lookForToken(req.body.address));
})

async function lookForToken(contractAddress: string) {
    const totalSupply = (await getTokenTotalSupply(contractAddress)).result;
    const circulatingSupply = (await getCirculatingSupply(contractAddress)).result;
    const tokenHolders = (await getTokenHolders(contractAddress));
    return `1 ${await totalSupply} 2 ${await circulatingSupply} 3 ${await tokenHolders}`
};

export { router as infoRouter };