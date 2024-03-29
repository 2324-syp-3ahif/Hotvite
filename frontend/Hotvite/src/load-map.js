let map;

async function initMap() {
  // Create the map with no initial style specified.
  // It therefore has default styling.
  map = new google.maps.Map(document.getElementById("map"), {
    // 48.26847233933563, 14.252129637252795
    center: { lat: 48.268, lng: 14.252 },
    zoom: 10,
    mapTypeControl: false,
  });

  const style = await queryStyle();
  console.log(style);
  map.setOptions({
      styles: style
  });
}

async function queryStyle(){
  return await fetch("http://localhost:3001/api/v1/map/style", {
    method: "GET"
  }).then(res => res.json());
}

window.initMap = initMap;
