const mongoose = require('mongoose');
const User = require('../models/userModel');


/**
 this fucntion will calculate age
 */
async function calculateUserAge(userId) {
  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null; // Invalid userId
  }

  try {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          age: {
            $let: {
              vars: {
                birthYear: { $year: '$dob' },
                currentYear: { $year: new Date() },
              },
              in: { $subtract: ['$$currentYear', '$$birthYear'] },
            },
          },
        },
      },
    ];

    const result = await User.aggregate(pipeline);

    if (result.length === 0) {
      return null; // User not found
    }

    return result[0].age;
  } catch (error) {
    console.error('Error calculating user age:', error);
    throw error;
  }
}

module.exports = {
  calculateUserAge,
};
