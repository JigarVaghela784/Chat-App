import { child, get, onValue, ref, set } from "firebase/database";
import { database, dbRef } from "../../../../firebaseConfig";

export default async function SetUser(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;
    const userId = req.body.userId;
    const username = req.body.username;
    try {
      set(ref(database, "users/" + userId), {
        username,
        email,
        userId,
      });
    } catch (error) {
      res.status(500).send({ msg: "Something went wrong", error });
    }
  } else {
    if (req.method === "GET") {
      const { userId } = req.query;
      try {
        const response = await get(child(dbRef, `users/${userId}`));
        if (response.exists()) {
          res.send(response.val());
        } else {
          res.send({ msg: "No data available" });
        }
      } catch (error) {
        res.send({ msg: error });
      }
    }
  }
}
