const phraseSets = [
  {
    name: "🍆 Ромба mode",
    phrases: [
      // "ромба пьет из горла",
      // "мик гордон",
      "ромба говорит про еблю",
      "ромба говорит про порнушные игры",
      "ромба неправильно склоняет имя",
      "ромба неправильно склоняет слово",
      "ромба пьет из кружки",
      "ромба хрючит на паузе",
      "ромба корчит крутое ебало",
      "ромба мошнит",
      "ромба стримит в трусах",
      "ромба-актер",
      "ромба-певец",
      "ромба-пародист",
      "ромба-обзорщик",
      "ромба-переводчик",
      "комфортное проживание",
      "высокое образование",
      "важные дела",
      "бебей",
      "фотожабы",
      "имба енерджи",
      "такой нота",
      "ДУМ",
      "май край",
      "годовар",
      "чувак задрот полнейший",
      "МОЩЬ",
      "кринжовая ромба-шутка",
      "кагтавый рейд",
      "свежие силы",
      "геймерская чуйка",
      "дебич с алертами",
      "О!"
    ]
  },
  {
    name: "🏅 Кулук mode",
    phrases: [
      "нечестно",
      "супернечестно",
      "нет турбо",
      "ну кто так делает игры?",
      "перепутаны кнопки",
      "игра прекрати",
      "почему никто не подсказывает?",
      "кому важен сюжет?",
      "кому важна музыка?",
      "кому важна графика?",
      "откуда я должен знать?",
      "угрожает посмотреть прохождение",
      "смотрит прохождение",
      "медалька",
      "ЯЖЕ ЖАЛ",
      "нелогично",
      "отвратительно",
      "игра говна",
      "нет паузы",
      "НУ ПОЧЕМУ?!",
      "сейвы это чит",
      "кто в это вообще играет?",
      "КАК!",
      "жалуется что мало донатов",
      "господи за что",
      "кагтавый рейд",
      "зазвонил телефон",
      "кто-то говорит на фоне",
      "камера говна",
      "О!",
      "кулук мошнит",
    ]
  }
]
const STORAGE_KEY = "phrasesGrid";
const strikeSound = new Audio("strike.mp3");
const lineCompleteSound = new Audio("lineСomplete.mp3");
const toggleSoundButton = document.getElementById("toggle-sound");
const togglePhraseSetButton = document.getElementById("toggle-phraseset");
let phraseSetName = document.getElementById("phrase-set-name");
let soundEnabled = JSON.parse(localStorage.getItem("soundEnabled")) ?? true;
let currentPhraseSetIndex = parseInt(localStorage.getItem("phraseSetIndex")) || 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function saveState(cells) {
  const data = Array.from(cells).map(cell => ({
    text: cell.textContent,
    struck: cell.classList.contains("struck")
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function generateGrid(fromSaved = false) {
  const grid = document.getElementById("grid");
  const phrases = phraseSets[currentPhraseSetIndex].phrases;
  let cellData;

  grid.innerHTML = "";

  if (fromSaved) {
    cellData = loadState();
  } else {
    const shuffled = shuffle([...phrases]).slice(0, 25);
    cellData = shuffled.map(p => ({ text: p, struck: false }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cellData));
  }

  cellData.forEach((item, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = item.text;
    if (item.struck) cell.classList.add("struck");

    cell.addEventListener("click", () => {
      const wasStruck = cell.classList.contains("struck");
      cell.classList.toggle("struck");

      saveState(document.querySelectorAll(".cell"));
      const newLine = checkLines();

      if (!wasStruck && !newLine && soundEnabled) {
        playStrikeSound();
      }
    });

    grid.appendChild(cell);
  });

  checkLines();
}

document.getElementById("regenerateBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  generateGrid(false);
});

if (localStorage.getItem(STORAGE_KEY)) {
  generateGrid(true);
} else {
  generateGrid(false);
}

function checkLines() {
  const cells = document.querySelectorAll(".cell");
  const grid = [];
  const previouslyComplete = new Set();
  let newLineCompleted = false;

  cells.forEach((cell, i) => {
    if (cell.classList.contains("complete-line")) {
      previouslyComplete.add(i);
    }
  });

  for (let cell of cells) {
    cell.classList.remove("complete-line");
  }

  for (let i = 0; i < 5; i++) {
    grid[i] = [];
    for (let j = 0; j < 5; j++) {
      grid[i][j] = cells[i * 5 + j];
    }
  }

  for (let i = 0; i < 5; i++) {
    const row = grid[i];

    if (row.every(cell => cell.classList.contains("struck"))) {
      row.forEach((cell, j) => {
        const index = i * 5 + j;

        cell.classList.add("complete-line");
        if (!previouslyComplete.has(index)) {
          newLineCompleted = true;
        }
      });
    }
  }

  for (let j = 0; j < 5; j++) {
    const column = grid.map(row => row[j]);

    if (column.every(cell => cell.classList.contains("struck"))) {
      column.forEach((cell, i) => {
        const index = i * 5 + j;

        cell.classList.add("complete-line");
        if (!previouslyComplete.has(index)) {
          newLineCompleted = true;
        }
      });
    }
  }

  if (newLineCompleted) {
    playLineCompleteSound();
  }

  return newLineCompleted;
}

function playStrikeSound() {
  strikeSound.currentTime = 0;
  strikeSound.play();
}

function playLineCompleteSound() {
  lineCompleteSound.currentTime = 0;
  lineCompleteSound.play();
}

function playStrikeSound() {
  if (soundEnabled) {
    strikeSound.currentTime = 0;
    strikeSound.play();
  }
}

function playLineCompleteSound() {
  if (soundEnabled) {
    lineCompleteSound.currentTime = 0;
    lineCompleteSound.play();
  }
}

function updateSoundButton() {
  toggleSoundButton.textContent = soundEnabled ? "🔊" : "🔇";
}

toggleSoundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
  updateSoundButton();
});

updateSoundButton();

function updatePhraseSetButton() {
  phraseSetName.textContent = phraseSets[currentPhraseSetIndex].name;
}

togglePhraseSetButton.addEventListener("click", () => {
  currentPhraseSetIndex = (currentPhraseSetIndex + 1) % phraseSets.length;
  localStorage.setItem("phraseSetIndex", currentPhraseSetIndex);
  localStorage.removeItem(STORAGE_KEY); // сбрасываем старую сетку
  generateGrid(false); // перегенерируем сетку с новым набором
  updatePhraseSetButton();
});

updatePhraseSetButton();

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    button.blur();
  });
});
