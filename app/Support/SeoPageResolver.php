<?php

namespace App\Support;

use Illuminate\Http\Request;

class SeoPageResolver
{
    public static function pages(): array
    {
        return [
            'home' => [
                'label' => 'Home',
                'recommended_title' => 'Definí una promesa clara de marca y el producto principal.',
                'recommended_description' => 'Resumí qué fabrica Felrro, para qué industrias y qué ventaja competitiva ofrece.',
                'recommended_keywords' => 'cables especiales, conductores eléctricos, cables industriales, fabricación argentina',
            ],
            'nosotros' => [
                'label' => 'Nosotros',
                'recommended_title' => 'Presentá a la empresa, trayectoria y diferencial técnico.',
                'recommended_description' => 'Contá quiénes son, qué experiencia tienen y qué tipo de soluciones desarrollan.',
                'recommended_keywords' => 'empresa de cables, trayectoria industrial, fabricantes de cables especiales',
            ],
            'sectores' => [
                'label' => 'Sectores',
                'recommended_title' => 'Enfocá el título en industrias o aplicaciones atendidas.',
                'recommended_description' => 'Describí los sectores para los que Felrro fabrica y adapta sus soluciones.',
                'recommended_keywords' => 'cables para industria, sectores industriales, aplicaciones eléctricas',
            ],
            'calidad' => [
                'label' => 'Calidad',
                'recommended_title' => 'Mencioná calidad, certificaciones y estándares.',
                'recommended_description' => 'Explicá políticas de calidad, controles y certificaciones disponibles.',
                'recommended_keywords' => 'calidad, certificaciones, normas, control de calidad, cables certificados',
            ],
            'descargas' => [
                'label' => 'Descargas',
                'recommended_title' => 'Dejá claro que la página reúne fichas, catálogos o material técnico.',
                'recommended_description' => 'Indicá qué documentación puede descargarse y para qué sirve.',
                'recommended_keywords' => 'catálogos, fichas técnicas, descargas, documentación técnica',
            ],
            'clientes' => [
                'label' => 'Clientes',
                'recommended_title' => 'Mostrá confianza, trayectoria comercial y rubros atendidos.',
                'recommended_description' => 'Presentá marcas, empresas o tipos de clientes que trabajan con Felrro.',
                'recommended_keywords' => 'clientes industriales, empresas, referencias comerciales',
            ],
            'productos.index' => [
                'label' => 'Productos',
                'recommended_title' => 'Nombrá el catálogo y el tipo de soluciones disponibles.',
                'recommended_description' => 'Explicá qué productos se pueden explorar y qué necesidad cubren.',
                'recommended_keywords' => 'catálogo de cables, productos industriales, cables especiales',
            ],
            'novedades' => [
                'label' => 'Novedades',
                'recommended_title' => 'Destacá noticias, lanzamientos o actualizaciones de la empresa.',
                'recommended_description' => 'Contá qué tipo de novedades va a encontrar el usuario en esta sección.',
                'recommended_keywords' => 'novedades, noticias, lanzamientos, actualidad industrial',
            ],
            'rrhh' => [
                'label' => 'RRHH',
                'recommended_title' => 'Orientalo a búsqueda laboral o postulaciones.',
                'recommended_description' => 'Invitá a conocer oportunidades laborales y enviar postulaciones.',
                'recommended_keywords' => 'trabajo, rrhh, empleo industrial, postulaciones',
            ],
            'contacto' => [
                'label' => 'Contacto',
                'recommended_title' => 'Mencioná contacto comercial, asesoramiento o consultas.',
                'recommended_description' => 'Explicá cómo comunicarse con Felrro para ventas, soporte o consultas.',
                'recommended_keywords' => 'contacto, consultas, ventas, asesoramiento industrial',
            ],
            'cotizacion' => [
                'label' => 'Cotización',
                'recommended_title' => 'Decí claramente que la página permite pedir una cotización.',
                'recommended_description' => 'Invitá a solicitar presupuesto o cotización de productos específicos.',
                'recommended_keywords' => 'cotización, presupuesto, consulta comercial, cables especiales',
            ],
            'buscador' => [
                'label' => 'Buscador',
                'recommended_title' => 'Hacé foco en búsqueda de productos o contenidos del sitio.',
                'recommended_description' => 'Explicá que la página ayuda a encontrar productos, categorías o información.',
                'recommended_keywords' => 'buscador, buscar productos, búsqueda interna, catálogo',
            ],
        ];
    }

    public static function resolveKey(Request $request): ?string
    {
        $routeName = $request->route()?->getName();

        if (!$routeName) {
            return null;
        }

        $pages = self::pages();

        if (array_key_exists($routeName, $pages)) {
            return $routeName;
        }

        return match ($routeName) {
            'productos.category', 'productos.show' => 'productos.index',
            'novedades.show' => 'novedades',
            default => null,
        };
    }
}
