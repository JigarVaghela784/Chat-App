import axios from "axios";
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

