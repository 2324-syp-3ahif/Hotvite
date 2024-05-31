function createRequirementElement(requirement, editable=false) {
  const requirementElement = document.createElement('div');
  const input = document.createElement('input');

  requirementElement.classList.add('event-requirement');
  input.classList.add('event-req-input');
  input.setAttribute('maxlength', '30');
  input.setAttribute('type', 'text');
  requirementElement.appendChild(input);

  if(editable) {
    addInputChangeListener(input);
    const removeButton = document.createElement('div');
    const img = document.createElement('img');
    input.setAttribute('placeholder', requirement.text);
    removeButton.classList.add('event-requirement-remove-button');
    img.setAttribute('src', '../assets/event/close.png');
    img.setAttribute('alt', 'Remove');
    img.setAttribute('width', '13');
    img.setAttribute('height', '13');
    removeButton.appendChild(img);
    addRemoveButtonListener(removeButton);
    requirementElement.appendChild(removeButton);
  } else {
    input.value = requirement.text;
    input.setAttribute("readonly", true);
  }

  return requirementElement;
}
