const ingredients = [
  "2 cups maida (all-purpose flour)",
  "4 tbsp oil (for dough)",
  "Salt to taste",
  "3 medium potatoes (boiled & mashed)",
  "½ cup green peas (optional)",
  "2 green chilies (finely chopped)",
  "1 tsp ginger paste",
  "1 tsp cumin seeds",
  "1 tsp garam masala",
  "1 tsp red chili powder",
  "1 tsp coriander powder",
  "Oil (for deep frying)"
];
const steps = [
  "In a bowl, mix maida, salt, and oil. Add little water and knead into a stiff dough. Rest for 30 mins.",
  "Heat oil in a pan, add cumin seeds, green chilies, and ginger paste.",
  "Add boiled potatoes, peas, salt, and spices (red chili, coriander, garam masala). Mix well.",
  "Divide dough into small balls, roll into oval shape, cut in half.",
  "Make a cone with each half, fill with potato mixture, and seal edges with water.",
  "Heat oil in a kadhai, deep fry samosas on medium flame till golden brown.",
  "Serve hot with green chutney or ketchup."
];

const ingSec = document.getElementById("ingredientsSection");
const stepsSec = document.getElementById("stepsSection");
const ingBtn = document.getElementById("toggleIngredients");
const stepsBtn = document.getElementById("toggleSteps");
const printBtn = document.getElementById("printBtn");

const ingList = document.getElementById("ingredientsList");
const stepsList = document.getElementById("stepsList");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const progressEl = document.getElementById("progress");

const timerInput = document.getElementById("timerInput");
const timerStart = document.getElementById("timerStart");
const timerStop = document.getElementById("timerStop");
const timerDisplay = document.getElementById("timerDisplay");

let currentStep = -1;
let timerId = null, endAt = null;

function mountIngredients(){
  ingList.innerHTML = ingredients.map(i => `<li>${i}</li>`).join("");
}
function mountSteps(){
  stepsList.innerHTML = steps.map((s, idx) => `<li data-idx="${idx}">${s}</li>`).join("");
}
mountIngredients();
mountSteps();

function toggleSection(secEl, btnEl, openLabel, closeLabel){
  const isHidden = secEl.getAttribute("aria-hidden") !== "false";
  secEl.setAttribute("aria-hidden", isHidden ? "false" : "true");
  btnEl.textContent = isHidden ? closeLabel : openLabel;
}
ingBtn.addEventListener("click", ()=> toggleSection(ingSec, ingBtn, "Show Ingredients", "Hide Ingredients"));
stepsBtn.addEventListener("click", ()=> toggleSection(stepsSec, stepsBtn, "Show Steps", "Hide Steps"));

function updateProgress(){
  const pct = currentStep < 0 ? 0 : ((currentStep+1) / steps.length) * 100;
  progressEl.style.width = `${pct}%`;
  [...stepsList.children].forEach((li, idx)=> li.classList.toggle("active", idx === currentStep));
  nextBtn.disabled = currentStep >= steps.length - 1 || currentStep < 0;
  resetBtn.disabled = currentStep < 0;
}
function startCooking(){
  currentStep = 0;
  updateProgress();
  stepsSec.setAttribute("aria-hidden","false");
  stepsBtn.textContent = "Hide Steps";
}
function nextStep(){
  if(currentStep < steps.length - 1){
    currentStep++;
    updateProgress();
  }
}
function resetCooking(){
  currentStep = -1;
  updateProgress();
}
startBtn.addEventListener("click", startCooking);
nextBtn.addEventListener("click", nextStep);
resetBtn.addEventListener("click", resetCooking);

function formatTime(ms){
  const total = Math.max(0, Math.floor(ms/1000));
  const m = String(Math.floor(total/60)).padStart(2,"0");
  const s = String(total%60).padStart(2,"0");
  return `${m}:${s}`;
}
function tick(){
  const ms = endAt - Date.now();
  timerDisplay.textContent = formatTime(ms);
  if(ms <= 0){
    clearInterval(timerId);
    timerId = null;
    timerStop.disabled = true;
    timerStart.disabled = false;
    // little celebratory effect
    progressEl.style.width = "100%";
    alert("Time's up! Cake is ready 🎉");
  }
}
function startTimer(){
  const mins = Math.max(1, parseInt(timerInput.value || "1", 10));
  endAt = Date.now() + mins * 60 * 1000;
  timerDisplay.textContent = `${String(mins).padStart(2,"0")}:00`;
  if(timerId) clearInterval(timerId);
  timerId = setInterval(tick, 250);
  timerStart.disabled = true;
  timerStop.disabled = false;
}
function stopTimer(){
  if(timerId){ clearInterval(timerId); timerId = null; }
  timerStop.disabled = true;
  timerStart.disabled = false;
}
timerStart.addEventListener("click", startTimer);
timerStop.addEventListener("click", stopTimer);

printBtn.addEventListener("click", ()=> window.print());