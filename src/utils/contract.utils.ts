import { ERC20ExtensionsStatus } from "../models/erc20.extensions.status";

export function checkForExtensions(contractSource: string): ERC20ExtensionsStatus {
    const extensionsUsed: {[extension: string]: boolean} = {};

    ERC20Extensions.forEach((extension: string) => {
        extensionsUsed[extension] = contractSource.includes(extension)
    });

    return new ERC20ExtensionsStatus({
        burnable: extensionsUsed['ERC20Burnable'],
        capped: extensionsUsed['ERC20Capped'],
        pausable: extensionsUsed['ERC20Pausable'] || isTokenPausable(contractSource),
        snapshot: extensionsUsed['ERC20Snapshot'],
        votes: extensionsUsed['ERC20Votes'],
        votesComp: extensionsUsed['ERC20VotesComp'],
        wrapper: extensionsUsed['ERC20Wrapper'],
        flashMint: extensionsUsed['ERC20FlashMint'],
    });
}

export const isTokenOwnable = (contractSource: string) => !!contractSource.match('\s+is.*Ownable.*\{')

export const isTokenMintable = (contractSource: string) => !!contractSource.match('\s+_mint(.*\)')

export const isTokenPausable = (contractSource: string) => !!contractSource.match('\s+is.*Pausable.*\{')

export const isTokenProxyable = (contractSource: string) => !!contractSource.match('\s+is.*Proxy.*\{')

const ERC20Extensions: string[] = [
    'ERC20Burnable',
    'ERC20Capped',
    'ERC20Pausable',
    'ERC20Snapshot',
    'ERC20Votes',
    'ERC20VotesComp',
    'ERC20Wrapper',
    'ERC20FlashMint'
];
