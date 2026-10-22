import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { writeAudit } from '../models/AuditLog.js';
import { generateToken } from '../middleware/authMiddleware.js';

function isPasswordStrong(password) {
  if (password.length < 8) return false;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return hasNumber && hasSpecial;
}

export async function register(req, res) {
  try {
    const { name, email, password, contactNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long, contain at least one number and one special character.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'tourist',
      contactNumber: contactNumber?.trim() || undefined,
      failedLoginAttempts: 0
    });

    const token = generateToken(newUser);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    const userProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      contactNumber: newUser.contactNumber,
      createdAt: newUser.createdAt
    };

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to VisEntrixia.',
      token,
      user: userProfile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to complete registration. Please try again.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const now = Date.now();
    if (user.lockUntil && user.lockUntil > now) {
      const minutesRemaining = Math.ceil((user.lockUntil - now) / (60 * 1000));
      return res.status(429).json({
        success: false,
        message: `Account is temporarily locked due to 5 consecutive failed login attempts. Please try again in ${minutesRemaining} minute(s).`
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = now + 15 * 60 * 1000;
        user.failedLoginAttempts = 0;
        await user.save();

        await writeAudit({
          adminId: user.id,
          adminEmail: user.email,
          action: 'FAILED_LOGIN',
          details: `Account ${user.email} locked for 15 minutes after 5 failed login attempts.`
        });

        return res.status(429).json({
          success: false,
          message: 'Too many failed login attempts. Account locked for 15 minutes.'
        });
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: `Invalid email or password. Attempt ${user.failedLoginAttempts} of 5 before temporary lockout.`
      });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = generateToken(user);

    if (user.role === 'admin') {
      await writeAudit({
        adminId: user.id,
        adminEmail: user.email,
        action: 'ADMIN_LOGIN',
        details: 'Administrator logged into content management console.'
      });
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      contactNumber: user.contactNumber,
      createdAt: user.createdAt
    };

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userProfile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authentication error. Please try again.' });
  }
}

export function logout(req, res) {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully.' });
}

export function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }

  const userProfile = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    contactNumber: req.user.contactNumber,
    createdAt: req.user.createdAt
  };

  return res.json({ success: true, user: userProfile });
}
