import express, { Request, Response } from "express";
import {
  getTokenTotalSupply,
  getBurnedTokenAmount,
  getContractSourceCode,
  getContractTransactions,
} from "../services/bsc-scan.service";
import {
  getTokenHolders,
  getDEXLiquidityPools,
} from "../services/covalent.service";
import { getHoneyPotInfo } from "../services/honeypot.service";
import { Token, TokenDoc } from "../models/token";
import { CovalentTokenHolder } from "../models/covalent.response";
import {
  checkForExtensions,
  isTokenMintable,
  isTokenOwnable,
  isTokenPausable,
  isTokenProxyable,
} from "../utils/contract.utils";
import {
  getOwnerAddress,
  getSmartContractAttributes,
  isOwnerRenounced,
} from "../services/bitquery.service";
import { Stats } from "../models/stats";
import Web3 from "web3";

export const burnAddressesList: string[] = [
  "0x000000000000000000000000000000000000dead",
  "0x0000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000001",
  "0x0000000000000000000000000000000000000005",
  "0x0000000000000000000000000000000000000003",
  "0x0000000000000000000000000000000000000004",
  "0x0000000000000000000000000000000000000002",
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0x1111111111111111111111111111111111111111",
  "0xdead000000000000000042069420694206942069",
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "0x6666666666666666666666666666666666666666",
  "0x3333333333333333333333333333333333333333",
  "0x64b00b5ec6df675e94736bdcc006dbd9a0b8b00b",
  "0x8888888888888888888888888888888888888888",
  "0x0000000000000000000000000000000000000008",
  "0x2222222222222222222222222222222222222222",
  "0xffffffffffffffffffffffffffffffffffffffff",
  "0x0000000000000000000000000000000000000007",
  "0x0000000000000000000000000000000000000006",
  "0x0000000000000000000000000000000000000009",
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const router = express.Router();

router.get("/api/info", async (req: Request, res: Response) => {
  if (req.query && req.query.address) {
    const tokenAddress = Web3.utils.toChecksumAddress((req.query as any).address);
    const foundToken = await Token.findOne({
      token_address: tokenAddress,
    });

    if (req.query.refresh && req.query.refresh == "true") {
      return foundToken
        ? res
            .status(200)
            .send(await lookForTokenAndSave(tokenAddress, foundToken))
        : res.status(200).send(await lookForTokenAndSave(tokenAddress));
    }

    if (foundToken != null) {
      const existingTokenPopularity = foundToken.popularity
        ? foundToken.popularity
        : 0;
      await foundToken.updateOne({ popularity: existingTokenPopularity + 1 });
      updateStats();
      return res.status(200).send(foundToken);
    } else {
      return res.status(200).send(await lookForTokenAndSave(tokenAddress));
    }
  }
  return res.status(204).send();
});

async function lookForTokenAndSave(
  contractAddress: string,
  existingToken?: TokenDoc
) {
  const covalentData = await getTokenHolders(contractAddress);
  const contractName = covalentData[0].contract_name
    ? covalentData[0].contract_name
    : "Unknown token";

  const dexLiquidityData = await getDEXLiquidityPools(
    contractAddress,
    contractName
  );

  const tokenLogo = covalentData[0].logo_url;
  const tokenDecimals =
    parseInt(covalentData[0].contract_decimals as string) || 0;
  const totalSupply = (
    await getTokenTotalSupply(contractAddress)
  )?.result.slice(0, -tokenDecimals);
  const burnedTokens =
    parseInt(
      (await getBurnedTokenAmount(contractAddress)).slice(0, -tokenDecimals)
    ) || 0;
  const circulatingSupply = totalSupply - burnedTokens;
  const tokenHoldersAmount = covalentData.length;
  const honeyPotInfo = await getHoneyPotInfo(contractAddress);
  await delay(1000);
  const top10Holders: string[] = (
    (await getTokenHolders(contractAddress, 10)) as CovalentTokenHolder[]
  ).map((tokenHolder) => tokenHolder.address);
  await delay(1000);
  const sourceCode = (await getContractSourceCode(contractAddress))?.result[0]
    .SourceCode;
  const isProxyContract = isTokenProxyable(sourceCode);
  const creatorAddress = (await getContractTransactions(contractAddress))
    ?.result[0];
  const dexLiquidityDetails = dexLiquidityData.liquidityPools;
  const dexLockedLiquidity = dexLiquidityData.lockedPct;
  const tokenOwnable = isTokenOwnable(sourceCode);
  const tokenPausable = isTokenPausable(sourceCode);
  const hasMintFunction = isTokenMintable(sourceCode);
  const getExtensions = checkForExtensions(sourceCode);
  const ownershipRenounced = await isOwnerRenounced(contractAddress);
  const currentOwner = await getOwnerAddress(contractAddress);
  const savedTokenPopularity = existingToken?.popularity
    ? existingToken.popularity
    : 0;

  const token = await Token.findOneAndUpdate(
    {
      token_address: contractAddress,
    },
    {
      token_address: contractAddress,
      token_name: contractName,
      token_logo: tokenLogo,
      token_decimals: tokenDecimals,
      total_supply: totalSupply,
      burned_tokens: burnedTokens,
      circulating_supply: circulatingSupply,
      number_of_holders: tokenHoldersAmount,
      proxy_contract: isProxyContract,
      honeypot: honeyPotInfo?.IsHoneypot,
      buy_gas_fee: honeyPotInfo?.BuyGas,
      sell_gas_fee: honeyPotInfo?.SellGas,
      buy_tax: honeyPotInfo?.BuyTax,
      sell_tax: honeyPotInfo?.SellTax,
      modify_buy_tax: false,
      modify_sell_tax: false,
      token_pause_function: tokenPausable,
      token_ownable: tokenOwnable,
      ownership_renounced: ownershipRenounced,
      token_deployer_address: creatorAddress.from,
      token_current_owner: currentOwner,
      dev_wallets: [],
      token_mint_function_enabled: hasMintFunction,
      dex_liquidity_details: dexLiquidityDetails,
      dex_liquidity_total_locked_pct: dexLockedLiquidity,
      top_holders: top10Holders,
      total_score: 97,
      conclusion: honeyPotInfo?.IsHoneypot != undefined && honeyPotInfo?.IsHoneypot == true ? "Scam": "Trustworthy",
      popularity: savedTokenPopularity + 1,
    },
    {
      upsert: true,
      new: true,
    }
  );

  updateStats();

  return token;
}

async function updateStats() {
  const stats = await Stats.findOne();
  if (stats != null) {
    const apiCalls = stats.total_api_calls;
    await stats.updateOne({ total_api_calls: apiCalls + 1 });
  } else {
    const stats = await Stats.build({ total_api_calls: 1 });
    await stats.save();
  }
}

export { router as infoRouter, lookForTokenAndSave as infoLookForTokenAndSave };
