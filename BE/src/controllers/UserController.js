const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const { response } = require("express");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is equal confirmPassword",
      });
    }

    const response = await UserService.createUser(req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }

    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, // chi lay dc qua http
      secure: false, // bao mat client, deloy thanh true
      samesite: "strict",
    });
    return res.status(200).json(newResponse);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Logout Successful",
    });
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // lay id tren url
    const data = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The user not found",
      });
    }

    const response = await UserService.updateUser(userId, data);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const deleteManyUser = async (req, res) => {
  try {
    const userIds = req.body.ids // mot mang id
    if (!userIds) {
      return res.status(400).json({
        status: "ERR",
        message: "One of user not found",
      });
    }

    const response = await UserService.deleteManyUser(userIds);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // lay id tren url

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The user not found",
      });
    }

    const response = await UserService.deleteUser(userId);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    // console.log(req.headers.token); header co gi la lay dc
    const token = req.headers.token.split(" ")[1];
    const userId = req.params.id;
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  // console.log("req.cookies", req.cookies) //lay token trong cookie thay zo
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(400).json({
        status: "ERR",
        message: "Token is expressed",
      });
    }
    const response = await JwtService.refreshTokenJWTService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

module.exports = {
  refreshToken,
  deleteManyUser,
  getDetailsUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  logoutUser,
};
