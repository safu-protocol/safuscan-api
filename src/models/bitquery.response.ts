export class BitqueryResponse {
    data: SmartChain;

    constructor(data: any) {
        this.data = data.data;
    }
}

class SmartChain {
    ethereum?: SmartChainData;
}

class SmartChainData {
    address?: ContractAddressData[];
}

class ContractAddressData {
    smartContract?: SmartContractData;
}

class AddressData {
    address?: string;
}

export class SmartContractData {
    attributes?: SmartContractAttributes[];
}

export class SmartContractAttributes {
    name?: string;
    type?: string;
    address?: AddressData;
    value?: string;
}