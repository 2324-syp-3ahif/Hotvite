const eventTitle = document.getElementById('event-title');
const eventDescription = document.getElementById('event-description');
const eventDate = document.getElementById('event-date');
const eventType = document.getElementById('event-type');
const eventAddress = document.getElementById('event-address');
const eventRequirementsContainer = document.getElementById('event-requirements-container');
const eventPrice = document.getElementById('event-price');
const eventParticipantsContainer = document.getElementById('event-participants-container');
const maxParticipants = document.getElementById('max-participants');
const joinedParticipants = document.getElementById('joined-participants');

populateEventForm();
function populateEventForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  sendRequest(`/event/getEventById/${eventId}`).then(async (event) => {
    if(event) {
      const participants = await sendRequest(`/event/getParticipantsFromEvent/${eventId}`).then((data) => data.users);
      const address = await sendRequest(`/event/getAddressById/${event.address_id}`).then((address) => {
        return `${address.street}\n${address.city}\n${address.country}`;
      });
      const location = await sendRequest(`/event/getLocationById/${event.location_id}`);
      eventTitle.value = event.title;
      eventDescription.value = event.description;
      eventDate.value = `${timestampToDateTime(event.event_start_date)} - ${timestampToDateTime(event.event_end_date)}`;
      eventAddress.value = address;
      eventType.value = event.type;
      eventPrice.value = `${event.price}€`;

      maxParticipants.innerText = event.max_participants;
      joinedParticipants.innerText = participants.length;
      // TODO: Show participants
      await updateMiniMarker(+location.latitude, +location.longitude);
      sendRequest(`/event/getRequirementsByEventId/${eventId}`).then((requirements) => {
        requirements.forEach((requirement) => {
          eventRequirementsContainer.appendChild(createRequirementElement(requirement));
        });
      });
      sendRequest(`/event/isUserRegistered/${eventId}`, 'GET', "", true, false).then((response) => {
        if (response) {
          showLeaveButton();
        } else {
          showJoinButton();
        }
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

function addUserToEvent() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  sendRequest(`/event/register/${eventId}`, 'PUT', "", true).then((response) => {
    if(response) showLeaveButton();
  });
}

function removeUserFromEvent() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  sendRequest(`/event/unregister/${eventId}`, 'PUT', "", true).then((response) => {
    if(response) showJoinButton();
  });
}

function showJoinButton() {
  const joinButton = document.getElementById("event-action-join");
  const leaveButton = document.getElementById("event-action-leave");
  joinButton.style.display = 'block';
  leaveButton.style.display = 'none';
}

function showLeaveButton() {
  const joinButton = document.getElementById("event-action-join");
  const leaveButton = document.getElementById("event-action-leave");
  joinButton.style.display = 'none';
  leaveButton.style.display = 'block';
}
