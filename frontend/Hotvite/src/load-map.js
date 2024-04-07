let map;

async function initMap() {
  // Create the map with no initial style specified.
  // It therefore has default styling.
  map = new google.maps.Map(document.getElementById("map"), {
    // 48.143168, 13.991348
    center: { lat: 48.143168, lng: 13.991348 },
    zoom: 8,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapId: "de1416925a195d99",
  });

  console.log("Map loaded");
  //initMapClickEvent(map);
  loadEvents();
}


async function loadEvents(){
  const {AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker");
  const img = document.createElement("img");
  img.src = "../assets/ev_icon.png";
  img.style.width = "30px";
  img.style.height = "39px";
  img.style.filter = "drop-shadow(0 0 5px white)"
  fetch("http://localhost:3000/api/event/getAll").then((response) => response.json()).then((data) => {
    data.forEach((event) => {
      fetch(`http://localhost:3000/api/event/getLocationById/${event.location_id}`).then((response) => response.json()).then((location) => {
        const { latitude, longitude } = location;
        console.log(latitude, longitude);
        const marker = new AdvancedMarkerElement({
          position: { lat: +latitude, lng: +longitude },
          map: map,
          title: event.title,
          content: img,
        });
      });
    });
  });
}
