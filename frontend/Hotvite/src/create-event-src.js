const priceInput = document.getElementById('event-price');
const requirementsContainer = document.getElementById('event-requirements-container');
const addRequirementButton = document.getElementById('event-requirements-add-button');
const toggleChatButton = document.getElementById('event-chat-button');



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



// Add listeners
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
