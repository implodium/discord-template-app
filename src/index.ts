import 'reflect-metadata'
import {Client} from "discordx";
import {dirname, importx} from '@discordx/importer'
import {Intents} from "discord.js";

initEnvironment()
const client = getClient()
initCommands()
await startBot()

function isProduction() {
    return process.env.NODE_ENV && process.env.NODE_ENV === 'production'
}

function initEnvironment() {
    if (!isProduction()) {
        require('dotenv').config({path: `${process.cwd()}/.env.dev`})
    }
}

function getClient(): Client {
    if (isProduction()) {
        return getProductionClient()
    } else {
        return getDevelopmentClient()
    }
}

function getProductionClient(): Client {
    return new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
        ],
        silent: false,
    })
}

function getDevelopmentClient(): Client {
    return new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
        ],

        silent: false,
        botGuilds: process.env.BOT_GUILD ? [process.env.BOT_GUILD] : undefined
    })
}

function initCommands() {
    initCommandStructures()
    initCommandInteraction()
}

function initCommandStructures() {
    client.once('ready', async () => {
        await client.clearApplicationCommands()
        await client.initApplicationCommands()
        await client.initApplicationPermissions()
    })
}

function initCommandInteraction() {
    client.on('interactionCreate', async (interaction) => {
        await client.executeInteraction(interaction)
    })
}

async function startBot() {
    await importClasses()

    if (process.env.DISCORD_TOKEN) {
        await client.login(process.env.DISCORD_TOKEN)
    }
}

async function importClasses() {
    await importx(
        dirname(import.meta.url) + "/{events,commands,api}/**/*.js"
    )
}
