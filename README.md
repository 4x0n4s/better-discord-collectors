better-discord-collectors

Basic Usage
```ts
import { Client } from 'discord.js';
import { ButtonCollector } from 'better-discord-collectors';

const client = new Client({ intents: 3276799 });
client.on('messageCreate', async ({ content, channel, author }) => {
    if (content.startsWith('!hello')) {
        let message = await channel.send({
            embeds: [{
                title: 'Embed'
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    custom_id: 'test',
                    label: 'Button',
                    style: 2
                }]
            }]
        })
        
        let collector = new ButtonCollector(client, {
            customsIDs: 'test',
            usersIDs: author.id,
            rolesIDs: ['123456789012345', '09876543212345'],
            autoUpdate: true, //.deferUpdate
            autoReply: true //.deferReply
        }).setCallback((interaction, self) => {
            interaction?.channel?.send('Collector Work!');
            self.setEnd(); // If you use this collector in a command, to avoid duplication.
        });

        //If you want edit the timeout of the end
        collector.extendTime(60_000); //
    }
});
```

Other usage
```ts
const collector = new ButtonCollector(client, {}).setCallback((interaction, self) => {
    //Code
});

export default collector;
```