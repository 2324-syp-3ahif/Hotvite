populateEventForm();

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

function editEvent() {
  window.location.href = `./edit-event.html?id=${eventId}`;
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
