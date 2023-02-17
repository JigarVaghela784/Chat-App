import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";

export default async function ResetPassword(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;
    try {
      await sendPasswordResetEmail(auth, email);
      res.send({msg:"Success"})
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
