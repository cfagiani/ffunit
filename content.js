
//Conversions to football fields (300 feet)
var conversions = {
	meter: 0.0109361329834,
	foot: 0.0033333333333333335
};

var replacementCount = 0;

// strings representing units of length and their corresponding conversion factors
// order here matters since we don't want a substring of a subsequent entry to appear first
// (i.e. m can't show up before mile since it would greedily match based on the regex we're using)
var searchStrings = {
	meter: {factor: 1, ff:conversions.meter},
	mile: {factor: 5280, ff:conversions.foot},	
	millimeter: {factor: 0.001, ff:conversions.meter},
	centimeter: {factor: 0.01, ff:conversions.meter},
	foot: {factor: 1, ff:conversions.foot},
	ft: {factor: 1, ff:conversions.foot},
	feet: {factor: 1, ff:conversions.foot},
	yard: {factor: 3, ff:conversions.foot},
	yd: {factor: 3, ff:conversions.foot},
	mm: {factor: 0.001, ff:conversions.meter},
	cm: {factor: 0.01, ff:conversions.meter},
	mi: {factor: 5280, ff:conversions.foot},
	m: {factor: 1, ff:conversions.meter}
};

// send a message to the background script to load the options
chrome.runtime.sendMessage({method: "getConfig"}, function(response) {
	convertAllMeasures(response.includeOrig);
	if (replacementCount> 0){
	//if we have at least 1 replacement, send a message so the background script can show the icon
	chrome.runtime.sendMessage({method:"showIcon","replacements": replacementCount}, function(response) {});
}

});




/**
* iterates over all elements in the DOM and find the text
* for each text node, try all the replacements in order
*/
function convertAllMeasures(includeOrig){	
	var elements = document.getElementsByTagName('*');
	for (var i = 0; i < elements.length; i++) {
    	var element = elements[i];
	    for (var j = 0; j < element.childNodes.length; j++) {
    	    var node = element.childNodes[j];
        	if (node.nodeType === 3) {
            	var text = node.nodeValue;
	    		//for each search string, try to do the replacement.
    	        for (var unit in searchStrings) {
 				   if (searchStrings.hasOwnProperty(unit)) {
						text = handleReplacement(text,unit,includeOrig);
			    	}
				}
            	element.replaceChild(document.createTextNode(text), node);          
        	}
    	}
	}
}

/**
* Replaces all units of length with the corresponding number of football fields. This method uses a regex
* that should match any number (that may or may not contain commas and decimal places).
* 
*
*/
function handleReplacement(text, unit, keepOrig){	
	var regex = new RegExp("(?:^|\\s)(\\d*\\.?\\d+|\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?)(\\s+"+unit+"s*\\b)", "gi");	
	var matchedData = text.match(regex);
	while (matchedData != null){		
		text= text.replace(regex, function($0,$1){			
				replacementCount++;
				var num = Number($1.replace(/,/g,''))*searchStrings[unit].factor*searchStrings[unit].ff
				var textToReturn = " "+(num.toFixed(4)+ " football field"+(num!=1?"s":""));
				if (keepOrig){
					textToReturn += " ("+$1+" "+unit+") ";
				}
				return textToReturn
		});
		matchedData = text.match(regex);
	}
	return text;
}
