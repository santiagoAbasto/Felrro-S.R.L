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

    <p style="font-size:12px; color:#777;">
        Felrro – Cables Especiales
    </p>

</body>
</html>