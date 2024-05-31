let map;
let miniMarker;

async function initMap(fullInit = true) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 48.143168, lng: 13.991348 },
    zoom: fullInit ? 8 : 15,
    minZoom: 3,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180
      },
    },
    mapTypeControl: fullInit,
    zoomControl: fullInit,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    mapId: "de1416925a195d99",
  });

  if(fullInit) {
    await loadEvents();
    await initMapClickEvent();
  }
}

async function initMiniMap() {
  const urlParams = new URLSearchParams(window.location.search);
  const lat = +urlParams.get('lat');
  const lng = +urlParams.get('lng');
  await initMap(false);
  await updateMiniMarker(lat, lng);
}

async function updateMiniMarker(lat, lng) {
  map.panTo({ lat: lat, lng: lng });
  if (miniMarker) {
    miniMarker.setMap(null);
  }
  miniMarker = await createNewMarker(lat, lng, "create_event_icon.png");
}


async function loadEvents(){
  requestJSON("/event/getAll").then((data) => {
    if(data) {
      data.forEach(async (event) => {
        await createMarker(event);
      });
    }
  });
}

async function createMarker(event){
  requestJSON(`/event/getLocationById/${event.location_id}`).then(async (location) => {
    const { latitude, longitude } = location;
    return await createNewMarker(+latitude, +longitude);
  }).then((marker) => {
    marker.addListener("click", () => {
      window.location.href = `./event.html?id=${event.id}`;
    });
  });
}

function createImgElement(imgSrc){
  const img = document.createElement("img");
  img.src = imgSrc;
  img.style.width = "30px";
  img.style.height = "39px";
  img.style.filter = "drop-shadow(0 0 2px white)"
  return img;
}

async function initMapClickEvent() {
  let currentTimeout = null;
  let setMarker = null;
  map.addListener("rightclick", async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    if (setMarker) {
      setMarker.setMap(null);
    }
    setMarker = createNewMarker(lat, lng);
    map.setZoom(12);
    map.panTo({ lat, lng });
    currentTimeout = setTimeout(() => {
      window.location.href = "./create-event.html?lat=" + lat + "&lng=" + lng;
    }, 1000);
  });

  map.addListener("click", async (event) => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    if (setMarker) {
      setMarker.setMap(null);
    }
  });
}

async function createNewMarker(lat, lng, icon="ev_icon.png"){
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  return new AdvancedMarkerElement({
    position: {lat, lng},
    map,
    content: createImgElement(`../assets/event/${icon}`),
  });
}

window.initMap = initMap;
