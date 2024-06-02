const priceInput = document.getElementById('event-price');
const requirementsContainer = document.getElementById('event-requirements-container');
const addRequirementButton = document.getElementById('event-requirements-add-button');
const toggleChatButton = document.getElementById('event-chat-button');
const addressInput = document.getElementById('event-address');
const urlSearchParams = new URLSearchParams(window.location.search);

let lat = urlSearchParams.get('lat');
let lng = urlSearchParams.get('lng');
if(eventId) {
  sendRequest(`/event/getEventById/${eventId}`).then(event => {
    sendRequest(`/event/getLocationById/${event.location_id}`).then(location => {
      lat = location.latitude;
      lng = location.longitude;
    });
  });
  populateEventForm(true);
}

populateProfileForm();
initAddress();
// Listeners
priceInput.addEventListener("focus", function() {
  this.value = "";
});
priceInput.addEventListener("blur", function() {
  const value = parseFloat(priceInput.value);

  if (!isNaN(value) && value >= 0) {
    priceInput.value = value.toFixed(2) + '€';
  } else {
    priceInput.value = '0.00€';
  }
});
addRequirementButton.addEventListener('click', createNewRequirement);
toggleChatButton.addEventListener('click', function() {
  const val = toggleChatButton.value;
  if (val === "Enabled") {
    toggleChatButton.style.backgroundColor = "var(--reject-bg-color)";
    toggleChatButton.value = "Disabled";
  } else {
    toggleChatButton.style.backgroundColor = "var(--accept-bg-color)";
    toggleChatButton.value = "Enabled";
  }
});
addressInput.addEventListener('blur', function() {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: addressInput.value }, async (results, status) => {
    if (status === "OK" && results[0]) {
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      await updateMiniMarker(lat, lng);
    }
  });
});



// Add listeners manually
function addInputChangeListener(input) {
  input.addEventListener('input', function() {
    updateInputWidth(this);
  });
}

function addRemoveButtonListener(removeButton) {
  removeButton.addEventListener('click', function() {
    this.parentElement.remove();
  });
}



// Create new requirement
function createNewRequirement(text="") {
  requirementsContainer.insertBefore(createRequirementElement(true, text), addRequirementButton);
}

// Init Address
function initAddress() {
  if (lat && lng) {
    const geocoder = new google.maps.Geocoder();
    const latLng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({location: latLng}, (results, status) => {
      if (status === "OK" && results[0]) {
        addressInput.value = results[0].formatted_address.replace(/, /g, '\n');
      } else {
        addressInput.value = "Address not found";
      }
    });
  }
}

// Submit event form
function submitEventForm() {
  const title = document.getElementById('event-title').value;
  const description = document.getElementById('event-description').value;
  const dateData = document.getElementById('event-date').value.split('-');
  const price = document.getElementById('event-price').value.slice(0, -1);
  const addressData = document.getElementById('event-address').value.split('\n');
  const participants = document.getElementById('max-participants').value;
  const requirements = [];
  const requirementElements = document.getElementsByClassName('event-requirement');
  const chatEnabled = toggleChatButton.value === "Enabled";
  const type = document.getElementById('event-type').value;

  for (const requirementElement of requirementElements) {
    const input = requirementElement.getElementsByClassName('event-req-input')[0];
    if (input.value.length > 0) {
      requirements.push(input.value);
    }
  }

  const data = {
    title: title,
    description: description,
    address: {
      street: addressData[0],
      city: addressData[1],
      country: addressData[2]
    },
    location: {latitude: lat, longitude: lng},
    max_participants: participants,
    price: price,
    type: type,
    chat: chatEnabled,
    event_start_date: dateStringToTimestamp(dateData[0].trim()),
    event_end_date: dateStringToTimestamp(dateData[1].trim()),
    requirements: requirements
  };

  if (eventId) {
    updateEvent(data);
  } else {
    data.created_at = Date.now();
    createEvent(data);
  }
}

function createEvent(data) {
  sendRequest('/event/create', 'POST', data, true).then((response) => {
    if (response) {
      window.location.href = './index.html';
    }
  });
}

function updateEvent(data) {
  const eventId = urlSearchParams.get('id');
  sendRequest(`/event/changeEventDetails/${eventId}`, 'PUT', data, true).then((response) => {
    if (response) {
      window.location.href = `./event.html?id=${eventId}`;
    }
  });
}

function deleteEvent() {
  const eventId = urlSearchParams.get('id');
  sendRequest(`/event/deleteEvent/${eventId}`, "DELETE", "", true).then((response) => {
    if (response) {
      window.location.href = './index.html';
    }
  });
}


function dateStringToTimestamp(date) {
  const dateArray = date.split(' ');
  const dateData = dateArray[0].split('.');
  const timeData = dateArray[1].split(':');
  const day = parseInt(dateData[0]);
  const month = parseInt(dateData[1]);
  const year = parseInt(dateData[2]);
  const hours = parseInt(timeData[0]);
  const minutes = parseInt(timeData[1]);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}

function updateInputWidth(input) {
  input.style.width = '50px';
  if(input.value.length > 0) {
    input.style.width = (input.scrollWidth + 1) + 'px';
  } else {
    input.style.width = 'auto';
  }
}
