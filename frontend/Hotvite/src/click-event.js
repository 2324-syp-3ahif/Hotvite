async function initMapClickEvent(map) {
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

  map.addListener("click", async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const marker = new AdvancedMarkerElement({
      position: { lat, lng },
      map,
      style: {
        color: "blue",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
        },
      },
    });

    map.panTo({ lat, lng });
  });
}
