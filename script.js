const canvas = document.getElementById("signature-pad");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");
const context = canvas.getContext("2d");
let display = document.getElementById("show");
let painting = false;
let drawStart = false;

function startPosition(e) {
  painting = true;
  drawStart = true;
  draw(e);
}

function finishedPosition() {
  painting = false;
  context.beginPath();
  saveState();
}

function draw(e) {
  if (!painting) return;
  let clientX, clientY;
  if (e.type.startsWith("touch")) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  context.lineWidth = 2;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = "black";

  const x = clientX - canvas.offsetLeft;
  const y = clientY - canvas.offsetTop;

  if (painting) {
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  } else {
    context.moveTo(x, y);
  }
}

function saveState() {
  localStorage.setItem("canvas", canvas.toDataURL());
}

function loadState() {
  const savedData = localStorage.getItem("canvas");
  if (savedData) {
    const img = new Image();
    img.src = savedData;
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
    };
  }
}

canvas.addEventListener("mousedown", (e) => {
  painting = true;
  drawStart = true;
  startPosition(e);
});

canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", (e) => {
  painting = true;
  drawStart = true;
  startPosition(e);
});

canvas.addEventListener("touchend", finishedPosition);
canvas.addEventListener("touchmove", draw);

clearBtn.addEventListener("click", () => {
  drawStart = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
  display.innerHTML = "";
});

saveBtn.addEventListener("click", () => {
  if (drawStart) {
    const dataURL = canvas.toDataURL();
    let img = document.createElement("img");
    img.setAttribute("class", "signature-img");
    img.src = dataURL;
    const aFilename = document.createElement("a");
    aFilename.href = dataURL;
    aFilename.download = "signature.png";
    const filenameTextNode = document.createTextNode("signature.png");
    aFilename.appendChild(filenameTextNode);
    aFilename.appendChild(img);
    display.appendChild(img);
    display.appendChild(aFilename);
  } else {
    display.innerHTML = "<span class='error'>Please sign before saving</span>";
  }
});

loadState();
window.onload = (event) => {
  drawStart = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
};