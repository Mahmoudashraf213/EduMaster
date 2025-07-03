import jwt from "jsonwebtoken";

// Function to generate a token
export const generateToken = ({ payload, secretkey = process.env.SECRET_KEY }) => {
    return jwt.sign(payload, secretkey, { expiresIn: '24h' });
};

// Function to verify the token
export const verifyToken = ({ token, secretkey = process.env.SECRET_KEY }) => {
    try {
        return jwt.verify(token, secretkey); // Returns the decoded payload if valid
    } catch (error) {
        // console.error('Token verification failed:', error.message);
        return { messege: error.messege }
    }
};