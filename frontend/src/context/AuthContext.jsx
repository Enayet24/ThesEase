import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// 🔧 MOCK USER — change role to 'student' to test student pages
const MOCK_USER = {
  _id: '664f1b2c9a4e2d001f8a1234',
  name: 'Ahmed Rahman',
  email: 'student@test.com',
  role: 'Student', // change to 'student' to test student pages
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);

  return (
    <AuthContext.Provider value={{ user, setUser, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);