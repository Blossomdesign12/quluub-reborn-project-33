
import { logAllModelData } from "./debugLogger";

export const initDebugLogging = async () => {
  console.log("Initializing debug logging...");
  
  // Wait a bit for the app to initialize and auth to complete
  setTimeout(async () => {
    try {
      await logAllModelData();
      console.log("Initial debug logging completed");
    } catch (error) {
      console.error("Initial debug logging failed:", error);
    }
  }, 2000);
};
