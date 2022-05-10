export class LiquidityPool {
    name?: string;
    pair?: string;
    amount?: number;
    locked?: number;

    constructor(data: any) {
        this.name = data.name;
        this.pair = data.pair;
        this.amount = data.amount;
        this.locked = data.locked;
    }
}