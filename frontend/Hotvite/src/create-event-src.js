const priceInput = document.getElementById('event-price');
const requirementsContainer = document.getElementById('event-requirements-container');
const addRequirementButton = document.getElementById('event-requirements-add-button');
const toggleChatButton = document.getElementById('event-chat-button');
const addressInput = document.getElementById('event-address');



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
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();
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
  const urlParams = new URLSearchParams(window.location.search);
  const lat = urlParams.get('lat');
  const lng = urlParams.get('lng');

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
