const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the tokens
const tokenSchema = new Schema(
  {
    email: {
      type: String,
      required: true, // Ensure the email is always provided
      unique: true, // Each user should have a unique email, or you may use a different unique identifier
    },
    token: {
      type: String,
      required: true, // The token itself should be required
    },
    permissions: [
      {
        category: {
          type: String,
          enum: ['Diet', 'Exercise', 'Health'], // Categories for which permissions are granted
          required: true,
        },
        granted: {
          type: Boolean,
          required: true, // Whether permission is granted for the category
        },
      },
    ],
    issuedAt: {
      type: Date,
      default: Date.now, // Store the time when the token was generated
    },
    expiresAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Store the last updated time
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model from the schema
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
