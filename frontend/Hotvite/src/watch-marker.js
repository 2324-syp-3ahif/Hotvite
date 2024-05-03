let watcher;
let button;

function createButton(){
  const button = document.createElement("button");
  button.innerText = "Watch";
  button.style.position = "absolute";
  button.style.zIndex = "1000";
  button.style.width = "100px";
  button.style.height = "50px";
  button.style.backgroundColor = "red";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  return button;
}

function startWatching(marker){
  if(button == null){
    button = createButton();
    document.body.appendChild(button);
  }
  if(watcher != null){
    clearInterval(watcher);
  }
  watcher = setInterval(() => {
    updateWatcherPosition(marker, button);
  }, 1000);
}

function updateWatcherPosition(marker, button){
}
