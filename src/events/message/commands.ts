import type { Message, User } from "discord.js";
import { EventBuilder, ExtendedClient } from "../../structs";
import { Language } from "../../interfaces/Language";
import { TransPetition } from "../../interfaces";

export default new EventBuilder("messageCreate").setCallback(
  async (client: ExtendedClient, interaction: Message) => {
    let message: string;
    let command: string[] = [];

    if (interaction.author.bot || interaction.author.system) return;
    message = interaction.content;

    if (!message.startsWith("¡")) {
      const transPetition: TransPetition = client.transPetitions.filter(
        (tp) => tp.user.id === interaction.author.id
      )[0];
      if (transPetition != null) {
        const trans = await client.languageService.transDetect(
          transPetition.source,
          transPetition.target,
          message
        );
        interaction.reply(trans.translatedText);
      }
    }
    
    //* commands
    command = message.substring(1).split(" ")!;
    
    if (command[0] === "test") {
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
      if (command.length < 2) return;
      let str: string = "";
      for (let i = 2; i < command.length; i++) {
        str += command[i] + " ";
      }

      const languages: Language[] = await client.languageService.getLanguage();
      if (!command[1].includes("-")) {
        if (languages.filter((l) => l.code === command[1]).length > 0) {
          const trans = await client.languageService.transDetect(
            "auto",
            command[1],
            str
          );
          interaction.reply(trans.translatedText + "");
        } else {
          interaction.reply("Codigo de idioma incorrecto");
        }
      } else {
        const codes: string[] = command[1].split("-");
        if (
          languages.filter((l) => l.code === codes[0]).length > 0 &&
          languages.filter((l) => l.code === codes[1]).length > 0
        ) {
          const trans = await client.languageService.transDetect(
            codes[0],
            codes[1],
            str
          );
          interaction.reply(trans.translatedText + "");
        } else {
          interaction.reply("Codigo de idioma incorrecto");
        }
      }
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
        const user: User = interaction.author;

        const index = client.transPetitions.findIndex(
          (tp) => tp.user.id === interaction.author.id
        );

        if (index <= 0)
          client.transPetitions.splice(index, 1,{
              user: user,
              source: codes[0],
              target: codes[1],
            });
        else
          client.transPetitions.push({
            user: user,
            source: codes[0],
            target: codes[1],
          });
      } else {
        interaction.reply("Codigo de idioma incorrecto");
      }
      return;
    }
    //stops translating continually
    if (command[0] === "detcont") {
      if (command.length !== 1) return;
      const index = client.transPetitions.findIndex(
        (tp) => tp.user.id === interaction.author.id
      );

      if (index <= 0) client.transPetitions.splice(index, 1);
    }
  }
);
