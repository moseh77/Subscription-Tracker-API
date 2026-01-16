import jwt from 'jsonwebtoken';

import { JWT_SECRET } from "../config/env.js";
import User from '../models/user.models.js';

// someone is making a request get user details -> verify token -> get user details -> pass user details to next

const authorize = async (req, res, next) => {
    try {

        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });
        
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach user to request object
        req.user = user;

        // Proceed to next middleware/handler on successful authorization
        next();

    } catch (error) {
        // Handle any errors that occur during authorization
        res.status(401).json({
            message: 'Unauthorized',
            error: error.message,
        });
    }
}


export default authorize;




