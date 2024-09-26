import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem, CartResponse } from "~/models/CartItem";
import { AvailableProduct } from "~/models/Product";

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const { data: { data: { cart } } } = await axios.get<CartResponse>(`${API_PATHS.cart}/api/profile/cart`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    });

    // probably NOT the best solution. Done for the sake of development speed
    const data = cart?.items.map(async item => {
      const productRes = await axios.get<AvailableProduct>(
        `${API_PATHS.product}/products/${item.product_id}`
      );

      return {
        id: item.id,
        cartId: cart.id,
        count: item.count,
        product: productRes.data
      }
    });

    return await Promise.all(data);
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) => {
    const updatedValues = {
        id: values.cartId,
        items: [
          {
            id: values.id,
            cart_id: values.cartId,
            product_id: values.product.id,
            count: values.count,
          }
        ]
    }

    return axios.put<CartItem[]>(`${API_PATHS.cart}/api/profile/cart`, updatedValues, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  });
}
