export class BitqueryResponse {
    ethereum: SmartChainData;

    constructor(data: any) {
        this.ethereum = data.ethereum;
    }
}

class SmartChainData {
    address?: AddressData[];
}

class AddressData {
    smartContract?: SmartContractData;
}

export class SmartContractData {
    attributes?: SmartContractAttributes[];
}

export class SmartContractAttributes {
    name?: string;
    type?: string;
    address?: string;
    value?: string;
}