import { UserProfileData, PublicUserProfileData } from '../types/userProfile';

export const fetchUserProfileData = async (accessToken: string|null): Promise<UserProfileData> => {
  let email: string
  if (!accessToken) {
    throw new Error('Unauthorized');
  }
  try {
    const response = await fetch(`http://joestack.org/v1/users/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Failed to fetch listing details: ${response.statusText}`);

      }
    }

    const data = await response.json();


    email = data.username;
  } catch (error) {
    console.error('Error fetching listing details:', error);
    throw error;
  }

  return {
    email
  }

};

export const fetchPublicUserProfile = async (username: string): Promise<PublicUserProfileData | null> => {
  console.log(`Fetching public profile for username: ${username}`);
  await new Promise((resolve) => setTimeout(resolve, 1100));

  // Simulate not found
  if (username.toLowerCase() === 'unknownuser' || username.toLowerCase() === 'janedoe99') { 
     return null;
  }

  const mockProfile: PublicUserProfileData = {
    id: 'user456', 
    username: username, 
    avatarUrl: '/path/to/seller_avatar.jpg', 
    joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400).toISOString(), 
    bio: "Passionate collector and creator. Selling unique finds and handmade goods. Fast shipping!",
    location: "Portland, OR",
    positiveFeedbackPercent: 98, 
    numSales: 53, 
    activeListings: [],
  };

  return mockProfile;
};

