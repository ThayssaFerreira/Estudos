// Variáveis globais
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;

// Elementos DOM
const pdfContainer = document.getElementById('pdf-container');
const fileInput = document.getElementById('file-input');
const darkModeButton = document.getElementById('dark-mode-button');
const clock = document.getElementById('clock');
const checklistInput = document.getElementById('checklist-input');
const addItemButton = document.getElementById('add-item-button');
const checklistItems = document.getElementById('checklist-items');
const startTimerButton = document.getElementById('start-timer-button');
const stopTimerButton = document.getElementById('stop-timer-button');
const resetTimerButton = document.getElementById('reset-timer-button');
const timerDisplay = document.getElementById('timer-display');
const calcInput = document.getElementById('calc-input');
const calcButtons = document.getElementById('calc-buttons');

// Carrega o arquivo PDF selecionado
fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  const fileReader = new FileReader();

  fileReader.onload = function() {
    const typedarray = new Uint8Array(this.result);
    loadPdf(typedarray);
  };

  fileReader.readAsArrayBuffer(file);
});

// Carrega o PDF a partir de um array de bytes
function loadPdf(typedarray) {
  pdfjsLib.getDocument(typedarray).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    renderPage(pageNum);
  });
}

// Renderiza a página PDF especificada
function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(function(page) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: scale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    const renderTask = page.render(renderContext);

    renderTask.promise.then(function() {
      pageRendering = false;

      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });

    pdfContainer.innerHTML = '';
    pdfContainer.appendChild(canvas);
  });

  // Atualiza o número da página atual
  document.getElementById('page-num').textContent = num;
}

// Vai para a próxima página
function nextPage() {
  if (pageRendering) {
    pageNumPending = pageNum + 1;
  } else {
    pageNum++;
    if (pageNum > pdfDoc.numPages) {
      pageNum = pdfDoc.numPages;
    }
    renderPage(pageNum);
  }
}

// Vai para a página anterior
function prevPage() {
  if (pageRendering) {
    pageNumPending = pageNum - 1;
  } else {
    pageNum--;
    if (pageNum < 1) {
      pageNum = 1;
    }
    renderPage(pageNum);
  }
}

// Alterna entre o modo claro e escuro
darkModeButton.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
});

// Atualiza o relógio a cada segundo
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);

// Adiciona um item à lista de verificação
function addItem() {
  const itemText = checklistInput.value.trim();

  if (itemText !== '') {
    const item = document.createElement('li');
    item.textContent = itemText;
    checklistItems.appendChild(item);
    checklistInput.value = '';
  }
}

// Inicia o temporizador
let timerInterval;
let startTime;
let elapsedTime = 0;
function startTimer() {
  if (!timerInterval) {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function() {
      const now = Date.now();
      elapsedTime = now - startTime;
      const formattedTime = formatTime(elapsedTime);
      timerDisplay.textContent = formattedTime;
    }, 1000);
  }
}

// Para o temporizador
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Reinicia o temporizador
function resetTimer() {
  stopTimer();
  elapsedTime = 0;
  timerDisplay.textContent = '00:00:00';
}

// Formata o tempo em horas:minutos:segundos
function formatTime(time) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Adiciona um número ou operador ao campo de entrada da calculadora
function addToCalcInput(value) {
  calcInput.value += value;
}

// Calcula o resultado da expressão matemática no campo de entrada da calculadora
function calculate() {
  try {
    const result = eval(calcInput.value);
    calcInput.value = result;
  } catch (error) {
    calcInput.value = 'Erro';
  }
}

// Limpa o campo de entrada da calculadora
function clearCalcInput() {
  calcInput.value = '';
}

// Adiciona os eventos aos botões de número e operador da calculadora
const calcButtonsList = Array.from(calcButtons.querySelectorAll('button'));
calcButtonsList.forEach(function(button) {
  button.addEventListener('click', function(event) {
    const value = event.target.textContent;
    addToCalcInput(value);
  });
});

// Eventos do checklist
addItemButton.addEventListener('click', addItem);

// Eventos do cronômetro
startTimerButton.addEventListener('click', startTimer);
stopTimerButton.addEventListener('click', stopTimer);
resetTimerButton.addEventListener('click', resetTimer);

