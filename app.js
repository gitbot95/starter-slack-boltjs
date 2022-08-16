const express = require("express");
const { App, ExpressReceiver } = require("@slack/bolt");
const modalSlack = require("./modalSlack");
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
  const content = await modalSlack();
  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: content,
    });
    logger.info(`${"=".repeat(20)}GOTCHA!${"=".repeat(20)}`);
  } catch (error) {
    logger.error(error);
  }
});

app.action("lessons-action", async ({ action, ack, say }) => {
  await ack();
  await say("hello world");
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
