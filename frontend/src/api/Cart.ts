import { CartItem, FullCartItem } from '../types/cart';

const BASE_URL = `http://joestack.org/v1`

const getAuthHeader = (accessToken: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
};


export const createCart = async (accessToken: string | null): Promise<{ id: string }> => {
  const response = await fetch(`${BASE_URL}/cart/`, {
    method: 'POST',
    headers: getAuthHeader(accessToken),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cart: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.id) {
    throw new Error('Cart not found');
  }
  return data.id;

}

export const getFullCartItem = async (item: CartItem, accessToken: string | null): Promise<FullCartItem> => {
  const response = await fetch(`${BASE_URL}/products/${item.product_id}/`, {
    method: 'GET',
    headers: getAuthHeader(accessToken),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cart item details: ${response.statusText}`);
  }

  const listing = await response.json();
  return { ...item, listing };
}


export const fetchCart = async (accessToken: string | null): Promise<{ id: string }> => {
  const response = await fetch(`${BASE_URL}/cart/`, {
    method: 'GET',
    headers: getAuthHeader(accessToken),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cart: ${response.statusText}`);
  }
  const data = await response.json();
  console.log(data);
  if (data.length === 0) {
    createCart(accessToken);
    return fetchCart(accessToken);
  }

  return data[0];
};


export const fetchCartItems = async (accessToken: string | null): Promise<FullCartItem[]> => {
  const response = await fetch(`${BASE_URL}/cart/items/`, {
    method: 'GET',
    headers: getAuthHeader(accessToken),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cart items: ${response.statusText}`);
  }

  const items: CartItem[] = await response.json();


  const fullItems = await Promise.all(
    items.map(item => getFullCartItem(item, accessToken))
  );

  return fullItems;
};


export const addCartItem = async (item: Partial<CartItem>, accessToken: string | null): Promise<FullCartItem> => {
  console.log("Attempting to add item to cart:", item);
  const response = await fetch(`${BASE_URL}/cart/items/`, {
    method: 'POST',
    headers: getAuthHeader(accessToken),
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(`Failed to add item to cart: ${response.statusText}`);
  }

  return getFullCartItem(await response.json(), accessToken);
};

export const updateCartItem = async (id: string, item: Partial<CartItem>, accessToken: string | null): Promise<FullCartItem> => {
  const response = await fetch(`${BASE_URL}/cart/items/${id}/`, {
    method: 'PUT',
    headers: getAuthHeader(accessToken),
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(`Failed to update cart item: ${response.statusText}`);
  }

  const updatedItem = await response.json();
  return getFullCartItem(updatedItem, accessToken);
};

export const deleteCartItem = async (id: string, accessToken: string | null): Promise<void> => {
  const response = await fetch(`${BASE_URL}/cart/items/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeader(accessToken),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete cart item: ${response.statusText}`);
  }
};
