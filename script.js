/* ═══════════════════════════════════════════════
   OFFIWIZ — Main JavaScript
   ═══════════════════════════════════════════════ */

// ──── WEBHOOK URL (cambia este valor por tu endpoint real) ────
const TU_WEBHOOK_URL = 'https://hook.eu1.make.com/ubup4snwrobkab2wlyc5qs12g4mbtao3';


// ──── DOM References ────
const uploadForm = document.getElementById('uploadForm');
const csvFileInput = document.getElementById('csvFile');
const dropzone = document.getElementById('dropzone');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const resultado = document.getElementById('resultado');
const resultContent = document.getElementById('resultContent');

// ═══════════════════════════════════════════════
// FILE INPUT & DRAG-AND-DROP
// ═══════════════════════════════════════════════

csvFileInput.addEventListener('change', () => {
    if (csvFileInput.files.length > 0) {
        showFileInfo(csvFileInput.files[0].name);
    }
});

removeFile.addEventListener('click', () => {
    csvFileInput.value = '';
    fileInfo.classList.add('hidden');
    dropzone.classList.remove('hidden');
});

// Drag & drop visual feedback
['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, e => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
    });
});

['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, e => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
    });
});

dropzone.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
        csvFileInput.files = e.dataTransfer.files;
        showFileInfo(file.name);
    }
});

function showFileInfo(name) {
    fileName.textContent = name;
    fileInfo.classList.remove('hidden');
    dropzone.classList.add('hidden');
}

// ═══════════════════════════════════════════════
// FORM SUBMISSION
// ═══════════════════════════════════════════════

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = csvFileInput.files[0];
    if (!file) return;

    // Disable button and show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Procesando con IA...';

    // Add spinner
    const spinner = document.createElement('span');
    spinner.className = 'btn__spinner';
    submitBtn.prepend(spinner);

    // Hide previous results
    resultado.classList.add('hidden');
    resultContent.textContent = '';

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(TU_WEBHOOK_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();

        // 1. Validar errores de la API
        if (data.error) {
            resultContent.innerHTML = `
                <div class="error-box">
                    <span>${data.error}</span>
                </div>
            `;
            resultado.classList.remove('hidden');
            return; // Detener ejecución
        }

        // 2. Procesar Reporte
        if (data.report) {
            const { resumen_ejecutivo, metricas_clave, recomendaciones, anomalias } = data.report;
            
            let html = '';

            if (resumen_ejecutivo) {
                html += `
                    <div class="report-section">
                        <h2>Resumen Ejecutivo</h2>
                        <p>${resumen_ejecutivo}</p>
                    </div>
                `;
            }

            if (metricas_clave && Array.isArray(metricas_clave)) {
                html += `
                    <div class="report-section">
                        <h2>Métricas Clave</h2>
                        <ul class="report-list">
                            ${metricas_clave.map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            if (recomendaciones && Array.isArray(recomendaciones)) {
                html += `
                    <div class="report-section">
                        <h2>Recomendaciones</h2>
                        <ul class="report-list">
                            ${recomendaciones.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            if (anomalias && Array.isArray(anomalias)) {
                html += `
                    <div class="report-section">
                        <h2>Anomalías Detectadas</h2>
                        ${anomalias.map(a => {
                            const sev = (a.severidad || '').toLowerCase();
                            const severidadClass = sev === 'alta' ? 'rojo' : (sev === 'media' ? 'naranja' : 'amarillo');
                            return `<div class="anomalia ${severidadClass}">${a.descripcion}</div>`;
                        }).join('')}
                    </div>
                `;
            }

            resultContent.innerHTML = html;
            resultado.classList.remove('hidden');
        }

        // Scroll to the result
        resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        resultContent.innerHTML = `
            <div class="error-box">
                <span>Ha ocurrido un error: ${error.message}. Asegúrate de que el servidor esté respondiendo correctamente.</span>
            </div>
        `;
        resultado.classList.remove('hidden');
    } finally {
        // Restore button state
        submitBtn.disabled = false;
        btnText.textContent = 'Generar Informe Automático';
        spinner.remove();
    }
});

// ═══════════════════════════════════════════════
// ANIMATED NUMBER COUNTERS & PROGRESS BARS
// ═══════════════════════════════════════════════

function animateCounters() {
    const counters = document.querySelectorAll('.benefit-card__number');
    counters.forEach(counter => {
        const target = +counter.dataset.target;
        if (!target) return;
        const duration = 1500;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    });

    // Animate bars
    const bars = document.querySelectorAll('.benefit-card__bar-fill');
    bars.forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
    });
}

// Intersection Observer for benefits section
const benefitsSection = document.getElementById('beneficios');
let benefitsAnimated = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !benefitsAnimated) {
            benefitsAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.3 });

observer.observe(benefitsSection);

// ═══════════════════════════════════════════════
// SCROLL-BASED HEADER STYLE
// ═══════════════════════════════════════════════

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'none';
    }
    lastScroll = scrollY;
}, { passive: true });
