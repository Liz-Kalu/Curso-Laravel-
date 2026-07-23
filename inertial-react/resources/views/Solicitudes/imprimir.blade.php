<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 40px 80px; }
        body { font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: #000; }
        table { width: 100%; border-collapse: collapse; }
        .header-table td { border: 1px solid #000; padding: 6px 10px; vertical-align: middle; }
        .header-logo { width: 70px; text-align: center; }
        .header-logo img { width: 55px; height: auto; }
        .header-center { text-align: center; line-height: 1.8; }
        .header-title { font-weight: bold; font-size: 12px; }
        .header-sub { font-size: 10px; }
        .header-meta { font-size: 9px; width: 140px; line-height: 1.8; }

        .categorias { margin-top: 45px; width: 260px; margin-left: auto; margin-right: 0; }
        .categorias td { border: 1px solid #000; padding: 5px 8px; }
        .categorias .marca { width: 20px; text-align: center; font-weight: bold; }

        .folio { text-align: right; margin-top: 10px; font-size: 13px; font-weight: bold; }

        .campo-solo { border: 1px solid #000; padding: 8px 10px; margin-top: 10px; }
        .campo-label { font-weight: bold; }

        .campos-juntos { margin-top: 25px; }
        .campos-juntos td {
            border: 1px solid #000;
            border-top: none;
            padding: 8px 10px;
        }
        .campos-juntos tr:first-child td {
            border-top: 1px solid #000;
        }

        .firma-linea {
            display: inline-block;
            width: 220px;
            border-bottom: 1px solid #000;
            margin-left: 10px;
            height: 14px;
        }

        .descripcion-box { padding: 8px 10px; min-height: 1000px; vertical-align: top; }

        .footer { margin-top: 40px; font-size: 10px; }
        .footer-inst { text-align: right; margin-top: 30px; }
    </style>
</head>
<body>

<table class="header-table">
    <tr>
        <td class="header-logo">
            <img src="{{ public_path('images/escudo-tec.png') }}">
        </td>
        <td class="header-center">
            <div class="header-title">Solicitud de Mantenimiento</div>
            <div class="header-sub">Código: ITT-POE-06-02</div>
            <div class="header-sub">Referencia a la Norma ISO 9001:2015: 7.1.3, 7.1.4</div>
        </td>
        <td class="header-meta">
            Fecha de revisión: 22-Ene-24<br>
            Revisión: 1<br>
            Página: 1 de 1
        </td>
    </tr>
</table>

<table class="categorias">
    <tr>
        <td>Recursos Materiales y Servicios</td>
        <td class="marca"></td>
    </tr>
    <tr>
        <td>Mantenimiento de Equipo</td>
        <td class="marca"></td>
    </tr>
    <tr>
        <td>{{ $solicitud->departamentoDestino->nombre }}</td>
        <td class="marca">X</td>
    </tr>
</table>

<div class="folio">Folio: {{ $solicitud->folio }}</div>

<div class="campo-solo">
    <span class="campo-label">Área Solicitante:</span> {{ strtoupper($solicitud->departamentoSolicitante->nombre) }}
</div>

<table class="campos-juntos">
    <tr>
        <td>
            <span class="campo-label">Nombre y Firma del Solicitante:</span> {{ $solicitud->solicitante->nombre_completo }}
            <span class="firma-linea"></span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="campo-label">Fecha de Elaboración:</span> {{ \Carbon\Carbon::parse($solicitud->fecha_elaboracion)->format('d/m/Y') }}
        </td>
    </tr>
    <tr>
        <td>
            <span class="campo-label">Tipo de Mantenimiento:</span> {{ $solicitud->tipoMantenimiento->nombre }}
        </td>
    </tr>
    <tr>
        <td class="descripcion-box">
            <div class="campo-label">Descripción del servicio solicitado o falla a reparar:</div>
            <p style="margin-top: 8px;">{{ $solicitud->descripcion }}</p>
        </td>
    </tr>
</table>

<div class="footer">
    c.c.p. Área Solicitante.
</div>

<div class="footer-inst">
    Instituto Tecnológico de Tepic
</div>

</body>
</html>
