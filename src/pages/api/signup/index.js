import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";

export default async function Signup(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;
    const password = req.body.password;
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = await response;
      // console.log('user', user)
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
