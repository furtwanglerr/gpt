const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const { REPLICATE_API_KEY } = require('../../config.json');
const models = require('../models');

module.exports = {
  run: async ({ interaction }) => {
    try {
      await interaction.deferReply();

      const { default: Replicate } = await import('replicate');

      const replicate = new Replicate({
        auth: REPLICATE_API_KEY,
      });

      const prompt = interaction.options.getString('prompt');
      const model = interaction.options.getString('model') || models[0].value;

      const output = await replicate.run(model, { input: { prompt } });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel(`다운로드`)
          .setStyle(ButtonStyle.Link)
          .setURL(`${output[0]}`)
          .setEmoji('1101133529607327764')
      );

      const resultEmbed = new EmbedBuilder()
        .setTitle('이미지 생성됨')
        .addFields({ name: 'Prompt', value: prompt })
        .setImage(output[0])
        .setColor('#44a3e3')
        .setFooter({
          text: `요청자: ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      await interaction.editReply({
        embeds: [resultEmbed],
        components: [row],
      });
    } catch (error) {
      const errEmbed = new EmbedBuilder()
        .setTitle('에러')
        .setDescription('```' + error + '```')
        .setColor(0xe32424);

      interaction.editReply({ embeds: [errEmbed] });
    }
  },

  data: {
    name: 'imagine',
    description: '프롬프트를 작성하여 이미지 생성',
    options: [
      {
        name: 'prompt',
        description: '프롬프트 작성',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'model',
        description: '이미지를 생성할 모델',
        type: ApplicationCommandOptionType.String,
        choices: models,
        required: false,
      },
    ],
  },
};
