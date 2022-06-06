import mongoose, { Document, Schema, Model, model, trusted } from 'mongoose'

interface IStats {
    total_api_calls: number
}

interface apiModelInterface extends Model<StatsDoc> {
    build(attr: IStats): StatsDoc
}

interface StatsDoc extends Document {
    total_api_calls: number
}

const statsSchema = new Schema({
    total_api_calls: {
        type: Number,
        required: true
    }
})

statsSchema.statics.build = (attr: IStats) => {
    return new Stats(attr)
}

const Stats = model<StatsDoc, apiModelInterface>('Stats', statsSchema)

export { Stats }