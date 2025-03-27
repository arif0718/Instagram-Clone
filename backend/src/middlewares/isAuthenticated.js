import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res) =>{
    try {
        const token = req.cookie.token;
        if(!token){
            return res.status(401).json({
                message:'User is not authenticated',
                success: true
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:'Invalid token',
                success:false
            });
        }
        req.id = decode.userId;
        next();

    } catch (error) {
        console.log(error);
    }
}
export default isAuthenticated;