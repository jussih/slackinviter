//polyfills
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

$(document).ready(function () {
  var $apiKey = $('#api-key'),
      $channel = $('#channel'),
      $addresses = $('#addresses'),
      $timer = $('.timer'),
      timerStarted = false;

  app.init();
  $('#add-btn').on('click', function() {
    app.add($apiKey.val(), $channel.val(), parseAddresses($addresses.val()));
    app.invite();
    if (!timerStarted) {
      startTimer();
      timerStarted = true;
    }
  });

});

function parseAddresses(addresses) {
  addresses = addresses.trim();
  return addresses.split(/\s*[;,\n]\s*/);
}

function startTimer() {
  var $timer = $('.timer');
  $timer.startTimer({
    onComplete: timerCallback,
    loop: true,
    loopInterval: 1,
  });
}

function timerCallback() {
  app.invite();
}
