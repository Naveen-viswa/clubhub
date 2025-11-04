const { dbHelpers, tables } = require('../config/dynamodb');
const { success, error, notFound } = require('../utils/responseHelper');

// Create user profile after Cognito signup
const createUserProfile = async (req, res) => {
  try {
    const { userId, email, fullName } = req.body;

    if (!userId || !email) {
      return error(res, 'userId and email are required', 400);
    }

    // Check if user already exists
    const existingUser = await dbHelpers.getItem(tables.users, { userId });
    if (existingUser) {
      return error(res, 'User profile already exists', 409);
    }

    // Create user profile
    const userProfile = {
      userId,
      email,
      fullName: fullName || email.split('@')[0],
      clubs: [],
      role: 'Member',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await dbHelpers.putItem(tables.users, userProfile);
    
    return success(res, userProfile, 'User profile created successfully', 201);
  } catch (err) {
    console.error('Create user profile error:', err);
    return error(res, 'Failed to create user profile', 500);
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token

    const userProfile = await dbHelpers.getItem(tables.users, { userId });
    
    if (!userProfile) {
      return notFound(res, 'User profile');
    }

    return success(res, userProfile);
  } catch (err) {
    console.error('Get user profile error:', err);
    return error(res, 'Failed to get user profile', 500);
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, phone, bio } = req.body;

    // Get existing profile
    const existingProfile = await dbHelpers.getItem(tables.users, { userId });
    
    if (!existingProfile) {
      return notFound(res, 'User profile');
    }

    // Update profile
    const updatedProfile = {
      ...existingProfile,
      fullName: fullName || existingProfile.fullName,
      phone: phone || existingProfile.phone,
      bio: bio || existingProfile.bio,
      updatedAt: new Date().toISOString()
    };

    await dbHelpers.putItem(tables.users, updatedProfile);
    
    return success(res, updatedProfile, 'Profile updated successfully');
  } catch (err) {
    console.error('Update user profile error:', err);
    return error(res, 'Failed to update profile', 500);
  }
};

module.exports = {
  createUserProfile,
  getUserProfile,
  updateUserProfile
};
