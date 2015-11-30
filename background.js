//displays the FF Unit icon in the omnibar
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  if (request.method == "getConfig"){
		  chrome.storage.local.get({includeOrig: true}, function(items) {
	    	  sendResponse({includeOrig: items.includeOrig});
    	  });
    	}else{
   			chrome.pageAction.show(sender.tab.id);
   		}
   		return true;
  });