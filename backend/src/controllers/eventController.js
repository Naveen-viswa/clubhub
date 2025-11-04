const { dbHelpers, tables } = require('../config/dynamodb');
const { success, error, notFound } = require('../utils/responseHelper');
const { v4: uuidv4 } = require('uuid');

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await dbHelpers.scanTable(tables.events);
    return success(res, events);
  } catch (err) {
    console.error('Get all events error:', err);
    return error(res, 'Failed to get events', 500);
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await dbHelpers.getItem(tables.events, { eventId });
    
    if (!event) {
      return notFound(res, 'Event');
    }

    return success(res, event);
  } catch (err) {
    console.error('Get event error:', err);
    return error(res, 'Failed to get event', 500);
  }
};

// Get events by club
const getEventsByClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    
    const allEvents = await dbHelpers.scanTable(tables.events);
    const clubEvents = allEvents.filter(event => event.clubId === clubId);
    
    return success(res, clubEvents);
  } catch (err) {
    console.error('Get club events error:', err);
    return error(res, 'Failed to get club events', 500);
  }
};

// Create event (Admin or Event Coordinator)
const createEvent = async (req, res) => {
  try {
    const { clubId, eventName, description, date, venue, maxParticipants } = req.body;

    if (!clubId || !eventName || !date) {
      return error(res, 'clubId, eventName, and date are required', 400);
    }

    // Verify club exists
    const club = await dbHelpers.getItem(tables.clubs, { clubId });
    if (!club) {
      return notFound(res, 'Club');
    }

    const eventId = `event-${uuidv4()}`;
    
    const newEvent = {
      eventId,
      clubId,
      eventName,
      description: description || '',
      date,
      venue: venue || 'TBA',
      maxParticipants: maxParticipants || 100,
      registeredUsers: [],
      createdBy: req.user.userId,
      status: 'Upcoming',
      createdAt: new Date().toISOString()
    };

    await dbHelpers.putItem(tables.events, newEvent);
    
    return success(res, newEvent, 'Event created successfully', 201);
  } catch (err) {
    console.error('Create event error:', err);
    return error(res, 'Failed to create event', 500);
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { eventName, description, date, venue, status, maxParticipants } = req.body;

    const existingEvent = await dbHelpers.getItem(tables.events, { eventId });
    
    if (!existingEvent) {
      return notFound(res, 'Event');
    }

    const updatedEvent = {
      ...existingEvent,
      eventName: eventName || existingEvent.eventName,
      description: description || existingEvent.description,
      date: date || existingEvent.date,
      venue: venue || existingEvent.venue,
      status: status || existingEvent.status,
      maxParticipants: maxParticipants || existingEvent.maxParticipants,
      updatedAt: new Date().toISOString()
    };

    await dbHelpers.putItem(tables.events, updatedEvent);
    
    return success(res, updatedEvent, 'Event updated successfully');
  } catch (err) {
    console.error('Update event error:', err);
    return error(res, 'Failed to update event', 500);
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await dbHelpers.getItem(tables.events, { eventId });
    
    if (!event) {
      return notFound(res, 'Event');
    }

    await dbHelpers.deleteItem(tables.events, { eventId });
    
    return success(res, null, 'Event deleted successfully');
  } catch (err) {
    console.error('Delete event error:', err);
    return error(res, 'Failed to delete event', 500);
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    const event = await dbHelpers.getItem(tables.events, { eventId });
    
    if (!event) {
      return notFound(res, 'Event');
    }

    // Check if already registered
    if (event.registeredUsers.includes(userId)) {
      return error(res, 'Already registered for this event', 409);
    }

    // Check if event is full
    if (event.registeredUsers.length >= event.maxParticipants) {
      return error(res, 'Event is full', 400);
    }

    // Add user to registered users
    event.registeredUsers.push(userId);
    event.updatedAt = new Date().toISOString();

    await dbHelpers.putItem(tables.events, event);

    // Create registration record
    const registrationId = `reg-${uuidv4()}`;
    const registration = {
      registrationId,
      eventId,
      userId,
      registeredDate: new Date().toISOString(),
      status: 'Confirmed',
      attendanceStatus: 'Not Attended'
    };

    await dbHelpers.putItem(tables.registrations, registration);
    
    return success(res, { event, registration }, 'Successfully registered for event');
  } catch (err) {
    console.error('Register for event error:', err);
    return error(res, 'Failed to register for event', 500);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  getEventsByClub,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
};
