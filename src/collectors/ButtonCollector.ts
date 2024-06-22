import { Client, Message, ButtonInteraction, BaseInteraction, GuildMemberRoleManager } from 'discord.js';
import { Snowflake } from 'discord-api-types/v10';

type callbackInteractionType = (interaction?: ButtonInteraction, self?: ButtonCollector) => void;
export class ButtonCollector {
    protected _client: Client;
    protected timeoutID!: Timer | null;
    protected callback!: callbackInteractionType;
    ended: boolean = false;
    customsIDs: Array<Snowflake>;
    usersIDs: Array<Snowflake>;
    rolesIDs: Array<Snowflake>
    autoUpdate: boolean;
    autoReply: boolean;
    constructor(client: Client, {
        messageID,
        channelID,
        customsIDs = [],
        usersIDs = [],
        rolesIDs = [],
        autoUpdate = false,
        autoReply = false
    }: { 
        messageID?: string,
        channelID?: string,
        customsIDs?: Array<Snowflake> | Snowflake,
        usersIDs?: Array<Snowflake> | Snowflake,
        rolesIDs?: Array<Snowflake> | Snowflake,
        autoUpdate?: boolean,
        autoReply?: boolean,
    }) {
        this._client = client;
        this.customsIDs = Array.isArray(customsIDs) ? customsIDs : [customsIDs];
        this.usersIDs = Array.isArray(usersIDs) ? usersIDs : [usersIDs];
        this.rolesIDs = Array.isArray(rolesIDs) ? rolesIDs : [rolesIDs];
        this.autoUpdate = autoUpdate;
        this.autoReply = autoReply;
        this.handler = this.handler.bind(this);
    }

    setCallback(fn: callbackInteractionType): this {
        if (!this.ended) {
            this.callback = fn;
            this._client.on('interactionCreate', this.handler);
        }
        return this;
    }
    
    setEnd(options?: {
        time?: Date | number, 
        reason?: string
    }): void {
        const { time, reason } = options ?? {};
        if (time) {
            const timeout = typeof time === 'number' ? time : new Date(time).getTime();
            this.timeoutID = setTimeout(() => {
                this.cleanUp();
                this.ended = true;
            }, timeout);
            return;
        }
        this.ended = true;
        this.cleanUp();
    }

    extendTime(time: Date | number) {
        if (this.timeoutID) {
            time = typeof time === 'number' ? time : new Date(time).getTime();
            clearTimeout(this.timeoutID);
            this.timeoutID = setTimeout(() => {
                this.cleanUp();
                //Log
            }, time);
        }
    }

    cleanUp() {
        this.callback = () => null;
        this.customsIDs = [];
        this.usersIDs = [];
        this.timeoutID = null;
        this._client.removeListener('interactionCreate', this.handler.bind(this));
    }

    private handler(interaction: BaseInteraction) {
        if(!interaction.isButton()) {
            return;
        }
        
        const { user, customId, member } = interaction;
        const c = this.customsIDs?.length > 0 ? this.customsIDs?.includes(customId) : true;
        const u = this.usersIDs.length > 0 ? this.usersIDs?.includes(user.id) : true
        //const r = this.rolesIDs?.length > 0 ? (interaction.member?.roles.valueOf() as GuildMemberRoleManager).cache.some(({ id }) => this.rolesIDs.includes(id)) : true;
        if (c && u) {
            if (this.autoUpdate) interaction.deferUpdate();
            if (this.autoReply) interaction.deferReply();
            this.callback(interaction, this);
        }
    }
}