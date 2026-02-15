// This helper handles all the messy "Refresh Token" logic for you.

const API_URL = 'http://localhost:3500';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // 1. Get the current token
  let token = localStorage.getItem('accessToken');

  // 2. Prepare headers (add Authorization if we have a token)
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. Configure the fetch options
  const config = {
    ...options,
    headers,
    // IMPORTANT: This allows cookies (the refresh token) to be sent/received
    credentials: 'include' as RequestCredentials, 
  };

  // 4. Attempt the Request
  let response = await fetch(`${API_URL}${endpoint}`, config);

  // 5. Handle "403 Forbidden" (Token Expired)
  if (response.status === 403) {
    console.log("Token expired. Attempting refresh...");
    
    try {
      // Hit the refresh endpoint (it uses the httpOnly cookie)
      const refreshRes = await fetch(`${API_URL}/refresh`, {
        method: 'GET',
        credentials: 'include', // Send the cookie
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        // Save the new token
        localStorage.setItem('accessToken', data.accessToken);
        
        // Retry the original request with the new token
        headers['Authorization'] = `Bearer ${data.accessToken}`;
        response = await fetch(`${API_URL}${endpoint}`, { ...config, headers });
      } else {
        // Refresh failed (Session dead) -> Logout user
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    } catch (err) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      throw err;
    }
  }

  return response;
};