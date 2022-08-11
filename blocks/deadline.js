const blockDeadline = {
  type: "section",
  text: {
    type: "mrkdwn",
    text: "Pick a date for the deadline.",
  },
  accessory: {
    type: "datepicker",
    initial_date: `${new Date().toISOString().substring(0, 10)}`,
    placeholder: {
      type: "plain_text",
      text: "Select a date",
      emoji: true,
    },
    action_id: "deadline-action",
  },
};

module.exports = blockDeadline;
