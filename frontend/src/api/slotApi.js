const BASE_URL = "http://localhost:5000/api/slots";

// GET SLOTS
export const getSlots = async (token) => {
  const res = await fetch(`${BASE_URL}/available`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

// CREATE SLOT
export const createSlot = async (data, token) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};