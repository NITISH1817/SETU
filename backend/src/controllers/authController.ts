import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Citizen from '../models/Citizen';
import { UserRole } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../services/auditService';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, citizenId, phone, address, age } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Email, password, and name are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'EMAIL_EXISTS', message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role && Object.values(UserRole).includes(role) ? role : UserRole.CITIZEN;
    const finalCitizenId = citizenId || (userRole === UserRole.CITIZEN ? `CIT-${Math.floor(1000 + Math.random() * 9000)}` : undefined);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role: userRole,
      citizenId: finalCitizenId
    });

    await newUser.save();

    // If citizen, create demographic record
    if (userRole === UserRole.CITIZEN && finalCitizenId) {
      const existingCitizen = await Citizen.findOne({ citizenId: finalCitizenId });
      if (!existingCitizen) {
        await Citizen.create({
          citizenId: finalCitizenId,
          name,
          dob: new Date(Date.now() - (age || 25) * 365 * 24 * 60 * 60 * 1000),
          age: age || 25,
          gender: 'Other',
          phone: phone || '+91 9876543210',
          email,
          address: address || 'New Delhi, India',
          category: 'General'
        });
      }
    }

    const jwtSecret = process.env.JWT_SECRET || 'govconnect_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role, citizenId: newUser.citizenId },
      jwtSecret,
      { expiresIn: '1d' }
    );

    await logAuditEvent({
      userId: newUser._id.toString(),
      userEmail: newUser.email,
      role: newUser.role,
      action: 'USER_REGISTER',
      citizenId: newUser.citizenId,
      status: 'SUCCESS'
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        citizenId: newUser.citizenId
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logAuditEvent({
        userEmail: email,
        action: 'LOGIN_FAILED',
        status: 'FAILED',
        details: { reason: 'Password mismatch' }
      });
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'govconnect_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, citizenId: user.citizenId },
      jwtSecret,
      { expiresIn: '1d' }
    );

    await logAuditEvent({
      userId: user._id.toString(),
      userEmail: user.email,
      role: user.role,
      action: 'USER_LOGIN',
      citizenId: user.citizenId,
      status: 'SUCCESS'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        citizenId: user.citizenId
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User profile not found.' });
    }

    let citizenDetails = null;
    if (user.citizenId) {
      citizenDetails = await Citizen.findOne({ citizenId: user.citizenId });
    }

    res.json({
      user,
      citizenDetails
    });
  } catch (error: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
};
