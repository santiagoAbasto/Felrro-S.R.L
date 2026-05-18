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

            <div id="rrhh-file-toast" class="rrhh-file-toast" aria-live="polite">
                {{ __('messages.rrhh_file_validation_toast') }}
            </div>

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
                        <input type="file" id="cv_input" name="cv_path" required>
                        <label for="cv_input" class="rrhh-file-label">
                            <span id="cv_filename">{{ __('messages.upload_cv') }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2V8H20" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 12V18" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15 15L12 12L9 15" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </label>
                        <p class="rrhh-file-hint">{{ __('messages.upload_file_hint') }}</p>
                        <p id="cv_error" class="rrhh-file-error" aria-live="polite">
                            {{ $errors->first('cv_path') }}
                        </p>
                    </div>

                    {{-- CARTA DE PRESENTACIÓN --}}
                    <div class="rrhh-field">
                        <label>{{ __('messages.upload_cover_letter') }}<span>*</span></label>
                        <input type="file" id="carta_input" name="cover_letter_path" required>
                        <label for="carta_input" class="rrhh-file-label">
                            <span id="carta_filename">{{ __('messages.upload_cover_letter') }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2V8H20" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 12V18" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15 15L12 12L9 15" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </label>
                        <p class="rrhh-file-hint">{{ __('messages.upload_file_hint') }}</p>
                        <p id="carta_error" class="rrhh-file-error" aria-live="polite">
                            {{ $errors->first('cover_letter_path') }}
                        </p>
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
const rrhhForm = document.querySelector('.rrhh-form');

if (rrhhForm) {
    const rrhhToast = document.getElementById('rrhh-file-toast');
    const rrhhMessages = {{ Illuminate\Support\Js::from([
        'toast' => __('messages.rrhh_file_validation_toast'),
        'cvDefault' => __('messages.upload_cv'),
        'coverDefault' => __('messages.upload_cover_letter'),
        'cvRequired' => __('messages.upload_cv_required'),
        'coverRequired' => __('messages.upload_cover_letter_required'),
        'allowedFiles' => __('messages.upload_allowed_files'),
        'maxSize' => __('messages.upload_max_size'),
    ]) }};
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const maxFileSize = 10 * 1024 * 1024;
    const fileFields = [
        {
            input: document.getElementById('cv_input'),
            filename: document.getElementById('cv_filename'),
            error: document.getElementById('cv_error'),
            label: document.querySelector('label[for="cv_input"]'),
            defaultText: rrhhMessages.cvDefault,
            requiredMessage: rrhhMessages.cvRequired,
        },
        {
            input: document.getElementById('carta_input'),
            filename: document.getElementById('carta_filename'),
            error: document.getElementById('carta_error'),
            label: document.querySelector('label[for="carta_input"]'),
            defaultText: rrhhMessages.coverDefault,
            requiredMessage: rrhhMessages.coverRequired,
        }
    ];
    let rrhhToastTimeout;

    const updateBirthDateField = () => {
        const day = document.getElementById('birth_day').value;
        const month = document.getElementById('birth_month').value;
        const year = document.getElementById('birth_year').value;

        if (day && month && year) {
            document.getElementById('fecha_nacimiento').value =
                `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
    };

    const showToast = (message) => {
        if (!rrhhToast) {
            return;
        }

        rrhhToast.textContent = message;
        rrhhToast.classList.add('show');
        window.clearTimeout(rrhhToastTimeout);
        rrhhToastTimeout = window.setTimeout(() => {
            rrhhToast.classList.remove('show');
        }, 3200);
    };

    const getExtension = (fileName) => {
        const parts = fileName.split('.');
        return parts.length > 1 ? parts.pop().toLowerCase() : '';
    };

    const isAllowedFile = (file) => allowedExtensions.includes(getExtension(file.name));
    const isAllowedSize = (file) => file.size <= maxFileSize;

    const clearFieldError = (field) => {
        field.error.textContent = '';
        field.label.classList.remove('is-invalid');
    };

    const setFieldError = (field, message) => {
        field.error.textContent = message;
        field.label.classList.add('is-invalid');
    };

    const updateFileName = (field) => {
        const file = field.input.files && field.input.files[0] ? field.input.files[0] : null;

        if (file) {
            field.filename.textContent = file.name;
            field.filename.classList.add('has-file');
            return;
        }

        field.filename.textContent = field.defaultText;
        field.filename.classList.remove('has-file');
    };

    fileFields.forEach((field) => {
        updateFileName(field);
        field.input.addEventListener('change', () => {
            updateFileName(field);
            clearFieldError(field);
        });
    });

    rrhhForm.addEventListener('submit', (event) => {
        updateBirthDateField();

        let hasInvalidFiles = false;

        fileFields.forEach((field) => {
            clearFieldError(field);

            const file = field.input.files && field.input.files[0] ? field.input.files[0] : null;

            if (!file) {
                setFieldError(field, field.requiredMessage);
                hasInvalidFiles = true;
                return;
            }

            if (!isAllowedFile(file)) {
                setFieldError(field, rrhhMessages.allowedFiles);
                hasInvalidFiles = true;
                return;
            }

            if (!isAllowedSize(file)) {
                setFieldError(field, rrhhMessages.maxSize);
                hasInvalidFiles = true;
            }
        });

        if (hasInvalidFiles) {
            event.preventDefault();
            showToast(rrhhMessages.toast);

            const firstInvalidField = fileFields.find((field) => field.label.classList.contains('is-invalid'));
            if (firstInvalidField) {
                firstInvalidField.label.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    });
}
</script>

@endsection
