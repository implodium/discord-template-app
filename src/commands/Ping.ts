import {Discord, Slash} from "discordx";
import {CommandInteraction} from "discord.js";

@Discord()
export default class Ping {

    @Slash('ping')
    execute(interaction: CommandInteraction) {
        interaction.reply("pong")
    }

}
