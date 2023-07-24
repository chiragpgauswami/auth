import jwt from "jsonwebtoken";
import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

export const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    let existUsername = await UserModel.findOne({ username });

    if (!existUsername) {
      return res.status(404).send({ error: "Username not Found" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ error: "Authentication Error" });
  }
};

export const register = (req, res) => {
  const { username, password, profile, email } = req.body;
  try {
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username })
        .then((user) => {
          if (user) reject({ error: "Please use unique username" });

          resolve();
        })
        .catch((err) => {
          if (err) reject(new Error(err));
        });
    });

    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email })
        .then((email) => {
          if (email) reject({ error: "Please use unique email" });

          resolve();
        })
        .catch((err) => {
          if (err) reject(new Error(err));
        });
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
              });

              user
                .save()
                .then((result) => {
                  res.status(201).send({ msg: "User Register Sucessfully" });
                })
                .catch((error) => {
                  return res.status(500).send({ error });
                });
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const login = (req, res) => {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(404).send({ error: "Don't have Password" });
            }

            jwt.sign(
              { userId: user._id, username: user.username },
              ENV.JWT_SECRET,
              { expiresIn: "24h" },
              (err, token) => {
                if (err) {
                  return res.status(500).send({ error: "JWT Error" });
                }

                return res.status(200).send({
                  msg: "Login Sucessfully",
                  username: user.username,
                  token,
                });
              }
            );
          })
          .catch((err) => {
            return res.status(404).send({ error: "Password dose not Match" });
          });
      })
      .catch((err) => {
        return res.status(404).send({ error: "Username not Found" });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getUser = (req, res) => {
  const { username } = req.params;

  try {
    if (!username) {
      res.status(501).send({ error: "Invalid Username" });
    }

    UserModel.findOne({ username })
      .then((user) => {
        if (!user) {
          return res.status(500).send({ error: "Couldn't Find the User" });
        }

        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(201).send(rest);
      })
      .catch((err) => {
        return res.status(500).send({ err });
      });
  } catch (error) {
    return res.status(404).send({ error: "Username not Found" });
  }
};

export const updateUser = (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(501).send({ error: "User not Found" });
    } else {
      const body = req.body;

      UserModel.updateOne({ _id: userId }, body)
        .then((result) => {
          if (!result) {
            return res.status(500).send({ error: "User not Found" });
          }

          return res.status(201).send({ msg: "User Update Sucessfully" });
        })
        .catch((err) => {
          return res.status(500).send({ err });
        });
    }
  } catch (error) {
    res.status(501).send({ error });
  }
};

export const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).json({ code: req.app.locals.OTP });
};

export const verifyOTP = (req, res) => {
  const { code } = req.query;

  console.log(code);

  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;

    res.status(201).send({ msg: "OTP Verified Successfully!" });
  }
  res.status(400).send({ error: "Invalid OTP" });
};

export const createResetSession = (req, res) => {
  if (req.app.locals.resetSession) {
    res.status(201).send({ flag: req.app.locals.resetSession });
  }
  res.status(500).send({ error: "Session Expired!" });
};

export const resetPassword = (req, res) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(500).send({ error: "Session Expired!" });
    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword }
              )
                .then((result) => {
                  if (!result) {
                    return res.status(500).send({ error: "User not Found" });
                  }

                  return res
                    .status(201)
                    .send({ msg: "Password Reset Sucessfully" });
                })
                .catch((err) => {
                  return res.status(500).send({ err });
                });
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        })
        .catch((err) => {
          return res.status(404).send({ error: "Username not Found" });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
