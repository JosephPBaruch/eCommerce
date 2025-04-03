// src/types/userProfile.ts
import { UserListingSummary } from './listing';

export interface UserProfileData {
  email: string;
}

export interface OrderSummary {
    id: string;
    orderNumber: string;
    date: string; // ISO date string ideally
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending';
}

export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefaultShipping?: boolean;
    isDefaultBilling?: boolean;
}

// export interface UserProfileData {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     username?: string; // Optional
//     avatarUrl?: string; // Optional
//     joinDate: string; // ISO date string ideally
//     recentOrders: OrderSummary[];
//     addresses: Address[];

// }

export interface PublicUserProfileData {
  id: string; // User's ID
  username: string;
  avatarUrl?: string;
  joinDate: string; // ISO date string
  // Optional public fields:
  bio?: string;
  location?: string;
  // Example reputation fields (replace/add as needed)
  positiveFeedbackPercent?: number;
  numSales?: number;
  // Listings associated with this user
  activeListings: UserListingSummary[]; // Show only active listings publicly
}