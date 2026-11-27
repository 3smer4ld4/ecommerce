
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/api";
import { createOrderAction } from "@/app/actions/orders";

type CartItem = {
  product: Product;
  quantity: number;
};

export default function Cart({ products }: { products: Product[] }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const router = useRouter();

  // Agregar productos
  function addProduct(product: Product) {
    setOrderError("");

    if (product.stock <= 0) {
      setOrderError("Este producto no tiene existencias.");
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          setOrderError("No hay suficiente stock disponible.");
          return currentItems;
        }

        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });

    setIsOpen(true);
  }

  // Cambiar cantidades
  function changeQuantity(productId: number, amount: number) {
    setOrderError("");

    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.product.id !== productId) return item;

          const newQuantity = item.quantity + amount;

          if (newQuantity > item.product.stock) {
            setOrderError("No hay suficiente stock disponible.");
            return item;
          }

          return { ...item, quantity: newQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  // Eliminar productos
  function removeProduct(productId: number) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  }

  // Crear pedido
  async function handleCreateOrder() {
    if (items.length === 0 || isCreatingOrder) return;

    setIsCreatingOrder(true);
    setOrderError("");

    try {
      const result = await createOrderAction(
        items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        }))
      );

      if (result.error) {
        setOrderError(result.error);
        return;
      }

      if (result.orderId) {
        setItems([]);
        setIsOpen(false);
        router.push(`/checkout/${result.orderId}`);
      }
    } catch {
      setOrderError(
        "No fue posible crear el pedido. Inténtalo nuevamente."
      );
    } finally {
      setIsCreatingOrder(false);
    }
  }

  // Total y cantidad
  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      {/* Catálogo */}
      <section
        id="productos"
        className="mx-auto max-w-7xl px-6 py-12"
      >
        <h2 className="mb-3 text-3xl font-bold">
          Nuestros productos
        </h2>

        <p className="mb-10 text-gray-400">
          Encuentra la tecnología que necesitas.
        </p>

        {products.length === 0 ? (
          <p className="text-gray-400">
            No hay productos disponibles.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl border border-slate-700 bg-[#11182b]"
              >
                <div className="flex h-56 items-center justify-center bg-slate-800">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      unoptimized
                      className="h-full w-full object-contain p-5"
                    />
                  ) : (
                    <span className="text-6xl">📦</span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm text-gray-400">
                    {product.description ||
                      "Producto tecnológico de TechStore."}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xl font-bold text-indigo-400">
                      ${Number(product.price).toFixed(2)}
                    </span>

                    <span className="text-sm text-gray-400">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <button
                    onClick={() => addProduct(product)}
                    disabled={product.stock <= 0}
                    className="mt-5 w-full rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {product.stock > 0
                      ? "Agregar al carrito"
                      : "Agotado"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Botón flotante del carrito */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-indigo-600 px-6 py-4 font-semibold shadow-lg hover:bg-indigo-500"
      >
        🛒 Carrito ({count})
      </button>

      {/* Panel del carrito */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Tu carrito
            </h2>

            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-slate-400 hover:text-white"
              aria-label="Cerrar carrito"
            >
              ×
            </button>
          </div>

          {items.length === 0 ? (
            <p className="py-6 text-center text-slate-400">
              Tu carrito está vacío.
            </p>
          ) : (
            <div className="max-h-80 space-y-4 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 border-b border-slate-700 pb-4"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        unoptimized
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">
                      {item.product.name}
                    </h3>

                    <p className="text-sm text-slate-400">
                      ${Number(item.product.price).toFixed(2)} c/u
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() =>
                          changeQuantity(item.product.id, -1)
                        }
                        className="rounded bg-slate-700 px-2 hover:bg-slate-600"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          changeQuantity(item.product.id, 1)
                        }
                        disabled={
                          item.quantity >= item.product.stock
                        }
                        className="rounded bg-slate-700 px-2 hover:bg-slate-600 disabled:opacity-40"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          removeProduct(item.product.id)
                        }
                        className="ml-auto text-sm text-red-400 hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total y botón de pago */}
          <div className="mt-5 border-t border-slate-700 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {orderError && (
              <p className="mt-3 text-sm text-red-400">
                {orderError}
              </p>
            )}

            <button
              onClick={handleCreateOrder}
              disabled={
                isCreatingOrder || items.length === 0
              }
              className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingOrder
                ? "Creando pedido..."
                : "Continuar al pago"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
