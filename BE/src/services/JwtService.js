const jwt = require("jsonwebtoken");

//Khoi tao Access Token 
const generalAccessToken = (payload) => {
  // console.log(payload); ID, isAdmin
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "30s" }
  );
  return access_token;
};

//Khoi tao refreshtoken
const generalRefreshToken = (payload) => {
  const refresh_token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  ); // PAYLOAD, KEY, EXP
  return refresh_token;
};

//
const refreshTokenJWTService = (token) => {
  return new Promise((resolve, reject) => {
    try {
    //   console.log("token", token); token tren header
    // dem token header dau tien so sanh voi refresh token de tao ra token access moi
        jwt.verify(token, process.env.REFRESH_TOKEN, async(err,user) => {
            if(err) {
                console.log(err);
                resolve({
                    status: 'ERR',
                    message: "The authentication"
                })
            }
            // console.log("user ", user); de check token hien tai
            const access_token = await generalAccessToken({
                id : user?.id,
                isAdmin : user?.isAdmin
            })
            // console.log("access-token after", access_token); // new accesstoken
            resolve({
              status: "OK",
              message: "Success",
              access_token
            });
        })
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshTokenJWTService,
};
