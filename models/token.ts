import mongoose from 'mongoose'

interface ISafuscanToken {
    total_supply: Number;
    burned_tokens: Number;
}

interface apiModelInterface extends mongoose.Model<TokenDoc> {
    build(attr: ISafuscanToken): TokenDoc
}

interface TokenDoc extends mongoose.Document {
    total_supply: Number;
    burned_tokens: Number;
}

const tokenSchema = new mongoose.Schema({
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

const Token = mongoose.model<TokenDoc, apiModelInterface>('Token', tokenSchema)

Token.build({
    total_supply: 1000,
    burned_tokens: 500
})

export { Token }




