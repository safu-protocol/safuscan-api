export class ERC20ExtensionsStatus {
    burnable: boolean;
    capped: boolean;
    pausable: boolean;
    snapshot: boolean;
    votes: boolean;
    votesComp: boolean;
    wrapper: boolean;
    flashMint: boolean;

    constructor(data: any) {
        this.burnable = data.burnable;
        this.capped = data.capped;
        this.pausable = data.pausable;
        this.snapshot = data.snapshot;
        this.votes = data.votes;
        this.votesComp = data.votesComp;
        this.wrapper = data.wrapper;
        this.flashMint = data.flashMint;
        this.pausable = data.burnable
    };
};