import axios from "axios";
import { Blob } from "blob-polyfill";
export const getUserData = async (token) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user`,
      {
        mode: "cors",
      }
    );
    const { name, email, _id } = response.data.user;
    const userData = { _id, name, email };
    return userData;
  } catch (error) {
    console.log("error", error);
  }
};

//Get user profile from database
export const userProfile = async (token) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
      {
        mode: "cors",
      }
    );

    const data = await response.data;
    const blob = new Blob([Buffer.from(data)]);
    const profileUrl = URL.createObjectURL(blob);
    return profileUrl;
  } catch (error) {
    console.log("error", error);
  }
};

// export const getAllMessage = async (token) => {
//   try {
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_URL}/user/message`,
//       {
//         mode: "cors",
//       }
//     );
//     const data = await response;
//     console.log("dresponseata", response);
//     //  await response.data.message.map((element) => {
//     //     const blob = new Blob([Buffer.from(element.avatar)]);
//     //     element.avatar = URL.createObjectURL(blob);
//     //     if (element.image) {
//     //       const imageBlob = new Blob([Buffer.from(element.image)]);
//     //       element.image = URL.createObjectURL(imageBlob);
//     //     }
//     //   });
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };
