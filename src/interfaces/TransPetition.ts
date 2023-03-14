import { Guild, User } from 'discord.js';

export interface TransPetition{
    user: User,
    guild: Guild | null,
    source: string,
    target: string
}