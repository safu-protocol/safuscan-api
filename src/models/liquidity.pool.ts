export class LiquidityPool {
  name?: string;
  lp_address?: string;
  pair?: string;
  amount?: number;
  locked?: number;

  constructor(data: any) {
    this.name = data.name;
    this.lp_address = data.lp_address;
    this.pair = data.pair;
    this.amount = data.amount;
    this.locked = data.locked;
  }
}
