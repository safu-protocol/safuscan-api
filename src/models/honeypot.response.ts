export class HoneyPotData {
  BuyGas?: number;
  BuyTax?: number;
  Error?: boolean;
  IsHoneypot?: false;
  MaxTxAmount?: number;
  MaxTxAmountBNB?: number;
  SellGas?: number;
  SellTax?: number;

  constructor(data?: any) {
    this.BuyGas = data.BuyGas;
    this.BuyTax = data.BuyTax;
    this.Error = data.Error;
    this.IsHoneypot = data.IsHoneypot;
    this.MaxTxAmount = data.MaxTxAmount;
    this.MaxTxAmountBNB = data.MaxTxAmountBNB;
    this.SellGas = data.SellGas;
    this.SellTax = data.SellTax;
  }
}
