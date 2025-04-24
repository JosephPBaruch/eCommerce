import { ApiOrder, Order, Cart, CartItem } from '../types/listing';


const BASE_URL = import.meta.env.PROD
    ? `http://joestack.org:8080/v1`
    : '/api';

const getAuthHeader = (token: string | null): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

export const fetchOrders = async (token: string): Promise<ApiOrder[]> => {
    console.log('Fetching orders from API...');

    try {
        const response = await fetch(`${BASE_URL}/orders/`, {
            method: 'GET',
            headers: getAuthHeader(token),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please log in again.');
            }

            let errorBody = '';
            try {
                errorBody = await response.text();
            } catch (parseError) {
                throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorBody} ${parseError}`);

            }
        }

        const data: ApiOrder[] = await response.json();
        console.log('API Response:', data);


        return data.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    } catch (error) {
        console.error('Error fetching orders:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while fetching orders.');
    }
};

/**
 * Fetch detailed information for a specific order
 */
export const fetchOrderDetails = async (token: string, orderId: string): Promise<Order | null> => {
    console.log(`Fetching details for order: ${orderId}`);

    try {
        if (!token) {
            throw new Error('Authentication token not found');
        }


        const orderResponse = await fetch(`${BASE_URL}/orders/${orderId}/`, {
            headers: getAuthHeader(token),
        });

        if (!orderResponse.ok) {
            if (orderResponse.status === 404) {
                return null;
            }
            throw new Error(`Error fetching order: ${orderResponse.statusText}`);
        }

        const orderData: Order = await orderResponse.json();


        if (orderData.cart) {
            const cartResponse = await fetch(`${BASE_URL}/cart/${orderData.cart}/`, {
                headers: getAuthHeader(token),
            });

            if (!cartResponse.ok) {
                throw new Error(`Error fetching cart: ${cartResponse.statusText}`);
            }

            const cartData: Cart = await cartResponse.json();


            const cartItemsResponse = await fetch(`${BASE_URL}/cart/items/`, {
                headers: getAuthHeader(token),
            });

            if (!cartItemsResponse.ok) {
                throw new Error(`Error fetching cart items: ${cartItemsResponse.statusText}`);
            }

            const allCartItems = await cartItemsResponse.json();


            const cartItems: CartItem[] = allCartItems.filter((item: { cart: string }) =>
                item.cart === cartData.id
            );


            const itemsWithProductDetails = await Promise.all(
                cartItems.map(async (item: CartItem) => {
                    const productResponse = await fetch(`${BASE_URL}/products/${item.product_id}/`, {
                        headers: getAuthHeader(token),
                    });

                    if (productResponse.ok) {
                        const product = await productResponse.json();
                        return {
                            ...item,
                            product_name: product.name,
                            price: parseFloat(product.price)
                        };
                    }

                    return {
                        ...item,
                        product_name: 'Product unavailable',
                        price: 0
                    };
                })
            );


            orderData.cartData = {
                ...cartData,
                items: itemsWithProductDetails
            };
        }

        return orderData;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};
