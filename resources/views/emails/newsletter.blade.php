<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $subjectText }}</title>
</head>
<body style="font-family: Arial, sans-serif; padding:20px;">

    <h2 style="color:#25A7CA;">
        {{ $subjectText }}
    </h2>

    <p>
        {!! nl2br(e($contentText)) !!}
    </p>

    <hr style="margin-top:40px">

    <p style="font-size:12px; color:#777; line-height:1.6; margin:20px 0 8px;">
        Si no querés recibir más novedades, podés
        <a href="{{ $unsubscribeUrl }}" style="color:#25A7CA;">desuscribirte acá</a>.
    </p>

    <p style="font-size:12px; color:#777;">
        Felrro – Cables Especiales
    </p>

</body>
</html>
