import { Client, Message, ButtonInteraction, BaseInteraction } from 'discord.js';
import { Snowflake } from 'discord-api-types/v10';

type callbackInteractionType = (interaction?: ButtonInteraction, self?: ButtonCollector) => void;
export class ButtonCollector {
    protected _client: Client;
    protected timeoutID!: Timer | null;
    protected callback!: callbackInteractionType;
    customsIDs: Array<Snowflake>;
    usersIDs: Array<Snowflake>
    autoUpdate: boolean;
    constructor(client: Client, {
        customsIDs = [],
        usersIDs = [],
        autoUpdate = false
    }: { 
        customsIDs?: Array<Snowflake> | Snowflake,
        usersIDs?: Array<Snowflake> | Snowflake,
        autoUpdate?: boolean
    }) {
        this._client = client;
        this.customsIDs = Array.isArray(customsIDs) ? customsIDs : [customsIDs];
        this.usersIDs = Array.isArray(usersIDs) ? usersIDs : [usersIDs];
        this.autoUpdate = autoUpdate;
        this.handler = this.handler.bind(this);
    }

    setCallback(fn: callbackInteractionType): this {
        this.callback = fn;
        this._client.on('interactionCreate', this.handler);
        return this;
    }
    
    setEnd(options?: {
        at?: Date | number, 
        reason?: string
    }): void {
        const { at, reason } = options ?? {};
        if (at) {
            const timeout = typeof at === 'number' ? at : new Date(at).getTime();
            this.timeoutID = setTimeout(() => {
                this.cleanUp();
            }, timeout);
            return;
        }

        this.cleanUp();
    }

    cleanUp() {
        this.callback = () => null;
        this.customsIDs = [];
        this.usersIDs = [];
        this.timeoutID = null
        this._client.removeListener('interactionCreate', this.handler.bind(this));
    }

    handler(interaction: BaseInteraction) {
        if(!interaction.isButton() || !this.callback) {
            return;
        }
        
        const { user, customId } = interaction;
        const u = this.usersIDs.length > 0 ? this.usersIDs?.includes(user.id) : true;
        const c = this.customsIDs?.length > 0 ? this.customsIDs?.includes(customId) : true;
        if (u && c) {
            if (this.autoUpdate) interaction.deferUpdate();
            this.callback(interaction, this);
        }
    }
}