const input = document.querySelector('.event-req-input');
const priceInput = document.getElementById('event-price');

input.addEventListener('input', function() {
  this.style.width = '50px';
  if(this.value.length > 0) {
    this.style.width = (this.scrollWidth + 1) + 'px';
  } else {
    this.style.width = 'auto';
  }
});

priceInput.addEventListener("focus", function() {
  this.value = "";
});

function formatPrice() {
  const input = document.getElementById('event-price');
  const value = parseFloat(input.value);

  if (!isNaN(value) && value >= 0) {
    input.value = value.toFixed(2) + '€';
  } else {
    input.value = '0.00€';
  }
}
