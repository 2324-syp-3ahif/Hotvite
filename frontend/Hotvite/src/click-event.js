async function initMapClickEvent(map) {
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker")
  map.addListener("click", async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    new AdvancedMarkerElement({
      position: { lat, lng },
      map,
    });

    map.panTo({ lat, lng });
  });
}
