const jwt = require("jsonwebtoken")

const authMiddleWare = (req, res, next)=> {
    // console.log("checktoken", req.headers.token);
    const token = req.headers.token.split(' ')[1] //tach bearer voi token ra lay token
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user){ 
        if(err){
            return res.status(404).json({
                message: "The are not  authentication",
                status: "error"
            })
        }
        // console.log("user" , user); // log ra coi ,id, isAdmin,  time exp
        if(user?.isAdmin){
            next()
        } else {
            return res.status(404).json({
                message: "You are not authentication",
                status: "error"
            })
        }
    })
}

const authUserMiddleWare = (req, res, next)=> {
    // console.log("checktoken", req.headers.token);
    const userId = req.params.id
    const token = req.headers.token.split(' ')[1] //tach bearer voi token ra lay token
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user){ 
        if(err){
            return res.status(404).json({
                message: "The are not  authentication",
                status: "error"
            })
        }
        // console.log("user" , user); // log ra coi ,id, isAdmin,  time exp
        if(user?.isAdmin || user?.id === userId){
            next()
        } else {
            return res.status(404).json({
                message: "You are not authentication",
                status: "error"
            })
        }
    })
}

module.exports = {
    authMiddleWare , authUserMiddleWare
}