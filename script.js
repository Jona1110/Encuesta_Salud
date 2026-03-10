const preguntas = [
    { id: 1, texto: "¿Es frecuente observar acumulación de basura en las calles de su zona?", tipo: "radio", opciones: ["Sí", "No", "En ocasiones"] },
    { id: 2, texto: "¿Pasa regularmente el camión recolector de basura por su domicilio?", tipo: "radio", opciones: ["Sí", "No", "Es tardado"] },
    { id: 3, texto: "¿Cómo calificaría la limpieza general del parque de la comunidad?", tipo: "radio", opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"] },
    { id: 4, texto: "¿Alguna vez ha utilizado el agua proveniente del venero?", tipo: "radio", opciones: ["Sí", "No"] },
    { id: 5, texto: "¿Considera que el agua del venero actualmente está contaminada?", tipo: "radio", opciones: ["Sí", "No", "No sabe"] },
    { id: 6, texto: "¿En qué escala del 1 al 5 considera que está el venero?", tipo: "range", min: 1, max: 5 },
    { id: 7, texto: "¿Qué cambios ha notado en el agua?", tipo: "checkbox", opciones: ["Mal olor", "Cambio de color", "Sabor extraño", "Presencia de basura", "Disminución del flujo"] },
    { id: 8, texto: "¿Qué cree que causó la contaminación?", tipo: "select", opciones: ["Basura", "Drenaje", "Actividades agrícolas", "Industria", "Desconoce"] },
    { id: 9, texto: "¿De qué manera considera que la basura afecta la salud?", tipo: "checkbox", opciones: ["Malos olores", "Moscas/Plagas", "Enfermedades gastrointestinales"] },
    { id: 10, texto: "¿Cree que la contaminación del agua repercute en niños y adultos mayores?", tipo: "radio", opciones: ["Sí", "No"] },
    { id: 11, texto: "¿Cree que este problema puede favorecer la aparición de mosquitos (vectores)?", tipo: "radio", opciones: ["Sí", "No"] },
    { id: 12, texto: "¿Cuáles de estos riesgos asocia con el agua contaminada?", tipo: "checkbox", opciones: ["Contagio de enfermedades", "Riesgo de Dengue y Zika", "Olores desagradables"] },
    { id: 13, texto: "¿Sabe identificar alguna anomalía física en el agua de su comunidad?", tipo: "radio", opciones: ["Sí", "No", "Tal vez"] },
    { id: 14, texto: "¿Conoce los daños que puede causar el uso de agua contaminada?", tipo: "radio", opciones: ["Sí", "No"] },
    { id: 15, texto: "¿Sabía que su comunidad es más propensa al Dengue y Zika?", tipo: "radio", opciones: ["Sí", "No"] },
    { id: 16, texto: "¿Qué beneficios considera más importantes al mantener limpia la colonia?", tipo: "checkbox", opciones: ["Mejor salud", "Mejor imagen urbana", "Aumento en la calidad de vida"] }
];

const container = document.getElementById('questions-area');
const progressBar = document.getElementById('progressBar');
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbwbNpXe-E24pvwnS7Ro-YHcEbk5NvJqwuxlefBknOjubty3hc8Lt1NszTl9fRsaVj-O/exec";

// --- GENERAR PREGUNTAS ---
preguntas.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'question-group';
    let inputHTML = `<label class="main-label">${p.id}. ${p.texto}</label>`;

    if (p.tipo === 'radio' || p.tipo === 'checkbox') {
        inputHTML += p.opciones.map(opt => `
            <label class="option-item">
                <input type="${p.tipo}" name="q${p.id}" value="${opt}" class="input-check">
                <span>${opt}</span>
            </label>
        `).join('');
    } else if (p.tipo === 'select') {
        inputHTML += `<select name="q${p.id}" class="input-check">
                        <option value="" disabled selected>Selecciona una opción...</option>
                        ${p.opciones.map(o => `<option value="${o}">${o}</option>`).join('')}
                      </select>`;
    } else if (p.tipo === 'range') {
        inputHTML += `<input type="range" name="q${p.id}" min="${p.min}" max="${p.max}" value="1" step="1" class="input-check">
                     <div class="range-labels"><span>Limpio</span><span>Neutral</span><span>Sucio</span></div>`;
    }
    div.innerHTML = inputHTML;
    container.appendChild(div);
});

// --- BARRA PROGRESO ---
const inputs = document.querySelectorAll('.input-check');
inputs.forEach(input => {
    input.addEventListener('change', () => {
        const answeredQuestions = new Set();
        inputs.forEach(i => {
            if ((i.type === 'radio' || i.type === 'checkbox') && i.checked) answeredQuestions.add(i.name);
            else if (i.tagName === 'SELECT' && i.value !== "") answeredQuestions.add(i.name);
            else if (i.type === 'range') answeredQuestions.add(i.name);
        });
        progressBar.style.width = `${(answeredQuestions.size / preguntas.length) * 100}%`;

        if (input.type === 'radio') {
            const group = input.closest('.question-group');
            group.querySelectorAll('.option-item').forEach(item => item.classList.remove('selected'));
            input.parentElement.classList.add('selected');
        }
    });
});

// --- LOGIN PARA ESTADÍSTICAS ---
const adminBtn = document.getElementById('adminBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginSubmit = document.getElementById('loginSubmit');

adminBtn.addEventListener('click', () => loginModal.style.display = 'flex');
closeModal.addEventListener('click', () => loginModal.style.display = 'none');

loginSubmit.addEventListener('click', () => {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    // CREDENCIALES
    if (user === "Atziri" && pass === "220824") {
        window.location.href = "stats.html";
    } else {
        alert("Credenciales incorrectas.");
    }
});

// --- ENVÍO DE FORMULARIO ---
document.getElementById('pollForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {};
    const answeredQuestions = new Set();

    formData.forEach((value, key) => {
        if (value && value !== "") answeredQuestions.add(key);
        if (!data[key]) data[key] = value;
        else {
            if (!Array.isArray(data[key])) data[key] = [data[key]];
            data[key].push(value);
        }
    });

    if (answeredQuestions.size < preguntas.length) {
        alert("Por favor, contesta todas las preguntas.");
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.innerText = "Enviando...";
    btn.disabled = true;

    fetch(URL_SCRIPT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
    })
    .then(() => {
        alert('¡Encuesta enviada con éxito!');
        this.reset();
        progressBar.style.width = '0%';
        btn.innerText = "Finalizar y Enviar";
        btn.disabled = false;
        document.querySelectorAll('.option-item').forEach(item => item.classList.remove('selected'));
    })
    .catch(err => {
        alert('Error al enviar.');
        btn.disabled = false;
    });

});
