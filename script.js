// Estimate form: sends to Web3Forms without leaving the page,
// then shows the thank-you message.
(function () {
  var form = document.getElementById('estimate-form');
  if (!form) return;

  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');
  var thanks = document.getElementById('form-thanks');
  var fallback = 'Please call or text 843-742-9776.';

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Spam trap: real people never tick this hidden box.
    if (form.botcheck.checked) return;

    var key = form.access_key.value;
    if (!key || key.indexOf('YOUR_') === 0) {
      status.textContent = "The form isn't connected yet. " + fallback;
      return;
    }

    var data = {};
    new FormData(form).forEach(function (value, name) { data[name] = value; });

    var label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (!result.success) throw new Error(result.message || 'Send failed');
        form.reset();
        form.hidden = true;
        thanks.hidden = false;
        thanks.focus();
      })
      .catch(function () {
        status.textContent = "Sorry, that didn't go through. " + fallback;
      })
      .then(function () {
        button.disabled = false;
        button.textContent = label;
      });
  });
})();
