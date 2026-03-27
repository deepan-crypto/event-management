import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        date: {
            type: Date,
            required: [true, 'Event date is required'],
        },
        endDate: {
            type: Date,
        },
        venue: {
            type: String,
            required: [true, 'Venue is required'],
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'BME', 'Placement Cell', 'All Departments'],
        },
        organizerName: {
            type: String,
            required: [true, 'Organizer name is required'],
            trim: true,
        },
        maxCapacity: {
            type: Number,
            required: [true, 'Max capacity is required'],
            min: 1,
        },
        registeredUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        eventType: {
            type: String,
            enum: ['Symposium', 'Workshop', 'Sports', 'Cultural', 'Seminar', 'Hackathon', 'Guest Lecture', 'Other'],
            default: 'Other',
        },
        status: {
            type: String,
            enum: ['Upcoming', 'Ongoing', 'Completed'],
            default: 'Upcoming',
        },
        poster: {
            type: String,
            default: '',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        prerequisites: {
            type: String,
            default: '',
        },
        resources: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Virtual for registration count
eventSchema.virtual('registrationCount').get(function () {
    return this.registeredUsers.length;
});

// Ensure virtuals are included in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

export default mongoose.model('Event', eventSchema);
