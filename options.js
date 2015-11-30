// Saves options to chrome.storage
function save_options() {

  var includeOrig = document.getElementById('includeOrig').checked;
  chrome.storage.local.set({
    includeOrig: includeOrig
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get({
    includeOrig: true
  }, function(items) {
    document.getElementById('includeOrig').checked = items.includeOrig;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);