#!/usr/bin/env node
import { ChannelType, Client, Events, GatewayIntentBits, Message, MessageType, Partials } from 'discord.js';
import { add, remove, setHandler } from './bank-it.js';
import { generateThreadName } from "./thread-name.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

function env(name: string) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`env: ${name} required`);
    }
    return value;
} 

const channelId = env('CHANNEL_ID');
const messageId = env('MESSAGE_ID');

let rootMessage: Message<true> | null = null;
const emoji = '🔍';

client.on(Events.ClientReady, async readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);

    const channel = readyClient.channels.cache.get(channelId);
    if (channel?.type === ChannelType.GuildText) {
        rootMessage = await channel.messages.fetch(messageId);
        const reaction = rootMessage.reactions.cache.get(emoji);
        if (reaction) {
            const users = await reaction.users.fetch();
            let templateReaction = false;
            for (const userId of users.keys()) {
                if (userId === client?.user?.id) {
                    templateReaction = true;
                    continue;
                }
                add(userId);
            }
            if (!templateReaction) {
                rootMessage.react(emoji);
            }
        } else {
            rootMessage.react(emoji);
        }
    }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    if (reaction.message.id !== messageId || reaction.emoji.name !== emoji) {
        return;
    }
    add(user.id);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    if (reaction.message.id !== messageId || reaction.emoji.name !== emoji) {
        return;
    }
    remove(user.id);
});

setHandler(async (users: string[]) => {
    try {
        const channel = client.channels.cache.get(channelId);
        if (channel?.type === ChannelType.GuildText) {
            const thread = await channel.threads.create({
                name: generateThreadName(),
                invitable: false,
            });
            thread.send(users.map(user => `<@${user}>`).join(' '));
            if (rootMessage) {
                const reaction = rootMessage.reactions.cache.get(emoji);
                for (const user of users) {
                    reaction?.users.remove(user);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }    
});

// Delete thread created system messages
client.on(Events.MessageCreate, message => {
    if (message.type === MessageType.ThreadCreated && message.channelId === channelId) {
        message.delete();
    }
});

client.login(env('TOKEN'));
