<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nueva Cotización</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">

    <div style="max-width:600px; margin:0 auto; background:white; padding:30px; border-radius:8px;">

        <h2 style="margin-top:0;">Nueva Cotización Recibida</h2>

        <hr>

        <p><strong>Nombre:</strong> {{ $quotation->nombre }}</p>
        <p><strong>Email:</strong> {{ $quotation->email }}</p>
        <p><strong>Teléfono:</strong> {{ $quotation->telefono }}</p>
        <p><strong>Empresa:</strong> {{ $quotation->empresa }}</p>

        @if($quotation->mensaje)
            <p><strong>Mensaje:</strong><br>
            {{ $quotation->mensaje }}</p>
        @endif

        <hr>

        <h3>Productos Cotizados</h3>

        <ul>
            @foreach($quotation->items as $item)
                <li>
                    {{ $item->product->getName() }}
                    — {{ $item->metros }} metros
                </li>
            @endforeach
        </ul>

    </div>

</body>
</html>