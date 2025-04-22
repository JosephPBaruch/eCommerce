import { ListingDetails } from './listing';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  cart: string;
}

export interface ReturnedListingDetails extends Partial<ListingDetails> {
  name: string;
}

export interface FullCartItem extends CartItem {
  listing: ReturnedListingDetails;
}