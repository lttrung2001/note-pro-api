const admin = require("firebase-admin");
const serviceAccount = require("../../note-pro-91c72-firebase-adminsdk-iazk3-2346ed8221.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();
const auth = admin.auth()
module.exports = {firestore, auth}