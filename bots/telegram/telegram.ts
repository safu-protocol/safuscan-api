import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { Token } from '../../src/models/token';
import { infoLookForTokenAndSave } from '../../src/routes/info';
import Web3 from "web3";

// Telegram BOT libraries
import { Context, Telegraf, Markup } from 'telegraf';
import { Update } from 'typegram';

const app = express();
app.use(json());

// Load .env variables
dotenv.config();

mongoose.connect(
    process.env.MONGO_AUTH_URL!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions
)
    .then(result => console.log('Connected to database'))
    .catch(err => console.log(err));

// Initialize the bot
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

console.log(bot);

bot.start((ctx) => {
    return ctx.replyWithHTML(
        'Welcome to <b>SAFUSCAN</b> by <i>SAFU.net</i>',
        Markup.keyboard([
            ['❓ More Information', '👥 Network', '⭐️ Scan Token']
        ])
            .oneTime()
            .resize()
    );
});

bot.command('help', async (ctx) => {
    return await ctx.reply('Select default network',
        Markup.keyboard([
            ['❓ More Information', '👥 Network', '⭐️ Scan Token']
        ])
            .oneTime()
            .resize()
    )
});

bot.command('network', (ctx) => {
    ctx.reply(
        'Set a default network for scans.',
        Markup.inlineKeyboard([
            Markup.button.callback('BSC', 'bsc'),
            Markup.button.callback('ETH', 'eth'),
            Markup.button.callback('Polygon', 'matic'),
        ])
    );
});

bot.on('text', (ctx) => {

    if (ctx.message.text == "❓ More Information") {
        ctx.reply('SAFUSCAN is a code analysis tool and rug detector for token smart contracts!');
    }

    if (ctx.message.text == "👥 Network") {
        ctx.reply('Currently active network is BSC - Binance Smart Chain.');
    }

    if (ctx.message.text == "⭐️ Scan Token") {
        ctx.reply('Please enter the token contract address to scan! \nIt should start with 0x!');
    }

    else {
        // Make sure we start with 0x
        if (ctx.message.text.substring(0, 2) == "0x") {
            scanForToken(ctx.message.text, ctx);
        }
    }

});

bot.launch();

async function scanForToken(token_address: string, ctx: any) {

    try {
        const tokenAddress = Web3.utils.toChecksumAddress((token_address));
        if (tokenAddress) {
            let foundToken = await Token.findOne({ token_address: token_address });

            if (foundToken != null) {
                // Already exists - Loading from DB
            }
            else {
                // Make a new query
                foundToken = await infoLookForTokenAndSave(tokenAddress);
            }

            ctx.replyWithHTML(
                "<b>Token Name:</b> " + foundToken.token_name + "\n" +
                "<b>Token Decimals:</b> " + foundToken.token_decimals + "\n" +
                "<b>Total Supply:</b> " + foundToken.total_supply + "\n" +
                "<b>Burned Tokens:</b> " + foundToken.burned_tokens + "\n" +
                "<b>Circulating Supply:</b> " + foundToken.circulating_supply + "\n" +
                "<b>Number of Holders:</b> " + foundToken.number_of_holders + "\n" +
                "<b>Proxy Contract:</b> " + foundToken.proxy_contract + "\n" +
                "<b>Honeypot:</b> " + foundToken.honeypot + "\n" +
                "<b>Buy Gas Fee:</b> " + foundToken.buy_gas_fee + "\n" +
                "<b>Sell Gas Fee:</b> " + foundToken.sell_gas_fee + "\n" +
                "<b>Buy Tax:</b> " + foundToken.buy_tax + "%" + "\n" +
                "<b>Sell Tax:</b> " + foundToken.sell_tax + "%" + "\n" +
                "<b>Token Pause Function:</b> " + foundToken.token_pause_function + "\n" +
                "<b>Token Mint Function:</b> " + foundToken.token_mint_function_enabled + "\n" +
                "<b>Ownership Renounced:</b> " + foundToken.ownership_renounced + "\n" +
                "<b>Token Deployer Address:</b> " + foundToken.token_deployer_address + "\n" +
                "<b>Token Current Owner:</b> " + foundToken.token_current_owner + "\n" +
                //"<b>Total Score:</b> " + foundToken.total_score + "\n" +
                "<b>Conclusion:</b> " + foundToken.conclusion
            );
        }
    } catch (error) {
        ctx.replyWithHTML(
            "<b>This is not a valid Token Contract Address!</b>"
        );
    }
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));