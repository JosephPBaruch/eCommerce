import { UserProfileData, PublicUserProfileData } from '../types/userProfile';
import { UserListingSummary } from '../types/listing';

export const fetchUserProfileData = async (accessToken: string): Promise<UserProfileData> => {
  let email: string
  try {
    const response = await fetch(`http://127.0.0.1:8080/users/user-info/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // return {"null"} // Listing not found
      }
      throw new Error(`Failed to fetch listing details: ${response.statusText}`);
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
  if (username.toLowerCase() === 'unknownuser' || username.toLowerCase() === 'janedoe99') { // Example: jane is the logged-in user, maybe no public profile? Or use different data
     return null;
  }

  // --- Generate Mock Data ---
  // Usually fetched based on username
  const mockListings: UserListingSummary[] = [
    // Only ACTIVE listings for public view
    {
      id: 'listing201',
      title: 'Hand-Knitted Scarf - Blue Wool',
      price: 25.0,
      status: 'Active',
      dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      imageUrl: '/path/to/scarf.jpg', // Replace
    },
    {
      id: 'listing202',
      title: 'Used Graphic Design Textbook',
      price: 40.0,
      status: 'Active',
      dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      imageUrl: '/path/to/book.jpg', // Replace
    },
     {
      id: 'listing203',
      title: 'Collectible Action Figure - Mint',
      price: 75.50,
      status: 'Active',
      dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      // No image example
    },
  ];

  const mockProfile: PublicUserProfileData = {
    id: 'user456', // The ID of the user being viewed
    username: username, // Use the requested username
    avatarUrl: '/path/to/seller_avatar.jpg', // Replace
    joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400).toISOString(), // Joined > 1 year ago
    bio: "Passionate collector and creator. Selling unique finds and handmade goods. Fast shipping!",
    location: "Portland, OR",
    positiveFeedbackPercent: 98, // Example
    numSales: 53, // Example
    activeListings: mockListings,
  };
  // --- End Generate Mock Data ---

  return mockProfile;
};

