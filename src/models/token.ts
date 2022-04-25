import mongoose, { Document, Schema, Model, model } from 'mongoose'

interface ISafuscanToken {
    total_supply: Number
    burned_tokens: Number
}

interface apiModelInterface extends Model<TokenDoc> {
    build(attr: ISafuscanToken): TokenDoc
}

interface TokenDoc extends Document {
    total_supply: Number
    burned_tokens: Number
}

const tokenSchema = new Schema({
    total_supply: {
        type: Number,
        required: true
    },
    burned_tokens: {
        type: Number,
        required: true
    }
})

tokenSchema.statics.build = (attr: ISafuscanToken) => {
    return new Token(attr)
}

const Token = model<TokenDoc, apiModelInterface>('Token', tokenSchema)

export { Token }