import { UserListingSummary, ListingsResponse, ListingCardData } from '../types/listing'; // Adjust path
import { Category, Condition, ListingDetails, ListingImageData, SellerInfo  } from '../types/listing';


let mockUserListings: UserListingSummary[] = [
  // Initial mock data for the logged-in user
  {
    id: 'listing101',
    title: 'Stylish Wireless Headphones (Used - Like New)',
    price: 65.0,
    status: 'Active',
    dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    imageUrl: '/path/to/headphones.jpg', // Replace
    quantity: 1,
  },
  {
    id: 'listing102',
    title: 'Vintage Comic Book Collection',
    price: 150.0,
    status: 'Sold',
    dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    imageUrl: '/path/to/comics.jpg', // Replace
  },
  {
    id: 'listing103',
    title: 'Garden Gnome - Slightly Chipped',
    price: 10.0,
    status: 'Inactive',
    dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    // No image example
  },
   {
    id: 'listing104',
    title: 'Brand New Unopened Widget',
    price: 29.99,
    status: 'Active',
    dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    imageUrl: '/path/to/widget.jpg', // Replace
    quantity: 5,
  },
];
let nextListingId = 105; // Example for potential additions/deletions


// --- Mock API Function ---
export const submitListingApi = async (
  listingData: globalThis.FormData, // Use FormData for file uploads
  accessToken: string | null,
): Promise<{ success: boolean; message: string; listingId?: string }> => {
  console.log('Submitting listing...');
  // Log FormData entries (for debugging)
  for (let pair of listingData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
  }

  // --- Replace with actual fetch ---
  // const response = await fetch('/api/listings', {
  //   method: 'POST',
  //   headers: {
  //     // 'Content-Type': 'multipart/form-data' is set automatically by browser with FormData
  //     'Authorization': `Bearer ${accessToken}`,
  //   },
  //   body: listingData,
  // });
  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({})); // Try parsing error
  //   throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  // }
  // const result = await response.json();
  // return { success: true, message: 'Listing created successfully!', listingId: result.id };
  // --- End Replace ---

  // Simulate success/failure
  if (Math.random() > 0.1) {
    // Simulate success
    return { success: true, message: 'Listing created successfully!', listingId: 'newListing123' };
  } else {
    // Simulate failure
    throw new Error('Failed to create listing. Please try again.');
  }
};

export const fetchUserListings = async (
  userId: string, // User ID from auth context would be used here
  page: number,
  limit: number,
  accessToken: string | null,
): Promise<ListingsResponse> => {
  console.log(`Fetching listings for user: ${userId}, page: ${page}, limit: ${limit}`);
  // Add Authorization header if needed: headers: { 'Authorization': `Bearer ${accessToken}` }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate pagination
  const totalListings = mockUserListings.length;
  const totalPages = Math.ceil(totalListings / limit);
  const startIndex = (page - 1) * limit;
  const paginatedListings = mockUserListings.slice(startIndex, startIndex + limit);

  return {
    listings: paginatedListings,
    currentPage: page,
    totalPages: totalPages,
    totalCount: totalListings,
  };
};

export const deleteListingApi = async (
    listingId: string,
    accessToken: string | null
): Promise<void> => {
    console.log(`Deleting listing ${listingId}`);
    // Add Authorization header if needed: headers: { 'Authorization': `Bearer ${accessToken}` }
    await new Promise(resolve => setTimeout(resolve, 600));
    const initialLength = mockUserListings.length;
    mockUserListings = mockUserListings.filter(l => l.id !== listingId);
    if (mockUserListings.length === initialLength) {
        // throw new Error("Listing not found for deletion"); // Simulate error
    }
    // No return needed for successful delete
};

export const fetchListingDetails = async (listingId: string): Promise<ListingDetails | null> => {
  console.log(`Fetching details for listing: ${listingId}`);

  // Simulate not found
  if (listingId === 'not-found' || listingId === 'listing103') { // Example: listing 103 was inactive
    return null;
  }
  // Simulate error
  // if (listingId === 'error-id') {
  //   throw new Error("Database connection error");
  // }

  // --- Generate Mock Data ---
  // Usually fetched based on listingId
  const mockSeller: SellerInfo = {
    id: 'user456',
    username: 'SellerPro',
    avatarUrl: '/path/to/seller_avatar.jpg', // Replace
  };

  const mockImages: ListingImageData[] = [
    { id: 'img1', url: 'https://picsum.photos/400/300?random=1', altText: 'Headphones main view' }, // Replace
    { id: 'img2', url: 'https://picsum.photos/400/300?random=2', altText: 'Headphones side view' }, // Replace
    { id: 'img3', url: 'https://picsum.photos/400/300?random=3', altText: 'Headphones with box' }, // Replace
  ];

   const mockListing: ListingDetails = {
    id: listingId,
    title: listingId === 'listing101' ? 'Stylish Wireless Headphones (Used - Like New)' : 'Brand New Unopened Widget',
    description: "Experience immersive sound with these comfortable wireless headphones. Barely used, in excellent condition. Comes with original packaging and charging cable. Great battery life.\n\nPerfect for music lovers and commuters.",
    price: listingId === 'listing101' ? 65.00 : 29.99,
    category: { id: 'electronics', name: 'Electronics' },
    condition: { id: 'used_like_new', name: 'Used - Like New' },
    status: 'Active', // Assume only active listings are directly viewable usually
    dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    images: mockImages,
    quantity: listingId === 'listing101' ? 1 : 5,
    brand: listingId === 'listing101' ? 'AudioPhile' : 'WidgetCorp',
    seller: mockSeller,
  };
  // --- End Generate Mock Data ---

  return mockListing;
};

export const fetchActiveListings = async (accessToken: string | null): Promise<ListingCardData[]> => {
  console.log('Fetching active listings...');
  try {
    const response = await fetch('http://127.0.0.1:8080/products/listing/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      imageUrl: item.image || '', // Handle empty image
      description: item.description,
      price: item.price,
    }));
  } catch (error) {
    console.error('Error fetching active listings:', error);
    throw error;
  }
};

// Fetch listing details specifically for editing (might be same as view endpoint)
export const fetchListingForEdit = async (
    listingId: string,
    accessToken: string | null
): Promise<ListingDetails | null> => {
  console.log(`Fetching listing ${listingId} for editing`);
  // Add Authorization header: headers: { 'Authorization': `Bearer ${accessToken}` }
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate not found or not authorized (backend should check ownership)
  if (listingId === 'not-found' || listingId === 'unauthorized') {
    return null;
  }

  // Return mock data matching ListingDetails
   const mockImages: ListingImageData[] = [
    { id: 'img1', url: 'https://picsum.photos/400/300?random=1' }, // Replace
    { id: 'img2', url: 'https://picsum.photos/400/300?random=2' }, // Replace
  ];
  const mockSeller = { id: 'user1234', username: 'CurrentUser' }; // Simulate owned by current user

  return {
    id: listingId,
    title: 'Editable Wireless Headphones',
    description: "Good condition, works perfectly. Selling because I upgraded.",
    price: 55.00,
    category: { id: 'electronics', name: 'Electronics' },
    condition: { id: 'used_good', name: 'Used - Good' },
    status: 'Active',
    dateListed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    images: mockImages,
    quantity: 1,
    brand: 'AudioPhile',
    seller: mockSeller,
  };
};

export const updateListingApi = async (
  listingId: string,
  updateData: globalThis.FormData, // Use FormData for potential file uploads
  accessToken: string | null,
): Promise<{ success: boolean; message: string; listingId: string }> => {
  console.log(`Updating listing ${listingId}...`);
  // Log FormData entries (for debugging)
  for (let pair of updateData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
  }
  // Add Authorization header: headers: { 'Authorization': `Bearer ${accessToken}` }
  // await new Promise((resolve) => setTimeout(resolve, 1500));

  // --- Replace with actual fetch (likely PUT or PATCH) ---
  // const response = await fetch(`/api/listings/${listingId}`, {
  //   method: 'PUT', // or 'PATCH'
  //   headers: { 'Authorization': `Bearer ${accessToken}` },
  //   body: updateData,
  // });
  // if (!response.ok) { /* Handle error */ }
  // const result = await response.json();
  // return { success: true, message: 'Listing updated successfully!', listingId: result.id };
  // --- End Replace ---

  // Simulate success/failure
  if (Math.random() > 0.1) {
    return { success: true, message: 'Listing updated successfully!', listingId: listingId };
  } else {
    throw new Error('Failed to update listing. Please try again.');
  }
};