import bcrypt from 'bcrypt';
import { AppError } from "../../utils/appError.js";
import { User } from '../../../db/index.js';
import { generateToken, verifyToken } from '../../utils/token.js';
import { messages } from '../../utils/constant/messages.js';
import { sendEmail } from '../../utils/email.js';
import { roles } from '../../utils/constant/enums.js';

// sign up
export const signup = async (req, res, next) => {
    // Get data from the request
    const { fullName, email, password, phoneNumber, classLevel } = req.body;

    // Check if user already exists
    const userExist = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userExist) {
        return next(new AppError(messages.user.alreadyExist, 409));
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create a new user
    const user = new User({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        classLevel
    });

    // Save the user to the database
    const createdUser = await user.save();
    if (!createdUser) {
        return next(new AppError(messages.user.failToCreate, 500));
    }

    // Generate a token
    const token = generateToken({ payload: { email, _id: createdUser._id } });

    // Send verification email
    await sendEmail({
        to: email,
        subject: "Verify your account",
        html: `<p>Click on the link to verify your account: <a href="${req.protocol}://${req.headers.host}/auth/verify/${token}">Verify Account</a></p>`
    });

    // Send response
    return res.status(201).json({
        message: messages.user.acountCreated,
        success: true,
        data: createdUser
    });
};

export const verifyAccount = async (req, res, next) => {
    // Get the token from request parameters
    const { token } = req.params;

    // Verify the token and extract payload
    const payload = verifyToken({ token });

    // If the token is invalid, return an error
    if (!payload) {
        return next(new AppError(messages.user.invalidToken, 400));
    }

    // Find the user by email and update their status to VERIFIED
    const updatedUser = await User.findOneAndUpdate(
        { email: payload.email, role: roles.USER },
        { isVerified: true },
        { new: true }
    );

    // Check if user was found and updated
    if (!updatedUser) {
        return next(new AppError(messages.user.notExist, 404));
    }

    // Send success response
    return res.status(200).send(`
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    text-align: center;
                    padding: 60px;
                    color: #333;
                }
                h1 {
                    color: #2e7d32;
                }
                p {
                    font-size: 18px;
                }
            </style>
        </head>
        <body>
            <h1>✅ Account Verified Successfully</h1>
            <p>You can now log in to your account from the login page.</p>
        </body>
    </html>
`);
};

// login 
export const login = async (req, res, next) => {
    // Get data from the request
    const { email, phoneNumber, password } = req.body;


    // Find user by email or phone number
    const user = await User.findOne({
        $or: [{ email }, { phoneNumber }]
    });
    if (!user) {
        return next(new AppError(messages.user.notExist, 404))
    }

    // Check if password is correct
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError(messages.user.invalidCredntiols, 400)); // Invalid password
    }

    // Check if user is verified
    if (!user.isVerified) {
        return next(new AppError(messages.user.notVerified, 403)); // User not verified
    }

    // Generate a token
    const token = generateToken({ payload: { email: user.email, _id: user._id } });

    // Send response
    return res.status(200).json({
        message: messages.user.loginSuccessfully,
        success: true,
        token
    });
};