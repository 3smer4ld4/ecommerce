
const API_URL = process.env.API_URL;

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string | number;
  stock: number;
  image: string | null;
  is_active: boolean;
};

type ProductsResponse = {
  data: Product[];
};

export async function getProducts(): Promise<Product[]> {
  if (!API_URL) {
    throw new Error("No se ha configurado API_URL");
  }

  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los productos");
  }

  const result: ProductsResponse = await response.json();

  return result.data;
}
