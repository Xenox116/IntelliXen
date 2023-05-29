import type { Message } from "discord.js";
import { EventBuilder, ExtendedClient } from "../../structs";
import { Language } from "../../interfaces";
import { TransPetition } from "../../interfaces";
import { trans } from "../../functions";

export default new EventBuilder("messageCreate").setCallback(
  async (client: ExtendedClient, interaction: Message) => {
    let message: string;
    let command: string[] = [];

    if (interaction.author.bot || interaction.author.system) return;
    message = interaction.content;

    if (!message.startsWith("¡")) {
      const transPetition: TransPetition = client.transPetitions.filter((tp) =>
        tp.user.id === interaction.author.id && tp.guild === null
          ? true
          : tp.guild!.id === interaction.guild!.id
      )[0];
      if (transPetition != null) {
        const trans = await client.languageService.transDetect(
          transPetition.source,
          transPetition.target,
          message
        );
        interaction.reply(trans.translatedText);
      }
      return;
    }

    //* commands
    command = message.substring(1).split(" ")!;
    command[0] = command[0].toLowerCase();

    if (command[0] === "test") {
      console.log(client.transPetitions);
      return;
    }
    // replies the ping
    if (command[0] === "ping") {
      if (command.length !== 1) return;

      interaction.reply("pong con " + client.ws.ping + "ms");

      return;
    }
    //replies laguage codes
    if (command[0] === "lcodes") {
      if (command.length !== 1) return;

      const languages: Language[] = await client.languageService.getLanguage();

      let reply = "";
      languages.forEach((lang) => {
        reply += lang.code + " - " + lang.name + "\n";
      });

      interaction.reply(reply);

      return;
    }
    //translates text
    if (command[0] === "trans") {
      if (command.length < 3) return;
      let str: string = "";
      for (let i = 2; i < command.length; i++) {
        str += command[i] + " ";
      }
      interaction.reply(await trans(client, command[1], str));
      return;
    }
    //starts translating continually
    if (command[0] === "tcont") {
      if (command.length !== 2) return;
      const codes: string[] = command[1].split("-");
      const languages: Language[] = await client.languageService.getLanguage();

      if (
        command[1].includes("-") &&
        languages.filter((l) => l.code === codes[0]).length > 0 &&
        languages.filter((l) => l.code === codes[1]).length > 0
      ) {
        const transPet: TransPetition = {
          user: interaction.author,
          guild: interaction.guild,
          source: codes[0],
          target: codes[1],
        };

        const index = client.transPetitions.findIndex((tp) =>
          tp.user.id === interaction.author.id && tp.guild === null
            ? true
            : tp.guild!.id === interaction.guild!.id
        );

        if (index >= 0) client.transPetitions.splice(index, 1, transPet);
        else client.transPetitions.push(transPet);
      } else {
        interaction.reply("Codigo de idioma incorrecto");
      }
      return interaction.reply("Se comenzará a traducir tus mensajes");
    }
    //stops translating continually
    if (command[0] === "detcont") {
      if (command.length !== 1) return;
      const index = client.transPetitions.findIndex((tp) =>
        tp.user.id === interaction.author.id && tp.guild === null
          ? true
          : tp.guild!.id === interaction.guild!.id
      );

      if (index <= 0) client.transPetitions.splice(index, 1);
      return interaction.reply("Se dejará de traducir tus mensajes");
    }
    //translates replied message 
    if (command[0] == "tthis") {
      if (command.length !== 2) return;
      if (interaction.reference !== null) {
        interaction.reply(
          await trans(
            client,
            command[1],
            (
              await interaction.fetchReference()
            ).content
          )
        );
      }
      return;
    }
    //message with help
    if (command[0] == "help") {
      if (command.length !== 1) return;
      return interaction.reply(
        "'¡' para comenzar comando\n" +
          "lcodes -> ver los codigos e idiomas disponibles\n" +
          "trans [cod]||[cod-cod] [texto] -> traduce la frase seguida del comando\n" +
          "tcont [cod-cod] -> cada vez que el usuario hable se traducirán sus mensajes\n" +
          "detcont -> se dejara de traducir los mensajes del usuario"
      );
    }
  }
);
