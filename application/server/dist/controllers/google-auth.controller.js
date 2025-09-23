"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthController = void 0;
const google_auth_library_1 = require("google-auth-library");
const user_service_1 = require("../services/user.service");
const auth_config_1 = require("../config/auth.config");
const client = new google_auth_library_1.OAuth2Client(auth_config_1.GOOGLE_CLIENT_ID);
exports.googleAuthController = {
    /**
     * Handle Google Sign-In
     */
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Google login request received:', req.body);
            // Check if Google Auth is enabled globally
            if (!auth_config_1.AUTH_CONFIG.enableGoogleAuth) {
                console.error('Google authentication attempt when feature is disabled');
                res.status(403).json({ message: 'Google authentication is currently disabled' });
                return;
            }
            try {
                const { tokenId } = req.body;
                if (!tokenId) {
                    console.error('Token ID is missing in request');
                    res.status(400).json({ message: 'Token ID is required' });
                    return;
                }
                console.log('Verifying Google token with Client ID:', auth_config_1.GOOGLE_CLIENT_ID);
                // Verify Google token
                try {
                    const ticket = yield client.verifyIdToken({
                        idToken: tokenId,
                        audience: auth_config_1.GOOGLE_CLIENT_ID
                    });
                    const payload = ticket.getPayload();
                    if (!payload) {
                        console.error('Token verification succeeded but payload is empty');
                        res.status(401).json({ message: 'Invalid token - empty payload' });
                        return;
                    }
                    console.log('Token verification successful, payload:', {
                        email: payload.email,
                        name: payload.name,
                        sub: payload.sub,
                        // Mask other potentially sensitive data
                    });
                    const { email, name, picture } = payload;
                    if (!email) {
                        res.status(400).json({ message: 'Email not provided in Google token' });
                        return;
                    }
                    // Check if user already exists
                    try {
                        // Try to login the user if they already exist
                        const { user, token } = yield user_service_1.userService.loginWithGoogle(email);
                        res.status(200).json({ user, token });
                    }
                    catch (error) {
                        // User doesn't exist, create a new one
                        const user = yield user_service_1.userService.registerWithGoogle({
                            email: email || '',
                            name: name || 'Google User',
                            avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`
                        });
                        // Generate token for new user
                        const { token } = yield user_service_1.userService.loginWithGoogle(email || '');
                        res.status(201).json({ user, token });
                    }
                }
                catch (error) {
                    throw error; // Re-throw to be caught by the outer try-catch
                }
            }
            catch (error) {
                console.error('Google auth error:', error);
                // Enhanced error reporting
                let errorMessage = 'Failed to authenticate with Google';
                let statusCode = 401;
                if (error.message.includes('Token used too late')) {
                    errorMessage = 'Authentication token has expired. Please try again.';
                }
                else if (error.message.includes('Invalid value')) {
                    errorMessage = 'Invalid authentication token received.';
                }
                else if (error.message.includes('audience')) {
                    errorMessage = 'Token was not issued for this application.';
                    console.error('Client ID mismatch. Check your Google Cloud Console configuration.');
                }
                else if (error.message.includes('network')) {
                    statusCode = 500;
                    errorMessage = 'Network error verifying your login. Please try again.';
                }
                res.status(statusCode).json({
                    message: errorMessage,
                    error: error.message,
                    details: 'See server logs for more information'
                });
            }
        });
    }
};
