import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";

export default async function Signup(req, res) {
  if (req.method === "POST") {
    const email=req.body.email;
    const password=req.body.password
    res.send({email,password})
    //   try {
    //       const response=createUserWithEmailAndPassword(auth, email,password)

    //       res.send(response).status(200);
    // } catch (error) {
    //     res.status(500).send({msg:"Something went wrong"})
    // }
    //   createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //       // Signed in
    //       const user = userCredential.user;
    //       // ...
    //     })
    //     .catch((error) => {
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       // ..
        // });/
  }
}
