import { User } from 'discord.js';

export interface TransPetition{
    user: User,
    source: string,
    target: string
}