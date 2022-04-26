import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { json } from 'body-parser';
import dotenv from 'dotenv';

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

    else {
        ctx.reply(
            "Token contract: " + ctx.message.text
        );
    }

});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));