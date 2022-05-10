import mongoose, { Document, Schema, Model, model, trusted } from 'mongoose'
import { LiquidityPool } from './liquidity.pool'

interface ISafuscanToken {
    token_address: string
    token_name: string
    token_logo?: string
    token_decimals: number
    total_supply: number
    burned_tokens: number
    circulating_supply: number
    number_of_holders: number
    proxy_contract?: boolean
    honeypot?: boolean
    buy_gas_fee?: number
    sell_gas_fee?: number
    buy_tax?: number
    sell_tax?: number
    modify_buy_tax?: boolean
    modify_sell_tax?: boolean
    max_buy_tx?: number
    max_sell_tx?: number
    disable_trading?: boolean
    disable_transfers?: boolean
    token_pause_function?: boolean
    token_ownable?: boolean
    ownership_renounced?: boolean
    token_deployer_address: string
    token_current_owner?: string
    deployer_number_of_deployed_contracts?: number
    deployer_number_of_suspicious_contracts?: number
    deployer_is_mixer?: boolean
    deployer_is_blacklist?: boolean
    dev_wallets?: string[]
    token_mint_function_enabled?: boolean
    dex_liquidity_details?: LiquidityPool[]
    dex_liquidity_total_locked_pct?: number
    top_holders: string[]
    total_score?: number
    conclusion?: string
}

interface apiModelInterface extends Model<TokenDoc> {
    build(attr: ISafuscanToken): TokenDoc
}

interface TokenDoc extends Document {
    token_address: string
    token_name: string
    token_logo?: string
    token_decimals: number
    total_supply: number
    burned_tokens: number
    circulating_supply: number
    number_of_holders: number
    proxy_contract?: boolean
    honeypot?: boolean
    buy_gas_fee?: number
    sell_gas_fee?: number
    buy_tax?: number
    sell_tax?: number
    modify_buy_tax?: boolean
    modify_sell_tax?: boolean
    max_buy_tx?: number
    max_sell_tx?: number
    disable_trading?: boolean
    disable_transfers?: boolean
    token_pause_function?: boolean
    token_ownable?: boolean
    ownership_renounced?: boolean
    token_deployer_address: string
    token_current_owner?: string
    deployer_number_of_deployed_contracts?: number
    deployer_number_of_suspicious_contracts?: number
    deployer_is_mixer?: boolean
    deployer_is_blacklist?: boolean
    dev_wallets?: string[]
    token_mint_function_enabled?: boolean
    dex_liquidity_details?: LiquidityPool[]
    dex_liquidity_total_locked_pct?: number
    top_holders: string[]
    total_score?: number
    conclusion?: string
}

const tokenSchema = new Schema({
    token_address: {
        type: String,
        required: true
    },
    token_name: {
        type: String,
        required: true
    },
    token_logo: {
        type: String,
        required: true
    },
    token_decimals: {
        type: Number,
        required: true
    },
    total_supply: {
        type: Number,
        required: true
    },
    burned_tokens: {
        type: Number,
        required: true
    },
    circulating_supply: {
        type: Number,
        required: true
    },
    number_of_holders: {
        type: Number,
        required: true
    },
    proxy_contract: {
        type: Boolean,
        required: false
    },
    honeypot: {
        type: Boolean,
        required: false
    },
    buy_gas_fee: {
        type: Number,
        required: false
    },
    sell_gas_fee: {
        type: Number,
        required: false
    },
    buy_tax: {
        type: Number,
        required: false
    },
    sell_tax: {
        type: Number,
        required: false
    },
    modify_buy_tax: {
        type: Boolean,
        required: false
    },
    modify_sell_tax: {
        type: Boolean,
        required: false
    },
    max_buy_tx: {
        type: Number,
        required: false
    },
    max_sell_tx: {
        type: Number,
        required: false
    },
    disable_trading: {
        type: Boolean,
        required: false
    },
    disable_transfer: {
        type: Boolean,
        required: false
    },
    token_pause_function: {
        type: Boolean,
        required: false
    },
    token_ownable: {
        type: Boolean,
        required: false
    },
    ownership_renounced: {
        type: Boolean,
        required: false
    },
    token_deployer_address: {
        type: String,
        required: true
    },
    token_current_owner: {
        type: String,
        required: false
    },
    deployer_number_of_deployed_contracts: {
        type: Number,
        required: false
    },
    deployed_number_of_suspicious_contracts: {
        type: Number,
        required: false
    },
    deployer_is_mixer: {
        type: Boolean,
        required: false
    },
    deployer_is_blacklist: {
        type: Boolean,
        required: false
    },
    dev_wallets: {
        type: Array,
        required: false
    },
    token_mint_function_enabled: {
        type: Boolean,
        required: false
    },
    dex_liquidity_details: [{
        name: {
            type: String,
            required: true,
        },
        pair: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    dex_liquidity_total_locked_pct: {
        type: Number,
        required: false
    },
    top_holders: {
        type: Array,
        required: true
    },
    total_score: {
        type: Number,
        required: false
    },
    conclusion: {
        type: String,
        required: false
    }
})

tokenSchema.statics.build = (attr: ISafuscanToken) => {
    return new Token(attr)
}

const Token = model<TokenDoc, apiModelInterface>('Token', tokenSchema)

export { Token }