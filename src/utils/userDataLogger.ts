
import { User, Relationship, Chat, UserActivityLog, WaliChat } from "@/types/user";

/**
 * Debug utility to log specific user data models to the console
 */
export const logUserData = (data: any, type: string) => {
  console.group(`Debug: ${type} Data`);
  console.log(data);
  console.groupEnd();
};

/**
 * Debug utility to log relationships data
 */
export const logRelationshipData = (relationships: Relationship[]) => {
  if (!relationships || !Array.isArray(relationships)) {
    console.log("No relationship data available or invalid format");
    return;
  }
  
  console.group("Relationships Data");
  console.log(`Total relationships: ${relationships.length}`);
  
  if (relationships.length > 0) {
    console.log("Status breakdown:");
    const pending = relationships.filter(r => r.status === 'pending').length;
    const matched = relationships.filter(r => r.status === 'matched').length;
    const rejected = relationships.filter(r => r.status === 'rejected').length;
    
    console.log(`- Pending: ${pending}`);
    console.log(`- Matched: ${matched}`);
    console.log(`- Rejected: ${rejected}`);
    
    console.log("Sample relationship data:");
    console.log(relationships[0]);
  }
  
  console.groupEnd();
};

/**
 * Debug utility to log chat data
 */
export const logChatData = (chats: Chat[]) => {
  if (!chats || !Array.isArray(chats)) {
    console.log("No chat data available or invalid format");
    return;
  }
  
  console.group("Chat Data");
  console.log(`Total messages: ${chats.length}`);
  
  if (chats.length > 0) {
    console.log("Status breakdown:");
    const unread = chats.filter(c => c.status === 'UNREAD').length;
    const read = chats.filter(c => c.status === 'READ').length;
    
    console.log(`- Unread: ${unread}`);
    console.log(`- Read: ${read}`);
    
    console.log("Sample chat message:");
    console.log(chats[0]);
  }
  
  console.groupEnd();
};

/**
 * Debug utility to log user activity data
 */
export const logActivityData = (activities: UserActivityLog[]) => {
  if (!activities || !Array.isArray(activities)) {
    console.log("No activity data available or invalid format");
    return;
  }
  
  console.group("User Activity Data");
  console.log(`Total activities: ${activities.length}`);
  
  if (activities.length > 0) {
    console.log("Action breakdown:");
    const viewed = activities.filter(a => a.action === 'VIEWED').length;
    const followed = activities.filter(a => a.action === 'FOLLOWED').length;
    const rejected = activities.filter(a => a.action === 'REJECTED').length;
    const withdrew = activities.filter(a => a.action === 'WITHDREW').length;
    
    console.log(`- Viewed: ${viewed}`);
    console.log(`- Followed: ${followed}`);
    console.log(`- Rejected: ${rejected}`);
    console.log(`- Withdrew: ${withdrew}`);
    
    console.log("Sample activity data:");
    console.log(activities[0]);
  }
  
  console.groupEnd();
};

/**
 * Debug utility to log wali chat data
 */
export const logWaliChatData = (waliChats: WaliChat[]) => {
  if (!waliChats || !Array.isArray(waliChats)) {
    console.log("No wali chat data available or invalid format");
    return;
  }
  
  console.group("Wali Chat Data");
  console.log(`Total wali chats: ${waliChats.length}`);
  
  if (waliChats.length > 0) {
    console.log("Sample wali chat data:");
    console.log(waliChats[0]);
  }
  
  console.groupEnd();
};
