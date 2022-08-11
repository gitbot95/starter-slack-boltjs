const { initializeApp } = require("firebase/app");
const { getDatabase, ref, child, get } = require("firebase/database");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCblSsMNbAnZxO3cHn98BOgn_aaRS428BE",
  authDomain: "new-words-slack.firebaseapp.com",
  databaseURL:
    "https://new-words-slack-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "new-words-slack",
  storageBucket: "new-words-slack.appspot.com",
  messagingSenderId: "165615356887",
  appId: "1:165615356887:web:e1ecd49f9c4125dee11992",
  measurementId: "G-X9059PB78F",
};

const firebaseApp = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const dbRef = ref(getDatabase(firebaseApp));
const snakeCase = (str = "") => {
  const strArr = str.split(" ");
  const snakeArr = strArr.reduce((acc, val) => {
    return acc.concat(val.toLowerCase());
  }, []);
  return snakeArr.join("_");
};

getLessonList = async () => {
  list = [];
  lessons = await get(child(dbRef, `admin`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.keys(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  lessons.forEach((lesson) => {
    list = [
      ...list,
      {
        text: {
          type: "plain_text",
          text: `${lesson}`,
          emoji: true,
        },
        value: snakeCase(`${lesson}`),
      },
    ];
  });

  return list;
};

viewModal = async () => {
  const list = await getLessonList();
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
          options: list,
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
  };
  return JSON.stringify(viewGenerated);
};

module.exports = viewModal;
