const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{

const authHeader = req.headers.authorization;

if(!authHeader){
 return res.status(401).send("Access Denied");
}

const token = authHeader.split(" ")[1];

try{
 const decoded = jwt.verify(token, process.env.JWT_SECRET);

 req.user = decoded;

 next();

}catch(err){
 return res.status(400).send("Invalid Token");
}

};

module.exports = verifyToken;