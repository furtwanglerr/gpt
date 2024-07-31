module.exports = {
  data: {
    name: 'ping',
    description: '봇의 핑',
  },

  run: ({ interaction, client }) => {
    interaction.reply(`핑: ${client.ws.ping}ms`);
  },
};
