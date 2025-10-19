import mongoose from 'mongoose';

// Define the structure of a User document (the Schema)
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please enter your full name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true, // Ensures no two users can register with the same email
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    // Optional: Mongoose will automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

// Create the Model from the Schema and export it
const User = mongoose.model('User', UserSchema);

export default User;