import Discord from 'discord.js';
import { LanguageService } from '../services';
import { TransPetition } from '../interfaces';
import { eventHandler } from '../handlers';

export class ExtendedClient extends Discord.Client<true>{

    public okay: boolean = true;

    public languageService: LanguageService = new LanguageService();

    public transPetitions: TransPetition[] = [];

    public constructor(){
        super({
            intents: 131071,
            presence: {
                status: 'online'
            }
         });
    }

    public async start(){
        await eventHandler(this);
        await this.login();
    }
}