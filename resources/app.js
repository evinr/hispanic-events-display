var numberOfElements;
var data; 

function loadData() {
	var targetUrl = 'http://d345h07ts0fu2m.cloudfront.net/379/data48.json';
	var proxy = 'http://cors.io/?u=';
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
       		eval(xhttp.responseText)
            // removes the loading animation
            var child = document.getElementsByClassName('loader')[0];
			document.body.removeChild(child);
        }
    }
    xhttp.open("GET", proxy + targetUrl, true);
    xhttp.send();
}


function updateListener (targetId) {
	var targetField = targetId.split('-')[0];
	var targetElementNumber = parseFloat(targetId.split('-')[1]);
	
	if (targetField === 'close') {
		closeLightbox();
	}

	if (targetField === 'lightbox') {
		launchLightbox();
		renderLightbox(targetElementNumber);
	}

	if (targetField === 'next') {
		renderLightbox(targetElementNumber + 1);
	}

	if (targetField === 'prev') {
		renderLightbox(targetElementNumber - 1);
	}

	if (targetField === 'rsvp') {
		window.open(data[targetElementNumber].rsvp)
	}

}

function launchLightbox() {
	//launch the modal
	var modal = document.getElementsByClassName('modalDialog')[0];
	modal.className += ' modalDialog-active';
	// add event listener for escape key to close
	document.addEventListener("keydown", function(event) {
		if (event.keyCode == 27) {
			closeLightbox();
		}
		if (event.keyCode == 37) {
			var prevButton = document.getElementsByClassName('prev')[0];
			renderLightbox(parseFloat(prevButton.id.split('-')[1]) - 1);
		}
		if (event.keyCode == 39) {
			var nextButton = document.getElementsByClassName('next')[0];
			renderLightbox(parseFloat(nextButton.id.split('-')[1]) + 1);
		}
	}, true);
}

function closeLightbox () {
	var modal = document.getElementsByClassName('modalDialog')[0];
	modal.className = 'modalDialog';
}

function renderLightbox(target) {
	// check to see if we need to loop based on numberOfElements
	if ( target === -1) {
		target = data.length - 1;
	}
	else if (target === data.length -1) {
		target = 0;
	}

	// clean the section
	var parentElem = document.getElementById('modalViewPage');
	var childElem = document.getElementById('viewPageWrapper');
	parentElem.removeChild(childElem);
	
	// create a new viewPageWrapper element
	var viewPageParent = document.getElementById('modalViewPage');
	var childSection = document.createElement('section');
	childSection.id = 'viewPageWrapper';
	viewPageParent.appendChild(childSection);

	// add elements to the lightbox 
	var viewPageElement = document.getElementById('viewPageWrapper');

	// a. Event date(day, month)
	// b. Event time
	var date = document.createElement('h3');
	date.appendChild(document.createTextNode(data[target].month + ' ' + dateOrdinal(data[target].day) + ' at ' + data[target].time));
	viewPageElement.appendChild(date);

	// c. Event Store location and Store Floor
	var store = document.createElement('h3');
	store.appendChild(document.createTextNode(data[target].storename + ': ' + data[target].floor));
	viewPageElement.appendChild(store);

	// d. Event City
	var city = document.createElement('h3');
	city.appendChild(document.createTextNode(data[target].city + ', ' + data[target].state));
	viewPageElement.appendChild(city);

	// // e. Event Description
	var description = document.createElement('p');
	description.appendChild(document.createTextNode(data[target].desc.split('TO RSVP TO THIS EVENT PLEASE VISIT')[0]));
	viewPageElement.appendChild(description);

	// // f. RSVP url if applicable.
	var button = document.createElement('button');
	button.className = 'flat-button rsvp';
	button.id = 'rsvp-' + target;
	button.appendChild(document.createTextNode('RSVP'));
	viewPageElement.appendChild(button);
	if (data[target].rsvp !=='N/A') {
		button.style.visibility = 'visible';
	}
	else {
		button.style.visibility = 'hidden';
	}

	//update the ID's on the previous and next buttons
	var prevButton = document.getElementsByClassName('prev')[0];
	prevButton.id = 'prev-' + target;
	var nextButton = document.getElementsByClassName('next')[0];
	nextButton.id = 'next-' + target;

}

function dateOrdinal (date) {
	var ordinalValue;
	date = parseFloat(date);
	if(date > 3 && date < 21) {
		ordinalValue = 'th';
    }
    else {
    	if (date.length > 1) {
    		date = parseFloat(date.toString()[1]);
    	}
    	
    	if (date === 1) {
    		ordinalValue = 'st';
    	}
    	else if (date === 2) {
    		ordinalValue = 'nd';
    	}
    	else if (date === 3) {
    		ordinalValue = 'rd';
    	}
    	else  {
    		ordinalValue = 'th';
    	}
    }
    return date + ordinalValue;
}

function cmsCallback (dataObj) {
	data = dataObj.categories.EnglishEvents2015.entries
	// used for lightbox navigation
	numberOfElements = data.length;

	// event date (day, month), 
	// event time,
	// store location. 
	//It should also have a ‘see more details’ or ‘get more info’

	for (i = 0; i < data.length; i++) {
		//filter on catagory id, assuming 1401 is only Hispanic Heritage related category_id
		if (data[i].category_id === "1401") {

			var card = document.createElement('div');
			card.className = 'card';

				var content = document.createElement('div');
				content.className = 'content';

					var date = document.createElement('h3')
						var text = data[i].day !== '' ? data[i].month + ' ' + dateOrdinal(data[i].day) + ' at ' + data[i].time : 'Default message here';
					date.appendChild(document.createTextNode(text));
					content.appendChild(date)

					var location = document.createElement('p')
						var text = data[i].street !== '' ? data[i].street + ' ' + data[i].city + ', ' + data[i].state + ' ' + data[i].zip : 'Default message here';
					location.appendChild(document.createTextNode(text));
					content.appendChild(location)

				card.appendChild(content);

					var button = document.createElement('button');
					button.className = 'flat-button';
					button.id = 'lightbox-' + i;
					button.appendChild(document.createTextNode('See More Details'));

				card.appendChild(button);
				
			var target = document.getElementsByClassName('container')[0];
			target.appendChild(card);
		};
	}
	var header = document.getElementsByTagName('header')[0];
	header.style.display ='block';
}

loadData();

document.body.addEventListener("click", function(event){
	updateListener(event.target.id || event.srcElement.id)
});

