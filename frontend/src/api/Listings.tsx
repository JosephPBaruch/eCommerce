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
  listingData: globalThis.FormData,
  accessToken: string | null,
): Promise<{ success: boolean; message: string; listingId?: string }> => {
  console.log('Submitting listing...');

  console.log(listingData)
  const response = await fetch('http://127.0.0.1:8080/products/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return { success: true, message: 'Listing created successfully!', listingId: result.id };
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

export const fetchListingDetails = async (accessToken: string, listingId: string): Promise<ListingDetails | null> => {
  console.log(`Fetching details for listing: ${listingId}`);

  try {
    const response = await fetch(`http://127.0.0.1:8080/products/${listingId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Listing not found
      }
      throw new Error(`Failed to fetch listing details: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      title: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: { id: data.type.toLowerCase(), name: data.type },
      condition: { id: 'unknown', name: 'Unknown' }, // Adjust if condition data is available
      status: 'Active', // Assuming active status; adjust if status is provided
      dateListed: data.created_at,
      images: data.image ? [{ id: 'img1', url: data.image, altText: `${data.name} image` }] : [],
      quantity: 1, // Default to 1; adjust if quantity data is available
      brand: data.brand,
      seller: { id: 'unknown', username: data.user }, // Adjust if seller ID is available
    };
  } catch (error) {
    console.error('Error fetching listing details:', error);
    throw error;
  }
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