
/**
 * Server logger utility to log various model data to the server console
 */
const User = require('../models/User');
const Chat = require('../models/Chat');
const Relationship = require('../models/Relationship');
const UserActivityLog = require('../models/UserActivityLog');
const WaliChat = require('../models/WaliChat');

/**
 * Log formatted data to server console
 */
const logData = (title, data) => {
  console.log('\n==========================================');
  console.log(`${title.toUpperCase()}`);
  console.log('==========================================');
  console.log(JSON.stringify(data, null, 2));
  console.log('==========================================\n');
};

/**
 * Log user data for a specific user or all users
 */
const logUserData = async (userId = null) => {
  try {
    if (userId) {
      const user = await User.findById(userId).select('-password');
      logData(`User data for ID: ${userId}`, user);
      return user;
    } else {
      const users = await User.find().select('-password').limit(5);
      logData('Sample users data (5 records)', users);
      return users;
    }
  } catch (error) {
    console.error('Error logging user data:', error);
    return null;
  }
};

/**
 * Log chat data for a specific user or all chats
 */
const logChatData = async (userId = null) => {
  try {
    let chats;
    if (userId) {
      chats = await Chat.find({
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }).limit(10);
      logData(`Chat data for user ID: ${userId} (up to 10 records)`, chats);
    } else {
      chats = await Chat.find().limit(10);
      logData('Sample chat data (10 records)', chats);
    }
    return chats;
  } catch (error) {
    console.error('Error logging chat data:', error);
    return null;
  }
};

/**
 * Log relationship data for a specific user or all relationships
 */
const logRelationshipData = async (userId = null) => {
  try {
    let relationships;
    if (userId) {
      relationships = await Relationship.find({
        $or: [
          { follower_user_id: userId },
          { followed_user_id: userId }
        ]
      });
      logData(`Relationship data for user ID: ${userId}`, relationships);
    } else {
      relationships = await Relationship.find().limit(10);
      logData('Sample relationship data (10 records)', relationships);
    }
    return relationships;
  } catch (error) {
    console.error('Error logging relationship data:', error);
    return null;
  }
};

/**
 * Log user activity data for a specific user or all activities
 */
const logActivityData = async (userId = null) => {
  try {
    let activities;
    if (userId) {
      activities = await UserActivityLog.find({
        $or: [
          { userId: userId },
          { receiverId: userId }
        ]
      });
      logData(`Activity data for user ID: ${userId}`, activities);
    } else {
      activities = await UserActivityLog.find().limit(10);
      logData('Sample activity data (10 records)', activities);
    }
    return activities;
  } catch (error) {
    console.error('Error logging activity data:', error);
    return null;
  }
};

/**
 * Log wali chat data for a specific user or all wali chats
 */
const logWaliChatData = async (userId = null) => {
  try {
    let waliChats;
    if (userId) {
      waliChats = await WaliChat.find({ wardid: userId });
      logData(`Wali chat data for user ID: ${userId}`, waliChats);
    } else {
      waliChats = await WaliChat.find().limit(10);
      logData('Sample wali chat data (10 records)', waliChats);
    }
    return waliChats;
  } catch (error) {
    console.error('Error logging wali chat data:', error);
    return null;
  }
};

/**
 * Log all data for a specific user
 */
const logAllDataForUser = async (userId) => {
  console.log(`\n\n========== LOGGING ALL DATA FOR USER ID: ${userId} ==========\n`);
  
  const user = await logUserData(userId);
  await logChatData(userId);
  await logRelationshipData(userId);
  await logActivityData(userId);
  await logWaliChatData(userId);
  
  console.log(`\n========== COMPLETED LOGGING ALL DATA FOR USER ID: ${userId} ==========\n\n`);
  
  return user ? true : false;
};

/**
 * Log sample data from all models
 */
const logAllModelData = async () => {
  console.log('\n\n========== LOGGING SAMPLE DATA FROM ALL MODELS ==========\n');
  
  await logUserData();
  await logChatData();
  await logRelationshipData();
  await logActivityData();
  await logWaliChatData();
  
  console.log('\n========== COMPLETED LOGGING SAMPLE DATA FROM ALL MODELS ==========\n\n');
  
  return true;
};

module.exports = {
  logUserData,
  logChatData,
  logRelationshipData,
  logActivityData,
  logWaliChatData,
  logAllDataForUser,
  logAllModelData
};
