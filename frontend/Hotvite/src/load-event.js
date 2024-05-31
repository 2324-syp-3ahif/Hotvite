const eventTitle = document.getElementById('event-title');
const eventDescription = document.getElementById('event-description');
const eventDate = document.getElementById('event-date');
const eventType = document.getElementById('event-type');
const eventAddress = document.getElementById('event-address');
const eventRequirements = document.getElementsByClassName('event-req-input');
const eventPrice = document.getElementById('event-price');
const eventParticipantsContainer = document.getElementById('event-participants-container');

populateEventForm();
function populateEventForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  requestJSON(`/event/getEventById/${eventId}`).then((event) => {
    if(event) {
      // TODO: Get address from address id
      console.log(address);
      eventTitle.value = event.title;
      eventDescription.value = event.description;
      eventDate.value = `${timestampToDateTime(event.event_start_date)} - ${timestampToDateTime(event.event_end_date)}`;
      eventType.value = event.type;
      eventAddress.value = address;
      eventPrice.value = `${event.price}€`;
      eventParticipantsContainer.value = event.max_participants;

      for (let i = 0; i < eventRequirements.length; i++) {
        eventRequirements[i].value = event.requirements[i];
      }
    } else {
      console.error('Event not found');
    }
  });
}

function timestampToDateTime(timestamp) {
  const date = new Date(timestamp);
  // dd.MM.yyyy HH:mm
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}
