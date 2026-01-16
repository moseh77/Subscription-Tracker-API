import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.models.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";



export const signUp = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne( { email });

        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.status = 409;
            throw error;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create([{
            name,
            email,
            password: hashedPassword,
        }] , { session });

        const token = jwt.sign( { userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: newUser[0],
            },
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne( { email });

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid email or password');
            error.status = 401;
            throw error;
        }

        const token = jwt.sign( { userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user,
            },
        });

    } catch (error) {
        throw error;
        }
}                                                   

export const signOut = async (req, res) => {}