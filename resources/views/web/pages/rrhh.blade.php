@extends('web.layouts.app')

@section('title', __('messages.work_with_us') . ' - Felrro')

@section('content')

@php
$locale = app()->getLocale();
@endphp

<section class="rrhh-page">

    <div class="rrhh-container">

        {{-- ================= BREADCRUMB ================= --}}
        <div class="rrhh-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ __('messages.work_with_us') }}</span>
        </div>

        {{-- ================= HERO ================= --}}
        <div class="rrhh-hero">

            <div class="rrhh-hero-image">
                <img src="{{ asset('storage/rrhh/rrhh.png') }}"
                     alt="{{ __('messages.work_with_us') }}">
            </div>

            <div class="rrhh-hero-content">
                <h1 class="rrhh-hero-title">
                    {{ __('messages.rrhh_hero_title') }}
                </h1>

                <p class="rrhh-hero-bold">
                    {{ __('messages.rrhh_hero_bold') }}
                </p>

                <p class="rrhh-hero-text">
                    {{ __('messages.rrhh_hero_text') }}
                </p>

                <p class="rrhh-hero-email">
                    {{ __('messages.rrhh_email') }}
                </p>
            </div>
        </div>

    </div>

    {{-- ================= SECCIÓN FORMULARIO — fondo #F5F5F5 ================= --}}
    <div class="rrhh-form-section">

        <div class="rrhh-container">

            {{-- TÍTULO --}}
            <h2 class="rrhh-form-title">
                {{ __('messages.rrhh_form_title') }}
            </h2>

            {{-- ERRORES --}}
            @if ($errors->any())
                <div style="color:red; margin-bottom:20px;">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if(session('success'))
                <div class="rrhh-success">
                    {{ session('success') }}
                </div>
            @endif

            <form action="{{ route('rrhh.store') }}"
                  method="POST"
                  enctype="multipart/form-data"
                  class="rrhh-form">

                @csrf

                {{-- FECHA OCULTA --}}
                <input type="hidden" name="fecha_nacimiento" id="fecha_nacimiento">

                <div class="rrhh-grid">

                    {{-- NOMBRE --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.first_name') }}<span>*</span></label>
                        <input type="text" name="first_name" value="{{ old('first_name') }}" required>
                    </div>

                    {{-- APELLIDO --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.last_name') }}<span>*</span></label>
                        <input type="text" name="last_name" value="{{ old('last_name') }}" required>
                    </div>

                    {{-- EMAIL --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.email') }}<span>*</span></label>
                        <input type="email" name="email" value="{{ old('email') }}" required>
                    </div>

                    {{-- CELULAR --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.phone') }}<span>*</span></label>
                        <input type="text" name="phone" value="{{ old('phone') }}" required>
                    </div>

                    {{-- DOCUMENTO TIPO --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.document_type') }}<span>*</span></label>
                        <input type="text" name="document_type" value="{{ old('document_type') }}" required>
                    </div>

                    {{-- DOCUMENTO NÚMERO --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.document_number') }}<span>*</span></label>
                        <input type="text" name="document_number" value="{{ old('document_number') }}" required>
                    </div>

                    {{-- GÉNERO --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.gender') }}<span>*</span></label>
                        <input type="text" name="genero" value="{{ old('genero') }}" required>
                    </div>

                    {{-- NACIONALIDAD --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.nationality') }}<span>*</span></label>
                        <input type="text" name="nacionalidad" value="{{ old('nacionalidad') }}" required>
                    </div>

                    {{-- PAÍS --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.country') }}<span>*</span></label>
                        <input type="text" name="country" value="{{ old('country') }}" required>
                    </div>

                    {{-- PROVINCIA --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.province') }}<span>*</span></label>
                        <input type="text" name="provincia" value="{{ old('provincia') }}" required>
                    </div>

                    {{-- LOCALIDAD --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.city') }}<span>*</span></label>
                        <input type="text" name="localidad" value="{{ old('localidad') }}" required>
                    </div>

                    {{-- FECHA DE NACIMIENTO --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.birth_date') }}<span>*</span></label>
                        <div class="rrhh-date-grid">
                            <select id="birth_day" required>
                                <option value="">Día</option>
                                @for($d=1;$d<=31;$d++)
                                    <option value="{{ $d }}">{{ $d }}</option>
                                @endfor
                            </select>

                            <select id="birth_month" required>
                                <option value="">Mes</option>
                                @for($m=1;$m<=12;$m++)
                                    <option value="{{ $m }}">{{ $m }}</option>
                                @endfor
                            </select>

                            <select id="birth_year" required>
                                <option value="">Año</option>
                                @for($y=date('Y');$y>=1940;$y--)
                                    <option value="{{ $y }}">{{ $y }}</option>
                                @endfor
                            </select>
                        </div>
                    </div>

                    {{-- PUESTO --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.select_position') }}<span>*</span></label>
                        <select name="job_position_id" required>
                            <option value="">{{ __('messages.select_position') }}</option>
                            @foreach($positions as $position)
                                <option value="{{ $position->id }}">
                                    {{ $position->title[$locale] ?? $position->title['es'] }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    {{-- SECTOR --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.select_sector') }}<span>*</span></label>
                        <select name="job_sector_id" required>
                            <option value="">{{ __('messages.select_sector') }}</option>
                            @foreach($sectors as $sector)
                                <option value="{{ $sector->id }}">
                                    {{ $sector->name[$locale] ?? $sector->name['es'] }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    {{-- CV --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.upload_cv') }}<span>*</span></label>
                        <input type="file" id="cv_input" name="cv_path" accept=".pdf,.doc,.docx" required>
                        <label for="cv_input" class="rrhh-file-label">
                            <span id="cv_filename">{{ __('messages.upload_cv') }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2V8H20" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 12V18" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15 15L12 12L9 15" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </label>
                    </div>

                    {{-- CARTA DE PRESENTACIÓN --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.upload_cover_letter') }}</label>
                        <input type="file" id="carta_input" name="cover_letter_path" accept=".pdf,.doc,.docx">
                        <label for="carta_input" class="rrhh-file-label">
                            <span id="carta_filename">{{ __('messages.upload_cover_letter') }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2V8H20" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 12V18" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15 15L12 12L9 15" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </label>
                    </div>

                </div>

                <div class="rrhh-submit">
                    <button type="submit" class="rrhh-btn">
                        {{ __('messages.apply_now') }}
                    </button>
                </div>

            </form>

        </div>

    </div>

</section>

{{-- JS --}}
<script>
// Fecha
document.querySelector('.rrhh-form').addEventListener('submit', function() {
    const day   = document.getElementById('birth_day').value;
    const month = document.getElementById('birth_month').value;
    const year  = document.getElementById('birth_year').value;
    if (day && month && year) {
        document.getElementById('fecha_nacimiento').value =
            `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }
});

// Nombre de archivo CV
document.getElementById('cv_input').addEventListener('change', function() {
    const span = document.getElementById('cv_filename');
    if (this.files && this.files[0]) {
        span.textContent = this.files[0].name;
        span.classList.add('has-file');
    }
});

// Nombre de archivo Carta
document.getElementById('carta_input').addEventListener('change', function() {
    const span = document.getElementById('carta_filename');
    if (this.files && this.files[0]) {
        span.textContent = this.files[0].name;
        span.classList.add('has-file');
    }
});
</script>

@endsection
