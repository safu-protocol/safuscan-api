import express, { Request, Response } from 'express'
import { Token } from '../../models/token'

const router = express.Router()

router.get('/api/info', async (req: Request, res: Response) => {
    // @TODO -> pass token contract address and chain ID (BSC, ETH, Polygon)
    const tokenInfo = await Token.find({})
    return res.status(200).send(tokenInfo)
})

router.post('/api/info', async (req: Request, res: Response) => {
    const { total_supply, burned_tokens } = req.body;

    const tokenAdd = Token.build({ total_supply, burned_tokens })
    await tokenAdd.save()
    return res.status(201).send(tokenAdd)
})

export { router as infoRouter }