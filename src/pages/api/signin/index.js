import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";

export default async function SignIn(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;
    const password = req.body.password;
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      const user = await response;

      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
