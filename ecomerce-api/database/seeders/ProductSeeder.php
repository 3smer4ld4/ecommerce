<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Teclado Mecánico RGB',
                'description' => 'Teclado mecánico con iluminación RGB y conexión USB.',
                'price' => 45.99,
                'stock' => 15,
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Mouse Inalámbrico',
                'description' => 'Mouse ergonómico inalámbrico con sensor óptico.',
                'price' => 18.50,
                'stock' => 25,
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Audífonos Gamer',
                'description' => 'Audífonos con micrófono integrado y sonido envolvente.',
                'price' => 35.00,
                'stock' => 10,
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Memoria USB 64GB',
                'description' => 'Memoria USB 3.0 de alta velocidad.',
                'price' => 12.99,
                'stock' => 30,
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Monitor LED 24 pulgadas',
                'description' => 'Monitor Full HD ideal para trabajo y entretenimiento.',
                'price' => 149.99,
                'stock' => 8,
                'image' => null,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}