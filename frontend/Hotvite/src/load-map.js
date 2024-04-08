let map;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    // 48.143168, 13.991348
    center: { lat: 48.143168, lng: 13.991348 },
    zoom: 8,
    minZoom: 3,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180
      },
    },
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    mapId: "de1416925a195d99",
  });

  console.log("Map loaded");
  //initMapClickEvent(map);
  loadEvents();
  console.log(document.querySelector(".gm-style"));
}


async function loadEvents(){
  requestJSON("/api/event/getAll").then((data) => {
    data.forEach((event) => {
      createMarker(event);
    });
  });
}

async function createMarker(event){
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const img = createImgElement();
  requestJSON(`/api/event/getLocationById/${event.location_id}`).then((location) => {
    const { latitude, longitude } = location;
    const marker = new AdvancedMarkerElement({
      position: { lat: +latitude, lng: +longitude },
      title: event.title,
      map,
      content: img,
    });
  });
}

function createImgElement(){
  const img = document.createElement("img");
  img.src = "../assets/ev_icon.png";
  // img.src = "https://cdn.discordapp.com/attachments/907636016674902037/1226616985413226536/2c90950f81e0533916080d2f4c8f71ad.webp?ex=66256b16&is=6612f616&hm=4560c272309319a581a433b1acac3e8f0bee79a9a558594a5fbbf0db23ab002a&;"
  img.style.width = "30px";
  img.style.height = "39px";
  img.style.filter = "drop-shadow(0 0 5px white)"
  return img;
}

window.initMap = initMap;
