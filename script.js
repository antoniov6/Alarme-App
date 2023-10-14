const timerRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarms-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("./alarme.mp3");

let alarmIndex = 0;
let alarmsArray = [];
let initialHour = 0;
let initialMinute = 0;

const appendZero = (value) => (value < 10 ? "0" + value : value);

// Função para exibir hora e acionar alarmes

const displayTimer = () => {
  const date = new Date();
  const currentTime = date.toLocaleTimeString("pt-br", { hour12: false });
  timerRef.textContent = currentTime;

  // Checar se é a hora para acionar os alarmes

  alarmsArray.forEach((alarm) => {
    if (alarm.isActive && alarm.time === currentTime.slice(0, 5)) {
      alarmSound.play();
    }
  });
};

// Função para criar novo alarme

const createAlarm = (hour, minute) => {
  alarmIndex += 1;

  // Criar um objeto de alarmes
  const alarmObj = {
    id: `${alarmIndex}_${hour}_${minute}`,
    time: `${appendZero(hour)}:${appendZero(minute)}`,
    isActive: false,
  };

  // Add alarme ao array e criar UI dele
  alarmsArray.push(alarmObj);
  const alarmDiv = document.createElement("div");
  alarmDiv.className = "alarm";
  alarmDiv.dataset.id = alarmObj.id;
  alarmDiv.innerHTML = `<span>${alarmObj.time}</span>`;

  //Criar checkbox para ativar/desativar alarme
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => toggleAlarm(alarmObj));
  alarmDiv.appendChild(checkbox);

  // Criar um botão de deletar o alarme
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa solid fa-trash-can"></i>`;
  deleteButton.className = "deleteButton";
  deleteButton.addEventListener("click", () => deleteAlarm(alarmObj));
  alarmDiv.appendChild(deleteButton);

  // Add alarme UI à lista de alarmes ativos
  activeAlarms.appendChild(alarmDiv);
};

// Função para alternar o estado ativo do alarme
const toggleAlarm = (alarm) => {
  alarm.isActive = !alarm.isActive;
  if (alarm.isActive) {
    const currentTime = new Date()
      .toLocaleTimeString("pt-br", { hour12: false })
      .slice(0, 5);
    if (alarm.time === currentTime) {
      alarmSound.play();
    }
  } else {
    alarmSound.pause();
  }
};

// Função para deletar um alarme
const deleteAlarm = (alarm) => {
  const index = alarmsArray.indexOf(alarm);
  if (index > -1) {
    alarmsArray.splice(index, 1);
    document.querySelector(`[data-id="${alarm.id}"]`).remove();
  }
};

// Event listener para limpar todos os alarmes
clearAllButton.addEventListener("click", () => {
  alarmsArray = [];
  activeAlarms.innerHTML = "";
});

// Event listener para configurar novo alarme
setAlarm.addEventListener("click", () => {
  // Analisar os valores de input,padrão 0 se estiver vazio ou NaN
  let hour = parseInt(hourInput.value) || 0;
  let minute = parseInt(minuteInput.value) || 0;

  // Validar os valores de input
  if (hour < 0 || hour > 23 || minute < 0 || minute > 57) {
    alert("Horas ou minutos inválidos. Por favor insira um valor válido!");
    return;
  }

  //Checar se já existe um alarme com o horario requisitado
  if (
    !alarmsArray.some(
      (alarm) => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`
    )
  ) {
    createAlarm(hour, minute);
  }
  // Limpar campos do input
  [hourInput.value, minuteInput.value] = ["", ""];
});

// Inicializar o timer e limpar inputs
window.onload = () => {
  setInterval(displayTimer, 1000);
  [hourInput.value, minuteInput.value] = ["", ""];
};
