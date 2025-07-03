const generateMessage = (entity) => ({
    alreadyExist: `${entity} already exist`,
    notExist: `${entity} not found`,
    created: `${entity} created successfully`,
    failToCreate: `Failed to create ${entity}`,
    updated: `${entity} updated successfully`,
    failToUpdate: `Failed to update ${entity}`,
    deleted: `${entity} deleted successfully`,
    failToDelete: `Failed to delete ${entity}`,
    fetchedSuccessfully: `${entity} fetched successfully`,
    failToFetch: `${entity} failed to fetch`
});

export const messages = {
    file: { required: 'file is required' },
    user: {
        ...generateMessage('user'),
        verified: "user verified successfully",
        invalidCredntiols: "invalid credentials",  // Fixed typo
        notVerified: "user not verified",
        invalidToken: "invalid token",            // Kept from main
        loginSuccessfully: "login successfully",
        unauthorized: "unauthorized to access this api",
        invalidPassword: "invalid password",      // Kept from Youssef
        passwordUpdated: "password updated successfully",
        invalidOTP: "invalid OTP",
        failToUpdatePassword: "failed to update password",
        noAccountsFound: "no accounts found",
        otpSent: "OTP sent successfully",         // Kept from main
        acountCreated: "Acount created successfully plese check your mail to verify"
    },
    lesson: generateMessage('lesson'),
    question: generateMessage('question'),
    exam: generateMessage('exam'),
    admin: generateMessage('admin')
};
