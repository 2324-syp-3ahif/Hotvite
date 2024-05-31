const eventTitle = document.getElementById('event-title');
const eventDescription = document.getElementById('event-description');
const eventDate = document.getElementById('event-date');
const eventType = document.getElementById('event-type');
const eventAddress = document.getElementById('event-address');
const eventRequirementsContainer = document.getElementById('event-requirements-container');
const eventPrice = document.getElementById('event-price');
const eventParticipantsContainer = document.getElementById('event-participants-container');

populateEventForm();
function populateEventForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  requestJSON(`/event/getEventById/${eventId}`).then(async (event) => {
    if(event) {
      const address = await requestJSON(`/event/getAddressById/${event.address_id}`).then((address) => {
        return `${address.street}\n${address.city}\n${address.country}`;
      });
      const location = await requestJSON(`/event/getLocationById/${event.location_id}`);
      eventTitle.value = event.title;
      eventDescription.value = event.description;
      eventDate.value = `${timestampToDateTime(event.event_start_date)} - ${timestampToDateTime(event.event_end_date)}`;
      eventAddress.value = address;
      eventType.value = event.type;
      eventPrice.value = `${event.price}€`;

      // TODO: Show participants
      await updateMiniMarker(+location.latitude, +location.longitude);
      requestJSON(`/event/getRequirementsByEventId/${eventId}`).then((requirements) => {
        requirements.forEach((requirement) => {
          eventRequirementsContainer.appendChild(createRequirementElement(requirement));
        });
      });
    } else {
      console.error('Event not found');
    }
  });
}

function timestampToDateTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0, -3)}`;
}
