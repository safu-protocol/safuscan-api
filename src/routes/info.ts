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

        if(req.query.refresh && req.query.refresh == 'true') {
            return res.status(200).send(await lookForTokenAndSave(tokenAddress));
        }

        const foundToken = await Token.findOne({ token_address: tokenAddress })

        return foundToken != null ?
            res.status(200).send(foundToken) :
            res.status(200).send(await lookForTokenAndSave(tokenAddress));
    }
    return res.status(204).send();
})

async function lookForTokenAndSave(contractAddress: string): Promise<any> {
    const covalentData = (await getTokenHolders(contractAddress))
    
    const tokenName = covalentData[0].contract_name ? covalentData[0].contract_name : 'Unknown token'
    const tokenLogo = covalentData[0].logo_url
    const tokenDecimals = parseInt(covalentData[0].contract_decimals as string)
    const totalSupply = (await getTokenTotalSupply(contractAddress)).result.slice(0, -tokenDecimals)
    const burnedTokens = (await getBurnedTokenAmount(contractAddress)).slice(0, -tokenDecimals);
    const circulatingSupply = totalSupply - burnedTokens;
    const tokenHoldersAmount = covalentData.length;
    const honeyPotInfo = (await getHoneyPotInfo(contractAddress));
    await delay(1000);
    const top10Holders: string[] = ((await getTokenHolders(contractAddress, 10)) as CovalentTokenHolder[]).map(tokenHolder => tokenHolder.address);
    await delay(1000);
    const sourceCode = (await getContractSourceCode(contractAddress)).result;
    const creatorAddress = (await getContractTransactions(contractAddress)).result[0]

    
    const token = Token.build({ 
        token_address: contractAddress,
        token_name: tokenName,
        token_logo: tokenLogo,
        token_decimals: tokenDecimals,
        total_supply: totalSupply, 
        burned_tokens:  burnedTokens, 
        circulating_supply: circulatingSupply, 
        number_of_holders: tokenHoldersAmount,
        proxy_contract: false,
        honeypot: honeyPotInfo.IsHoneypot,
        buy_gas_fee: honeyPotInfo.BuyGas,
        sell_gas_fee: honeyPotInfo.SellGas,
        buy_tax: honeyPotInfo.BuyTax,
        sell_tax: honeyPotInfo.SellTax,
        modify_buy_tax: false,
        modify_sell_tax: false,
        token_deployer_address: creatorAddress.from,
        dev_wallets: [],
        dex_liquidity_details: [],
        top_holders: top10Holders,
        total_score: 97,
        conclusion: 'Trustworthy'
    });
    await token.save();

    return token;
}

export { router as infoRouter };