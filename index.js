const wheel = document.querySelector(".wheel");
const button = document.querySelector(".spin-button");
const arrow = document.querySelector(".arrow");
const winContainer = document.querySelector("p");
const mainContainer = document.querySelector(".main-container");
const winAudio = document.querySelector("#win-audio");
const rotatingAudio = document.querySelector("#rotating-audio");

winAudio.volume = 0.4;
rotatingAudio.volume = 0.2;

let prizes = Array.from(document.querySelectorAll("span"));
const sectorsCount = prizes.length;
const oneSpinDegrees = 360;
const degreesPerSlice = oneSpinDegrees / sectorsCount;
let index = 0;
let newPrizes = [...prizes];
let counter = 0;
let currentSector = 0;
let isFreeSpins = false;
let spinCounter = 0;

button.addEventListener("click", () => {
  rotateWheel();
});

const rotateWheel = () => {
  button.disabled = true;

  newPrizes = [...prizes].reverse();
  let randomSector = Math.floor(Math.random() * sectorsCount);

  currentSector += degreesPerSlice * (randomSector + 1) + oneSpinDegrees * 4;
  wheel.style.transform = `rotate(${Math.abs(currentSector + 45)}deg)`;
  index += randomSector;
  !isFreeSpins ? spinCounter++ : null;

  if (index >= sectorsCount) {
    index = index - sectorsCount;
  }
  counter++;
  for (let i = 0; i < counter; i++) {
    const firstIndex = newPrizes.shift();
    newPrizes.push(firstIndex);
  }

  if (
    spinCounter % 10 === 3 ||
    spinCounter % 10 === 6 ||
    spinCounter % 10 === 9
  ) {
    !isFreeSpins ? sectorToStop("10 $") : null;
  } else if (spinCounter % 10 === 4 || spinCounter % 10 === 8) {
    !isFreeSpins ? sectorToStop("20 $") : null;
  } else {
    let filteredSectors;
    isFreeSpins
      ? (filteredSectors = newPrizes.filter(
          (prize) => prize.textContent !== "free spins"
        ))
      : (filteredSectors = newPrizes.filter(
          (prize) =>
            prize.textContent !== "10 $" && prize.textContent !== "20 $"
        ));

    if (filteredSectors.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredSectors.length);
      const randomSector = filteredSectors[randomIndex].textContent;
      sectorToStop(randomSector);
    }
  }

  rotatingAudio.play();

  arrow.classList.add(`active`);
  setTimeout(() => {
    stopWheel();
    rotatingAudio.pause();
  }, 5000);
};

const stopWheel = () => {
  button.disabled = false;
  winAudio.play();

  if (!isFreeSpins) {
    winContainer.innerHTML = `${newPrizes[index].textContent}`;
    rotatingAudio.pause();
  }

  if (newPrizes[index].textContent === `free spins`) {
    startFreeSpins();
  }
  arrow.classList.remove(`active`);
};

const sectorToStop = (value) => {
  const targetIndex = newPrizes.findIndex(
    (prize) => prize.textContent === value
  );
  const sectorsToRotate =
    (targetIndex - index + newPrizes.length) % newPrizes.length;
  const degreesToRotate = sectorsToRotate * degreesPerSlice;

  currentSector += degreesToRotate;
  wheel.style.transform = `rotate(${Math.abs(currentSector + 45)}deg)`;
  index = targetIndex;
};

const startFreeSpins = () => {
  isFreeSpins = true;
  let totalWin = 0;
  let spinsLeft = 3;

  mainContainer.classList.add("big-win");

  const spin = () => {
    rotateWheel();
    const currentPrize = newPrizes[index].textContent;

    if (currentPrize !== "free spins") {
      totalWin += parseInt(currentPrize);
    }
  };

  const spinMultipleTimes = () => {
    if (spinsLeft > 0) {
      spin();
      spinsLeft--;
      setTimeout(spinMultipleTimes, 5000);
    } else {
      mainContainer.classList.remove("big-win");
      winContainer.innerHTML = `${totalWin} $`;
      totalWin = 0;
      isFreeSpins = false;
    }
  };
  spinMultipleTimes();
};
