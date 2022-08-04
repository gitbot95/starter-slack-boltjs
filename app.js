const express = require("express");
const { App, ExpressReceiver } = require("@slack/bolt");
const getLessonList = require("./firebase");

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

receiver.router.use(express.static(__dirname + "/public"));

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command("/learn", async ({ ack, body, client, logger }) => {
  // Acknowledge the command request
  await ack();
  lists = await getLessonList();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
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
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Lessons list",
            },
            accessory: {
              type: "multi_static_select",
              placeholder: {
                type: "plain_text",
                text: "Select options",
                emoji: true,
              },
              options: `${lists}`,
              action_id: "multi_static_select-action",
            },
          },
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
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "Select date range",
              emoji: true,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "datepicker",
                initial_date: "1990-04-28",
                placeholder: {
                  type: "plain_text",
                  text: "Select a date",
                  emoji: true,
                },
                action_id: "actionId-0",
              },
              {
                type: "datepicker",
                initial_date: "1990-04-28",
                placeholder: {
                  type: "plain_text",
                  text: "Select a date",
                  emoji: true,
                },
                action_id: "actionId-1",
              },
            ],
          },
        ],
      },
    });
    logger.info("GOTCHA!");
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
