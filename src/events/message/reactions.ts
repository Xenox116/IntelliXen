import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { EventBuilder, ExtendedClient } from "../../structs";

export default new EventBuilder("messageReactionAdd").setCallback(
    async (client: ExtendedClient, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    }
);