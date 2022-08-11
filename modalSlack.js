const lessons = require("./blocks/lessons");
const deadline = require("./blocks/deadline");

modalSlack = async () => {
  const bl_lessons = await lessons();
  const bl_deadline = await deadline();

  const viewGenerated = {
    type: "modal",
    submit: {
      type: "plain_text",
      text: "Let's Go!",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: ":thinking_face:",
      emoji: true,
    },
    title: {
      type: "plain_text",
      text: "Learn new words",
      emoji: true,
    },
    blocks: [
      bl_lessons,
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Everyday learn",
        },
        accessory: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select an item",
            emoji: true,
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "5 words",
                emoji: true,
              },
              value: "5",
            },
            {
              text: {
                type: "plain_text",
                text: "10 words",
                emoji: true,
              },
              value: "10",
            },
            {
              text: {
                type: "plain_text",
                text: "15 words",
                emoji: true,
              },
              value: "15",
            },
          ],
          action_id: "static_select-action",
        },
      },
      bl_deadline,
    ],
  };
  return JSON.stringify(viewGenerated);
};

module.exports = modalSlack;
