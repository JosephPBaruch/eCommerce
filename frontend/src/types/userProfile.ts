
import { UserListingSummary } from './listing';

export interface UserProfileData {
  email: string;
}

export interface OrderSummary {
    id: string;
    orderNumber: string;
    date: string; 
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


export interface PublicUserProfileData {
  id: string; 
  username: string;
  avatarUrl?: string;
  joinDate: string; 
  
  bio?: string;
  location?: string;
  
  positiveFeedbackPercent?: number;
  numSales?: number;
  
  activeListings: UserListingSummary[]; 
}