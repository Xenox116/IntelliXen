import Discord from 'discord.js';
import { eventHandler } from '../handlers/event';

export class ExtendedClient extends Discord.Client<true>{

    public okay: boolean = true;

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