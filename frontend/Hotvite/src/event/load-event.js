const eventTitle = document.getElementById('event-title');
const eventDescription = document.getElementById('event-description');
const eventDate = document.getElementById('event-date');
const eventType = document.getElementById('event-type');
const eventAddress = document.getElementById('event-address');
const eventRequirementsContainer = document.getElementById('event-requirements-container');
const eventPrice = document.getElementById('event-price');
const maxParticipants = document.getElementById('max-participants');
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

populateEventForm();
function populateEventForm() {
  sendRequest(`/event/getEventById/${eventId}`).then(async (event) => {
    if(event) {
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
      updateParticipants();
      await updateMiniMarker(+location.latitude, +location.longitude);
      sendRequest(`/event/getRequirementsByEventId/${eventId}`).then((requirements) => {
        requirements.forEach((requirement) => {
          eventRequirementsContainer.appendChild(createRequirementElement(requirement));
        });
      });
      setEventFormHandleButtons(eventId);
    } else {
      console.error('Event not found');
    }
  });
}

function setEventFormHandleButtons(eventId) {
  sendRequest(`/event/isCreator/${eventId}`, 'GET', "", true, false).then((response) => {
    if (response) {
      document.getElementById('event-action-edit').style.display = 'block';
    } else {
      sendRequest(`/event/isUserRegistered/${eventId}`, 'GET', "", true, false).then((response) => {
        if (response) {
          showLeaveButton();
        } else {
          showJoinButton();
        }
      });
    }
  });
}

function timestampToDateTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0, -3)}`;
}

function addUserToEvent() {
  sendRequest(`/event/register/${eventId}`, 'PUT', "", true).then((response) => {
    if(response) {
      updateParticipants();
      showLeaveButton();
    }
  });
}

function removeUserFromEvent() {
  sendRequest(`/event/unregister/${eventId}`, 'PUT', "", true).then((response) => {
    if(response) {
      updateParticipants();
      showJoinButton();
    }
  });
}

function showJoinButton() {
  const joinButton = document.getElementById("event-action-join");
  const leaveButton = document.getElementById("event-action-leave");
  joinButton.style.display = 'block';
  leaveButton.style.display = 'none';
}

function showLeaveButton() {
  const leaveButton = document.getElementById("event-action-leave");
  const joinButton = document.getElementById("event-action-join");
  leaveButton.style.display = 'block';
  joinButton.style.display = 'none';
}

function updateParticipants() {
  sendRequest(`/event/getParticipantsFromEvent/${eventId}`).then((data) => data.users).then((participants) => {
    const eventParticipantsContainer = document.getElementById('event-participants-container');
    const joinedParticipants = document.getElementById('joined-participants');
    joinedParticipants.innerText = participants.length;
    if(participants.length === 0) {
      eventParticipantsContainer.innerHTML = '<span id="participants-display-text">Be the first to join this event!</span>';
    } else {
      eventParticipantsContainer.innerHTML = '';
      participants.forEach((participant) => {
        eventParticipantsContainer.appendChild(createParticipantElement(participant));
      });
    }
  });
}

function createParticipantElement(participant) {
  /*
                  <div class="participant">
                  <img class="participant-profile-icon" src="../assets/event/close.png" alt="user">
                  <p class="participant-name">John Doe</p>
                </div>
   */
  const participantElement = document.createElement('div');
  participantElement.classList.add('participant');
  const participantProfileIcon = document.createElement('img');
  participantProfileIcon.classList.add('participant-profile-icon');
  participantProfileIcon.src = '...';
  participantProfileIcon.alt = 'user';
  const participantName = document.createElement('p');
  participantName.classList.add('participant-name');
  participantName.innerText = participant.username;
  participantElement.appendChild(participantProfileIcon);
  participantElement.appendChild(participantName);
  return participantElement;
}
