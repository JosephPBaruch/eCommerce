export interface UserListingSummary {
    id: string;
    title: string;
    price: number;
    status: 'Active' | 'Sold' | 'Inactive' | 'Draft'; // Example statuses
    dateListed: string; // ISO date string
    imageUrl?: string; // Primary image URL
    quantity?: number; // Optional: if applicable
    // Add other relevant summary fields like view count, etc. if needed
}

export interface ListingsResponse {
    listings: UserListingSummary[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

export interface ListingFormData {
    title: string;
    description: string;
    category: string;
    condition: string;
    price: string;
    quantity: string;
    brand: string;
    images: File[] | undefined;
}

export interface Category {
    id: string;
    name: string;
}

export interface Condition {
    id: string;
    name: string;
}

export interface ListingImageData {
    id: string; // Or just use index if no specific ID
    url: string;
    altText?: string;
}

export interface SellerInfo {
    id: string; // User ID of the seller
    username: string;
    avatarUrl?: string;
}

export interface ListingDetails {
    id: string;
    title: string;
    description: string;
    price: number;
    category: { id: string; name: string }; // Include category details
    condition: { id: string; name: string }; // Include condition details
    status: 'Active' | 'Sold' | 'Inactive' | 'Draft'; // Status might influence view
    dateListed: string; // ISO date string
    images: ListingImageData[]; // Array of images
    quantity: number;
    brand?: string;
    seller: SellerInfo;

}

export interface ListingCardData {
    id: string;
    title: string;
    price: number;
    imageUrl?: string; // Primary image for the card
    categoryId: string;
    // Add other fields if needed for filtering/display later (e.g., category)
}

export interface ListingsApiResponse {
listings: ListingCardData[];
// Add pagination fields if your API supports them (e.g., totalPages, currentPage)
}

export type ListingEditFormData = Omit<ListingDetails, 'id' | 'seller' | 'dateListed' | 'images' | 'price' | 'quantity' | 'category' | 'condition' | 'status'> & {
    price: string;
    quantity: string;
    category: string; // Store category ID
    condition: string; // Store condition ID
};
