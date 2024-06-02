const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

function populateEventForm(edit=false) {
  const eventTitle = document.getElementById('event-title');
  const eventDescription = document.getElementById('event-description');
  const eventDate = document.getElementById('event-date');
  const eventType = document.getElementById('event-type');
  const eventAddress = document.getElementById('event-address');
  const eventRequirementsContainer = document.getElementById('event-requirements-container');
  const eventPrice = document.getElementById('event-price');
  const maxParticipants = document.getElementById('max-participants');

  sendRequest(`/event/getEventById/${eventId}`).then(async (event) => {
    if(event) {
      const address = await sendRequest(`/event/getAddressById/${event.address_id}`).then((address) => {
        return `${address.street}\n${address.city}\n${address.country}`;
      });
      const location = await sendRequest(`/event/getLocationById/${event.location_id}`);
      eventTitle.value = document.title = event.title;
      eventDescription.value = event.description;
      eventDate.value = `${timestampToDateTime(event.event_start_date)} - ${timestampToDateTime(event.event_end_date)}`;
      eventAddress.value = address;
      eventType.value = event.type;
      eventPrice.value = `${event.price}€`;
      maxParticipants.innerText = maxParticipants.value = event.max_participants;
      await updateMiniMarker(+location.latitude, +location.longitude);
      sendRequest(`/event/getRequirementsByEventId/${eventId}`).then((requirements) => {
        requirements.forEach((requirement) => {
          if(edit) {
            createNewRequirement(requirement.text)
          } else {
            eventRequirementsContainer.appendChild(createRequirementElement(edit, requirement.text));
          }
        });
      });
      if(!edit){
        updateParticipants();
        setEventFormHandleButtons(eventId);
      } else {
        document.getElementById('event-action-delete').style.display = 'block';
      }
    } else {
      console.error('Event not found');
    }
  });
}

function createRequirementElement(editable=false, requirement="") {
  const requirementElement = document.createElement('div');
  const input = document.createElement('input');

  requirementElement.classList.add('event-requirement');
  input.classList.add('event-req-input');
  input.setAttribute('maxlength', '30');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'New Requirement');
  requirementElement.appendChild(input);
  input.value = requirement.length > 0 ? requirement : '';

  if(editable) {
    addInputChangeListener(input);
    const removeButton = document.createElement('div');
    const img = document.createElement('img');
    removeButton.classList.add('event-requirement-remove-button');
    img.setAttribute('src', '../assets/event/close.png');
    img.setAttribute('alt', 'Remove');
    img.setAttribute('width', '13');
    img.setAttribute('height', '13');
    removeButton.appendChild(img);
    addRemoveButtonListener(removeButton);
    requirementElement.appendChild(removeButton);
  } else {
    input.setAttribute("readonly", true);
  }

  return requirementElement;
}

function timestampToDateTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0, -3)}`;
}
