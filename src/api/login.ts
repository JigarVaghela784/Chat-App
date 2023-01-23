import axios from "axios";

interface User {
  email?: string;
  password?: string;
}

export const loginUser = async (payload: User) => {
  const { data } = await axios.post("/api/login", payload);
  return data;
};
