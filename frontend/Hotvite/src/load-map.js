let map;
let miniMarker;

async function initMap(fullInit = true) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  map = new google.maps.Map(document.getElementById("map"), {
    // 48.143168, 13.991348
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
    mapId: "de1416925a195d99",
  });

  if(fullInit) {
    loadEvents(AdvancedMarkerElement);
    initMapClickEvent(AdvancedMarkerElement);
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
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  map.panTo({ lat: lat, lng: lng });
  if (miniMarker) {
    miniMarker.setMap(null);
  }
  miniMarker = new AdvancedMarkerElement({
    position: { lat, lng },
    map,
    content: createImgElement("../assets/event/create_event_icon.png")
  });
}


async function loadEvents(AdvancedMarkerElement){
  requestJSON("/api/event/getAll").then((data) => {
    data.forEach((event) => {
      createMarker(event, AdvancedMarkerElement);
    });
  });
}

async function createMarker(event, AdvancedMarkerElement){
  const img = createImgElement("../assets/event/ev_icon.png");
  requestJSON(`/api/event/getLocationById/${event.location_id}`).then((location) => {
    const { latitude, longitude } = location;
    new AdvancedMarkerElement({
      position: { lat: +latitude, lng: +longitude },
      map,
      content: img,
    });
  });
}

function createImgElement(imgSrc){
  const img = document.createElement("img");
  img.src = imgSrc;
  // img.src = "https://cdn.discordapp.com/attachments/907636016674902037/1226616985413226536/2c90950f81e0533916080d2f4c8f71ad.webp?ex=66256b16&is=6612f616&hm=4560c272309319a581a433b1acac3e8f0bee79a9a558594a5fbbf0db23ab002a&;"
  img.style.width = "30px";
  img.style.height = "39px";
  img.style.filter = "drop-shadow(0 0 2px white)"
  return img;
}

async function initMapClickEvent(AdvancedMarkerElement) {
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
    setMarker = new AdvancedMarkerElement({
      position: { lat, lng },
      map,
      content: createImgElement("../assets/event/ev_icon.png"),
    });
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

window.initMap = initMap;
