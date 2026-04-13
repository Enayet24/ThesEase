const SLOT_KEY = "slots";

// Get all slots
export const getSlots = () => {
  return JSON.parse(localStorage.getItem(SLOT_KEY)) || [];
};

// Save slots
export const saveSlots = (slots) => {
  localStorage.setItem(SLOT_KEY, JSON.stringify(slots));
};