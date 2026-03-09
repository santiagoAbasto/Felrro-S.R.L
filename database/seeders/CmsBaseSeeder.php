<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\PageSection;

class CmsBaseSeeder extends Seeder
{
    public function run()
    {
        /*
        |--------------------------------------------------------------------------
        | HOME PAGE
        |--------------------------------------------------------------------------
        */

        $home = Page::firstOrCreate(
            ['slug' => 'home'],
            [
                'title' => [
                    'es' => 'Inicio',
                    'en' => 'Home'
                ],
                'is_active' => true
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | HERO SECTION (REAL CONTENIDO)
        |--------------------------------------------------------------------------
        */

        if (! $home->sections()->where('type', 'hero')->exists()) {

            PageSection::create([
                'page_id' => $home->id,
                'type' => 'hero',

                'title' => [
                    'es' => 'Cables especiales con calidad certificada',
                    'en' => 'Special cables with certified quality'
                ],

                'subtitle' => [
                    'es' => 'Más de 40 años desarrollando soluciones a medida para la industria.',
                    'en' => 'More than 40 years developing custom solutions for the industry.'
                ],

                'button_text' => [
                    'es' => 'Ver Productos',
                    'en' => 'View Products'
                ],

                'button_link' => '#',

                'image' => 'images/home.png',

                'order' => 1,
                'is_active' => true
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | ABOUT SECTION (TEXTO REAL EMPRESA)
        |--------------------------------------------------------------------------
        */

        if (! $home->sections()->where('type', 'about')->exists()) {

            PageSection::create([
                'page_id' => $home->id,
                'type' => 'about',

                'title' => [
                    'es' => 'Sobre Nosotros',
                    'en' => 'About Us'
                ],

                'content' => [
                    'es' =>
                    "ATECO CABLES SRL es una empresa familiar que desde el año 1990 atiende al mercado de cables, principalmente de energía y de hasta 33kV.\n\n" .
                        "El funcionamiento de nuestra actividad está basado en brindar soluciones a nuestros clientes, mediante el asesoramiento técnico y la comercialización del producto. La estrategia consiste en profundizar y adecuar estos conceptos para poder lograr una integración con las necesidades que se requieren en el desarrollo de los proyectos.",

                    'en' =>
                    "ATECO CABLES SRL is a family company that since 1990 serves the cable market, mainly energy cables up to 33kV.\n\n" .
                        "Our activity is based on providing solutions through technical advisory and product commercialization. Our strategy focuses on adapting to project development needs."
                ],

                'button_text' => [
                    'es' => 'Más información',
                    'en' => 'More information'
                ],

                'button_link' => '#',

                // 🔥 Imagen REAL que usabas
                'image' => 'images/nosotros.png',

                'order' => 2,
                'is_active' => true
            ]);
        }
    }
}
