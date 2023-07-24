import { data } from "autoprefixer";
import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export const getUsername = async () => {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find Token");
  let decode = jwt_decode(token);
  return decode;
};

export const authenticate = async (username) => {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username does not exist" };
  }
};

export const getUser = async ({ username }) => {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Couldn't find User." };
  }
};

export const registerUser = async (credentials) => {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, credentials);

    let { username, email } = credentials;

    if (status === 201) {
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: msg,
      });
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
};

export const verifyPassword = async ({ username, password }) => {
  try {
    if (username) {
      const { data } = await axios.post("/api/login", { username, password });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
};

export const updateUser = async (response) => {
  try {
    const token = await localStorage.getItem("token");

    const data = await axios.put("/api/updateUser", response, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Error updating user" });
  }
};

export const generateOTP = async (username) => {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", { params: { username } });

    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
};

export const verifyOTP = async ({ username, code }) => {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const resetPassword = async ({ username, password }) => {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });

    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error: "Error resetting password" });
  }
};
