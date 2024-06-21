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
        
        new ButtonCollector(client, {
            customsIDs: 'test',
            usersIDs: author.id,
            autoUpdate: true
        }).setCallback((interaction, self) => {
            interaction?.channel?.send('Collector Work!');
            self.setEnd(); // If you use this collector in a command, to avoid duplication.
        });
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