import { LiquidityPool } from "./liquidity.pool";

export class LiquidityPoolsStats {
    liquidityPools: LiquidityPool[] | undefined;
    lockedPct: number | undefined;

    constructor(data: any) {
        this.liquidityPools = data.liquidityPools;
        this.lockedPct = data.lockedPct;
    }
}