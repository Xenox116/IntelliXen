import type { Message } from "discord.js";
import { EventBuilder, ExtendedClient } from "../../structs";

export default new EventBuilder("messageCreate").setCallback(
  async (client: ExtendedClient, interaction: Message) => {
    let message: string;
    let command: string[] = [];

    if (interaction.author.bot || interaction.author.system) return;
    message = interaction.content;

    if (!message.startsWith("¡")) return;
    command = message.substring(1).split(" ")!;

    if (command[0] === "test") {
      return;
    }

    if (command[0] === "ping") {
      if (command.length !== 1) return;

      interaction.reply("pong con " + client.ws.ping + "ms");

      return;
    }
  }
);
