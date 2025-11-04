const { dbHelpers, tables } = require('../config/dynamodb');
const { success, error, notFound } = require('../utils/responseHelper');
const { v4: uuidv4 } = require('uuid');

// Get all clubs
const getAllClubs = async (req, res) => {
  try {
    const clubs = await dbHelpers.scanTable(tables.clubs);
    return success(res, clubs);
  } catch (err) {
    console.error('Get all clubs error:', err);
    return error(res, 'Failed to get clubs', 500);
  }
};

// Get single club
const getClubById = async (req, res) => {
  try {
    const { clubId } = req.params;
    
    const club = await dbHelpers.getItem(tables.clubs, { clubId });
    
    if (!club) {
      return notFound(res, 'Club');
    }

    return success(res, club);
  } catch (err) {
    console.error('Get club error:', err);
    return error(res, 'Failed to get club', 500);
  }
};

// Create club (Admin only)
const createClub = async (req, res) => {
  try {
    const { clubName, description, category } = req.body;

    if (!clubName) {
      return error(res, 'Club name is required', 400);
    }

    const clubId = `club-${uuidv4()}`;
    
    const newClub = {
      clubId,
      clubName,
      description: description || '',
      category: category || 'General',
      admins: [req.user.userId],
      members: [],
      eventCoordinators: [],
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      totalMembers: 0,
      upcomingEvents: 0
    };

    await dbHelpers.putItem(tables.clubs, newClub);
    
    return success(res, newClub, 'Club created successfully', 201);
  } catch (err) {
    console.error('Create club error:', err);
    return error(res, 'Failed to create club', 500);
  }
};

// Update club (Admin only)
const updateClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { clubName, description, category } = req.body;

    const existingClub = await dbHelpers.getItem(tables.clubs, { clubId });
    
    if (!existingClub) {
      return notFound(res, 'Club');
    }

    // Check if user is admin of this club
    if (!existingClub.admins.includes(req.user.userId)) {
      return error(res, 'Only club admins can update club', 403);
    }

    const updatedClub = {
      ...existingClub,
      clubName: clubName || existingClub.clubName,
      description: description || existingClub.description,
      category: category || existingClub.category,
      updatedAt: new Date().toISOString()
    };

    await dbHelpers.putItem(tables.clubs, updatedClub);
    
    return success(res, updatedClub, 'Club updated successfully');
  } catch (err) {
    console.error('Update club error:', err);
    return error(res, 'Failed to update club', 500);
  }
};

// Delete club (Admin only)
const deleteClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const club = await dbHelpers.getItem(tables.clubs, { clubId });
    
    if (!club) {
      return notFound(res, 'Club');
    }

    await dbHelpers.deleteItem(tables.clubs, { clubId });
    
    return success(res, null, 'Club deleted successfully');
  } catch (err) {
    console.error('Delete club error:', err);
    return error(res, 'Failed to delete club', 500);
  }
};

// Join club (Member)
const joinClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.userId;

    const club = await dbHelpers.getItem(tables.clubs, { clubId });
    
    if (!club) {
      return notFound(res, 'Club');
    }

    // Check if already a member
    if (club.members.includes(userId)) {
      return error(res, 'Already a member of this club', 409);
    }

    // Add user to club members
    club.members.push(userId);
    club.totalMembers = club.members.length;
    club.updatedAt = new Date().toISOString();

    await dbHelpers.putItem(tables.clubs, club);
    
    return success(res, club, 'Successfully joined club');
  } catch (err) {
    console.error('Join club error:', err);
    return error(res, 'Failed to join club', 500);
  }
};

module.exports = {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  joinClub
};
