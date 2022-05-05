export class LiquidityPool {
    name: string;
    pair: string;
    amount: string;

    constructor(data: any) {
        this.name = data.name;
        this.pair = data.pair;
        this.amount = data.pair;
    }
}