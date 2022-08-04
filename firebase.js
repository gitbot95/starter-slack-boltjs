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

  console.log(list);
};

const snakeCase = (str = "") => {
  const strArr = str.split(" ");
  const snakeArr = strArr.reduce((acc, val) => {
    return acc.concat(val.toLowerCase());
  }, []);
  return snakeArr.join("_");
};

export { getLessonList };
