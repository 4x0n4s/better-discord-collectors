better-discord-collectors


```js
const { Client } =  require('discord.js');
const { ButtonCollector } =  require('better-discord-collectors'); //TypeScript Suported

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
            self.setEnd();
        });
    }
});
```