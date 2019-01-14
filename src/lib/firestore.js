const admin = require("firebase-admin");

let db;

switch (process.env.NODE_ENV) {
  case "dev":
    const serviceAccount = require("../../../lighthouse-scanner-firebase-adminsdk.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIRESTORE_URL
    });
    db = admin.firestore();
    break;
  default:
    const functions = require("firebase-functions");
    admin.initializeApp(functions.config().firebase);
    db = admin.firestore();
}

module.exports.loadFromFirestore = async ({ currentPage = 0, max = 100 }) => {
  let start = Number(currentPage) * max;

  if (!start) {
    start = 0;
  }
  console.log("start", start);

  const reposRef = db.collection("scans");
  const query = reposRef
    .select(
      "data.finalUrl",
      "data.audits.final-screenshot.details.data",
      "data.audits.interactive.rawValue"
    )
    .where("data.timing.total", "<", 60000)
    .orderBy("data.timing.total")
    .where("data.runtimeError.code", "==", "NO_ERROR")
    .startAt(start)
    .limit(max);

  let items = [];
  console.time("query-urls");
  const results = await query.get();
  console.timeEnd("query-urls");
  results.forEach(r => items.push(r.data()));

  return items;
};
