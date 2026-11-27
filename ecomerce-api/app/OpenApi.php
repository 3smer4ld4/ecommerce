<?php

namespace App;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "TechStore API",
    version: "1.0.0",
    description: "API REST para la tienda virtual TechStore."
)]
#[OA\Server(
    url: "http://127.0.0.1:8000/api",
    description: "Servidor local de desarrollo"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "Sanctum"
)]
class OpenApi
{
}
