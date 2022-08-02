const express = require("express");
const { App, ExpressReceiver } = require("@slack/bolt");

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

receiver.router.use(express.static("public"));

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command("/learn", async ({ command, client, ack }) => {
  try {
    await ack();
    const { profile } = await client.users.profile.get({
      user: command.user_id,
    });
    client.chat.postMessage({
      channel: command.channel_id,
      text: `Hello <@${command.user_id}>`,
      username: profile.display_name,
      icon_url: profile.image_original,
    });
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
