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

module.exports.loadFromFirestore = async () => {
  const reposRef = db.collection("scans");
  const query = reposRef
    .where("data.timing.total", "<", 60000)
    .where("data.runtimeError.code", "==", "NO_ERROR");
  return query.get().then(resp => {
    var items = [];
    resp.forEach(r => items.push(r.data()));
    return items;
  });
};
