import express, { Request, Response } from 'express';
import Moralis from 'moralis/node';
import { getCirculatingSupply, getTokenTotalSupply } from '../../services/bsc-scan.service';

const router = express.Router();

const moralisServerUrl: string = process.env.MORALIS_SERVER_URL!;
const moralisAppId: string = process.env.MORALIS_APP_ID!;
const moralisSecret: string = process.env.MORALIS_SECRET!;

router.get('/api/info', async (req: Request, res: Response) => {
    // 1.1
    // @TODO -> pass token contract address and chain ID (BSC, ETH, Polygon)
    return res.status(200).send(await lookForToken(req.body.address));
})

// router.post('/api/info', async (req: Request, res: Response) => {
    // 1.2
    // @TODO -> if the token info doesn't exist, query Moralis API, BSCscan and save the required data!
//     const { total_supply, burned_tokens } = req.body

//     const tokenAdd = Token.build({ total_supply, burned_tokens });
//     await tokenAdd.save();
//     return res.status(201).send(tokenAdd);
// })

async function lookForToken(contractAddress: string) {
    const metadata = await Moralis.Web3API.token.getTokenMetadata({
        addresses: [contractAddress],
        chain: "bsc"
    }).catch(console.error);
    const totalSupply = await getTokenTotalSupply(contractAddress);
    const circulatingSupply = await getCirculatingSupply(contractAddress);
};

(async () => {
    await Moralis.start({ serverUrl: moralisServerUrl, appId: moralisAppId, moralisSecret: moralisSecret });
    console.log('Connected to API');
})();

export { router as infoRouter };