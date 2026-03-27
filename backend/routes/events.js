import express from 'express';
import QRCode from 'qrcode';
import Event from '../models/Event.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/events/my-events — Student's registered events (must be BEFORE /:id)
router.get('/my-events', authenticate, async (req, res) => {
    try {
        const events = await Event.find({ registeredUsers: req.user._id })
            .populate('createdBy', 'name email')
            .sort({ date: -1 });

        // Generate QR codes for each registration
        const eventsWithQR = await Promise.all(
            events.map(async (event) => {
                const qrData = JSON.stringify({
                    eventId: event._id,
                    eventTitle: event.title,
                    userId: req.user._id,
                    userName: req.user.name,
                    rollNumber: req.user.rollNumber,
                    registeredAt: new Date().toISOString(),
                });
                const qrCode = await QRCode.toDataURL(qrData);
                return { ...event.toObject(), qrCode };
            })
        );

        res.json(eventsWithQR);
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// GET /api/events — List all events (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { department, status, eventType, search } = req.query;
        const filter = {};

        if (department && department !== 'All Departments') {
            filter.department = department;
        }
        if (status) {
            filter.status = status;
        }
        if (eventType) {
            filter.eventType = eventType;
        }
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        const events = await Event.find(filter)
            .populate('createdBy', 'name email')
            .sort({ date: -1 });

        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// GET /api/events/:id — Single event detail
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('registeredUsers', 'name email rollNumber department');

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.json(event);
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// POST /api/events — Create event (admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
    try {
        const {
            title, description, date, endDate, venue, department,
            organizerName, maxCapacity, eventType, status, poster,
        } = req.body;

        const event = await Event.create({
            title,
            description: description || '',
            date,
            endDate: endDate || date,
            venue,
            department,
            organizerName,
            maxCapacity,
            eventType: eventType || 'Other',
            status: status || 'Upcoming',
            poster: poster || '',
            createdBy: req.user._id,
        });

        const populated = await event.populate('createdBy', 'name email');
        res.status(201).json(populated);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// PUT /api/events/:id — Update event (admin only)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.json(event);
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// DELETE /api/events/:id — Delete event (admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// POST /api/events/:id/register — Student registers for event
router.post('/:id/register', authenticate, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Check if already registered
        if (event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already registered for this event.' });
        }

        // Check capacity
        if (event.registeredUsers.length >= event.maxCapacity) {
            return res.status(400).json({ message: 'Event is at full capacity.' });
        }

        // Check if event is upcoming
        if (event.status === 'Completed') {
            return res.status(400).json({ message: 'Cannot register for a completed event.' });
        }

        event.registeredUsers.push(req.user._id);
        await event.save();

        // Generate QR code
        const qrData = JSON.stringify({
            eventId: event._id,
            eventTitle: event.title,
            userId: req.user._id,
            userName: req.user.name,
            rollNumber: req.user.rollNumber,
            registeredAt: new Date().toISOString(),
        });
        const qrCode = await QRCode.toDataURL(qrData);

        res.json({ message: 'Successfully registered!', qrCode, event });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// POST /api/events/:id/unregister — Student unregisters from event
router.post('/:id/unregister', authenticate, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        const index = event.registeredUsers.indexOf(req.user._id);
        if (index === -1) {
            return res.status(400).json({ message: 'You are not registered for this event.' });
        }

        event.registeredUsers.splice(index, 1);
        await event.save();

        res.json({ message: 'Successfully unregistered.' });
    } catch (error) {
        console.error('Unregister error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// GET /api/events/:id/registrations — View registrations (admin only)
router.get('/:id/registrations', authenticate, adminOnly, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('registeredUsers', 'name email rollNumber department phone');

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.json({
            eventTitle: event.title,
            totalRegistered: event.registeredUsers.length,
            maxCapacity: event.maxCapacity,
            registrations: event.registeredUsers,
        });
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

export default router;
