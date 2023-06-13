// Variáveis do cronômetro
let timerInterval;
let timerRunning = false;
let timerStartTime;
let timerDisplay = document.getElementById('timer-display');

// Variáveis da calculadora
let calcInput = document.getElementById('calc-input');
let calcButtons = document.querySelectorAll('#calc-buttons button');

// Função para exibir a hora atual
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;
  document.getElementById('clock').textContent = time;
}

// Função para iniciar o cronômetro
function startTimer() {
  if (!timerRunning) {
    timerStartTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
    timerRunning = true;
  }
}

// Função para parar o cronômetro
function stopTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
  }
}

// Função para reiniciar o cronômetro
function resetTimer() {
  stopTimer();
  timerDisplay.textContent = '00:00:00';
}

// Função para atualizar a exibição do cronômetro
function updateTimerDisplay() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - timerStartTime;
  const hours = Math.floor(elapsedTime / 3600000).toString().padStart(2, '0');
  const minutes = Math.floor((elapsedTime % 3600000) / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((elapsedTime % 60000) / 1000).toString().padStart(2, '0');
  timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Função para adicionar um item à checklist
function addItem() {
  const input = document.getElementById('checklist-input');
  const itemText = input.value.trim();

  if (itemText !== '') {
    const item = document.createElement('li');
    item.textContent = itemText;
    document.getElementById('checklist-items').appendChild(item);
    input.value = '';
  }
}

// Função para alternar a visibilidade do cronômetro
function toggleTimer() {
  const timer = document.getElementById('timer');
  timer.classList.toggle('hidden');
}

// Função para alternar a visibilidade da calculadora
function toggleCalculator() {
  const calculator = document.getElementById('calculator');
  calculator.classList.toggle('hidden');
}

// Função para ativar/desativar o modo escuro
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
}

// Função para exibir o PDF selecionado
function showPDF(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const pdfContainer = document.getElementById('pdf-container');
    pdfContainer.innerHTML = '';
    const canvas = document.createElement('canvas');
    pdfContainer.appendChild(canvas);
    const pdfData = new Uint8Array(e.target.result);
    PDFJS.getDocument(pdfData).then(function (pdf) {
      pdf.getPage(1).then(function (page) {
        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext);
      });
    });
  };
  reader.readAsArrayBuffer(file);
}

// Evento do botão "Dark Mode"
document.getElementById('dark-mode-button').addEventListener('click', toggleDarkMode);

// Evento do botão "Adicionar" da checklist
document.getElementById('add-item-button').addEventListener('click', addItem);

// Evento do botão "Iniciar" do cronômetro
document.getElementById('start-timer-button').addEventListener('click', startTimer);

// Evento do botão "Parar" do cronômetro
document.getElementById('stop-timer-button').addEventListener('click', stopTimer);

// Evento do botão "Reiniciar" do cronômetro
document.getElementById('reset-timer-button').addEventListener('click', resetTimer);

// Evento do botão "Cronômetro"
document.getElementById('toggle-timer-button').addEventListener('click', toggleTimer);

// Evento do botão "Calculadora"
document.getElementById('toggle-calculator-button').addEventListener('click', toggleCalculator);

// Evento do input de seleção de arquivo
document.getElementById('file-input').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    showPDF(file);
  }
});

// Atualizar a hora a cada segundo
setInterval(updateTime, 1000);
          