import jwt from 'jsonwebtoken';

const checkAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) return next();

    // Get token from request
    const token = authHeader.split(' ')[1];
    // Check Jwt
    try {
        const user = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = user;
    } catch (error) {
        console.log(error)
    }

    return next();
}

export default checkAuth;