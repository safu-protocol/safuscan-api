import express, { Request, Response } from 'express';
import { getTokenTotalSupply, getBurnedTokenAmount, getContractSourceCode, getContractTransactions } from '../services/bsc-scan.service';
import { getTokenHolders } from '../services/covalent.service';
import { getHoneyPotInfo } from '../services/honeypot.service';
import { Token } from '../models/token';
import { CovalentTokenHolder } from '../models/covalent.response';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const router = express.Router();

router.get('/api/info', async (req: Request, res: Response) => {
    if (req.query && req.query.address) {
        const tokenAddress = (req.query as any).address;
        const foundToken = await Token.find({ token_address: tokenAddress })

        return foundToken.length != 0 ?
            res.status(200).send(foundToken[0]) :
            res.status(200).send(await lookForTokenAndSave(tokenAddress));
    }
    return res.status(204).send();
})

async function lookForTokenAndSave(contractAddress: string): Promise<any> {
    const totalSupply = (await getTokenTotalSupply(contractAddress)).result;
    const burnedTokens = (await getBurnedTokenAmount(contractAddress));
    const circulatingSupply = totalSupply - burnedTokens;
    const tokenHoldersAmount = (await getTokenHolders(contractAddress)).length;
    const honeyPotInfo = (await getHoneyPotInfo(contractAddress)).IsHoneypot;
    await delay(1000);
    const top10Holders: string[] = ((await getTokenHolders(contractAddress, 10)) as CovalentTokenHolder[]).map(tokenHolder => tokenHolder.address);
    await delay(1000);
    const sourceCode = (await getContractSourceCode(contractAddress)).result;
    const creatorAddress = (await getContractTransactions(contractAddress)).result[0]?.from
    
    const token = Token.build({ 
        token_address: contractAddress,
        total_supply: totalSupply, 
        burned_tokens: burnedTokens, 
        circulating_supply: circulatingSupply, 
        number_of_holders: tokenHoldersAmount,
        honeypot: honeyPotInfo,
        top_holders: top10Holders,
        token_deployer_address: creatorAddress
    })
    await token.save();

    return new Token({
        token_address: contractAddress,
        total_supply: totalSupply, 
        burned_tokens:  burnedTokens, 
        circulating_supply: circulatingSupply, 
        number_of_holders: tokenHoldersAmount,
        honeypot: honeyPotInfo,
        top_holders: top10Holders,
        token_deployer_address: creatorAddress
    });
}

export { router as infoRouter };