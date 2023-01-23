import axios from "axios";

// interface {
//   email: string;
//   password: string;
// }

export const loginUser = async (payload) => {
  const { data } = await axios.post("/api/login", payload);
  return data;
};
