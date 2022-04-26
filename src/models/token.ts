import mongoose, { Document, Schema, Model, model, trusted } from 'mongoose'

interface ISafuscanToken {
    token_address: String 
    total_supply: Number
    burned_tokens: Number
    circulating_supply: Number
    number_of_holders: Number
    proxy_contract?: Boolean
    honeypot?: Boolean
    buy_gas_fee?: Number
    sell_gas_fee?: Number
    buy_tax?: Number
    sell_tax?: Number
    modify_buy_tax?: Boolean
    modify_sell_tax?: Boolean
    max_buy_tx?: Number
    max_sell_tx?: Number
    disable_trading?: Boolean
    disable_transfers?: Boolean
    token_pause_function?: Boolean
    ownership_renounced?: Boolean
    token_deployer_address: String
    token_current_owner?: String
    deployer_number_of_deployed_contracts?: Number
    deployer_number_of_suspicious_contracts?: Number
    deployer_is_mixer?: Boolean
    deployer_is_blacklist?: Boolean
    dev_wallets?: String[]
    token_mint_function_enabled?: Boolean
    dex_liquidity_details?: String[]
    dex_liquidity_total_locked_pct?: number
    top_holders: String[]
    total_score?: Number
    conclusion?: String
}

interface apiModelInterface extends Model<TokenDoc> {
    build(attr: ISafuscanToken): TokenDoc
}

interface TokenDoc extends Document {
    token_address: String 
    total_supply: Number
    burned_tokens: Number
    circulating_supply: Number
    number_of_holders: Number
    proxy_contract?: Boolean
    honeypot?: Boolean
    buy_gas_fee?: Number
    sell_gas_fee?: Number
    buy_tax?: Number
    sell_tax?: Number
    modify_buy_tax?: Boolean
    modify_sell_tax?: Boolean
    max_buy_tx?: Number
    max_sell_tx?: Number
    disable_trading?: Boolean
    disable_transfers?: Boolean
    token_pause_function?: Boolean
    ownership_renounced?: Boolean
    token_deployer_address: String
    token_current_owner?: String
    deployer_number_of_deployed_contracts?: Number
    deployer_number_of_suspicious_contracts?: Number
    deployer_is_mixer?: Boolean
    deployer_is_blacklist?: Boolean
    dev_wallets?: String[]
    token_mint_function_enabled?: Boolean
    dex_liquidity_details?: String[]
    dex_liquidity_total_locked_pct?: number
    top_holders: String[]
    total_score?: Number
    conclusion?: String
}

const tokenSchema = new Schema({
    token_address: {
        type: String,
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
        type: Boolean,
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
    dex_liquidity_details: {
        type: Array,
        required: false
    },
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