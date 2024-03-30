let map;

async function initMap() {
  // Create the map with no initial style specified.
  // It therefore has default styling.
  map = new google.maps.Map(document.getElementById("map"), {
    // 48.143168, 13.991348
    center: { lat: 48.143168, lng: 13.991348 },
    zoom: 30,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapId: "de1416925a195d99",
  });

  const style = await queryStyle();
  map.setOptions({
      styles: style
  });
  initMapClickEvent(map);
}

async function queryStyle(){
  return await fetch("http://localhost:3001/api/v1/map/style", {
    method: "GET"
  }).then(res => res.json());
}

window.initMap = initMap;
