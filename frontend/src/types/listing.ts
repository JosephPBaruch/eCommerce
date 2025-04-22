export interface UserListingSummary {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    brand: string;
    created_at: string;
    updated_at: string;
}

export interface ListingsResponse {
    listings: UserListingSummary[];
}

export interface ListingFormData {
    title: string;
    description: string;
    category: string;
    condition: string;
    price: string;
    quantity: string;
    brand: string;
    imageUrl: string;
}

export type CreateType = {
    name: string;
    description: string;
    price: string;
    image: string | null;
    type: string;
    brand: string;
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
    id: string;
    url: string;
    altText?: string;
}

export interface SellerInfo {
    id: string;
    username: string;
    avatarUrl?: string;
}

export interface ListingDetails {
    id: string;
    title: string;
    description: string;
    price: number;
    category: { id: string; name: string };
    condition: { id: string; name: string };
    status: 'Active' | 'Sold' | 'Inactive' | 'Draft';
    dateListed: string;
    images: ListingImageData[];
    quantity: number;
    brand?: string;
    seller: SellerInfo;
}

export interface ListingCardData {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
}

export interface ListingsApiResponse {
    listings: ListingCardData[];
}

export type ListingEditFormData = Omit<ListingDetails, 'id' | 'seller' | 'dateListed' | 'images' | 'price' | 'quantity' | 'category' | 'condition' | 'status'> & {
    price: string;
    quantity: string;
    category: string;
    condition: string;
};


export interface OrderSummary {
    id: string;
    date: string;
    status: 'Received' | 'Shipped' | 'Delivered';
}

export interface ApiOrder {
    id: string;
    created_at: string;
    status: 'Received' | 'Shipped' | 'Delivered';
    cart: string | null;
}

export interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    cart: string;
    product_name?: string;
    price?: number;
}

export interface Cart {
    id: string;
    user: string;
    created_at: string;
    status: string;
    shipping_address: string;
    billing_address: string;
    items: CartItem[];
}

export interface Order {
    id: string;
    created_at: string;
    status: 'Received' | 'Shipped' | 'Delivered';
    cart: string;
    cartData?: Cart;
}
