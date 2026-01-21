import { API_URL } from '../utils/constants';

export const getAccessToken = async (): Promise<string> => {
  const response = await fetch(`${API_URL}/api/auth/token`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Authentication failed');
  }

  const data = await response.json();
  return data.access_token;
};