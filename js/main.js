//polyfills
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

$(document).ready(function () {
  var $apiKey = $('#api-key'),
      $channel = $('#channel'),
      $addresses = $('#addresses');

  app.init();
  $('#add-btn').on('click', function() {
    app.add($apiKey.val(), $channel.val(), parseAddresses($addresses.val()));
  })

});

function parseAddresses(addresses) {
  addresses = addresses.trim();
  return addresses.split(/\s*[;,\n]\s*/);
}
