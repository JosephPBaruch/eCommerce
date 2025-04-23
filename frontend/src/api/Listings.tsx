import { ListingsResponse, ListingCardData, CreateType } from '../types/listing';
import { ListingDetails } from '../types/listing';


const BASE_URL = import.meta.env.PROD
  ? `http://127.0.0.1:8080/v1`
  : '/api/v1';


const getAuthHeader = (accessToken: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
};


export const submitListingApi = async (
  listingData: CreateType,
  accessToken: string | null,
): Promise<{ success: boolean; message: string; listingId?: string }> => {
  if (!accessToken) {
    throw new Error('Authentication required. Please log in.');
  }

  try {
    console.log("Sending data to API:", listingData);
    const response = await fetch(`${BASE_URL}/products/`, {
      method: 'POST',
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, message: 'Listing created successfully!', listingId: result.id };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchUserListings = async (
  accessToken: string | null,
): Promise<ListingsResponse> => {
  try {

    const response = await fetch(`${BASE_URL}/products/user-products/`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user listings: ${response.statusText}`);
    }
    const data = await response.json();



    return {
      listings: data,
    };
  } catch (error) {
    console.error('Error fetching user listings:', error);
    throw error;
  }
};

export const deleteListingApi = async (
  listingId: string,
  accessToken: string | null
): Promise<void> => {
  try {

    const response = await fetch(`${BASE_URL}/products/${listingId}/delete/`, {
      method: "DELETE",
      headers: getAuthHeader(accessToken),
    });


    if (!response.ok) {
      throw new Error(`Failed to delete listing: ${response.statusText}`);
    }
    console.log(`Listing ${listingId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const fetchListingDetails = async (accessToken: string | null, listingId: string): Promise<ListingDetails | null> => {
  try {

    const response = await fetch(`${BASE_URL}/products/${listingId}/`, {
      method: 'GET',
      headers: getAuthHeader(accessToken),
    });


    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch listing details: ${response.statusText}`);
    }

    const data = await response.json();


    return {
      id: data.id,
      title: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: { id: data.type?.toLowerCase() || 'other', name: data.type || 'Other' },
      condition: { id: 'unknown', name: 'Unknown' },
      status: 'Active',
      dateListed: data.created_at,
      images: data.image ? [{ id: 'img1', url: data.image, altText: `${data.name} image` }] : [],
      quantity: data.quantity !== undefined ? data.quantity : 1,
      brand: data.brand,
      seller: { id: data.user_id || 'unknown', username: data.user || 'unknown' },
    };
  } catch (error) {
    console.error('Error fetching listing details:', error);
    throw error;
  }
};


export const fetchActiveListings = async (): Promise<ListingCardData[]> => {
  try {

    const response = await fetch(`${BASE_URL}/products/`, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }
    const data = await response.json();


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      title: item.name,
      description: item.description,
      price: parseFloat(item.price),
      imageUrl: item.image || '',
      categoryId: item.type?.toLowerCase() || 'other',
      brand: item.brand,
      dateListed: item.created_at,
    }));
  } catch (error) {
    console.error('Error fetching active listings:', error);
    throw error;
  }
};

export const updateListingApi = async (
  listingId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateData: Record<string, any>,
  accessToken: string | null,
): Promise<{ success: boolean; message: string; listingId: string }> => {
  try {

    const response = await fetch(`${BASE_URL}/products/${listingId}/edit/`, {
      method: 'PATCH',
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(updateData),
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return { success: true, message: 'Listing updated successfully!', listingId: result.id };
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};