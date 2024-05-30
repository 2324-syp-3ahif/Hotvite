const priceInput = document.getElementById('event-price');
const requirementsContainer = document.getElementById('event-requirements-container');
const addRequirementButton = document.getElementById('event-requirements-add-button');
const toggleChatButton = document.getElementById('event-chat-button');
const addressInput = document.getElementById('event-address');
let {lat, lng} = new URLSearchParams(window.location.search);


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
    this.style.width = '50px';
    if(this.value.length > 0) {
      this.style.width = (this.scrollWidth + 1) + 'px';
    } else {
      this.style.width = 'auto';
    }
  });
}

function addRemoveButtonListener(removeButton) {
  removeButton.addEventListener('click', function() {
    this.parentElement.remove();
  });
}



// Create new requirement
function createNewRequirement() {
  createRequirementElement({ text: 'New Requirement' });
}

function createRequirementElement(requirement) {
  const requirementElement = document.createElement('div');
  const input = document.createElement('input');
  const removeButton = document.createElement('div');
  const img = document.createElement('img');

  requirementElement.classList.add('event-requirement');
  input.classList.add('event-req-input');
  input.setAttribute('maxlength', '30');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', requirement.text);
  addInputChangeListener(input);

  removeButton.classList.add('event-requirement-remove-button');
  img.setAttribute('src', '../assets/event/close.png');
  img.setAttribute('alt', 'Remove');
  img.setAttribute('width', '13');
  img.setAttribute('height', '13');
  removeButton.appendChild(img);
  addRemoveButtonListener(removeButton);

  requirementElement.appendChild(input);
  requirementElement.appendChild(removeButton);
  requirementsContainer.insertBefore(requirementElement, addRequirementButton);
}

// Init Address
function initAddress() {
  if (lat && lng) {
    const geocoder = new google.maps.Geocoder();
    const latLng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({location: latLng}, (results, status) => {
      if (status === "OK" && results[0]) {
        const addressData = results[0].formatted_address.replace(/, /g, '\n');
        addressInput.value = addressData;
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
  const price = parseFloat(document.getElementById('event-price').value);
  const addressData = document.getElementById('event-address').value.split('\n');
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
    title,
    description,
    addressData, // TODO: Parse addressData
    event_start_date: dateStringToTimestamp(dateData[0]),
    event_end_date: dateStringToTimestamp(dateData[1]),
    price,
    conditions: requirements,
    chatEnabled,
    type,
    location: {lat, lng},
    created_at: Date.now()
  };

  fetch('http://localhost:3000/api/event/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (response.status === 200) {
      window.location.href = '/index.html';
    }
  });
}


function dateStringToTimestamp(date) {
  // date format: "dd.MM.yyyy HH:mm"
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
