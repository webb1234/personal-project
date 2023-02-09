// Allows me to add events and reminders to my schedule, or modify/delete existing ones.

import dataManager from 'wix-data';
import pageManager from 'wix-window';
import {memory} from 'wix-storage';

$w.onReady(function () {
	let passedData = pageManager.lightbox.getContext();
	$w("#modifierDate").text = passedData.date;
	memory.setItem("EMitemID", passedData.itemID);
	memory.setItem("EMweekID", passedData.weekID);
	initialLoad();
});

export function initialLoad() {
	let weekID = memory.getItem("EMweekID");
	let itemID = memory.getItem("EMitemID");
	dataManager.query("shiftData")
	  .eq("dataNum", Number(weekID))
	  .limit(1)
	  .find()
	  .then((STResults) => {
	  	if (STResults.items.length > 0) {
			// Found the current week
			if (new Array(STResults.items[0].shiftData[Number(itemID)].REMINDERS).length > 0) {
				$w("#reRepeaterContainer").expand();
				$w("#reRepeater").data = STResults.items[0].shiftData[itemID].REMINDERS;
				console.log(STResults.items[0].shiftData[Number(itemID)].REMINDERS);
			} else {
				console.log("No reminders");
				$w("#reRepeaterContainer").collapse();
			}
			if (new Array(STResults.items[0].shiftData[Number(itemID)].EVENTS).length > 0) {
				$w("#evRepeaterContainer").expand();
				$w("#evRepeater").data = STResults.items[0].shiftData[Number(itemID)].EVENTS;
			} else {
				console.log("No events");
				$w("#evRepeaterContainer").collapse();
			}
			loadBoth();
		} else {
			// Could not find the current week.
		}
	  })
	  .catch ((err) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when searching for the week.");
		console.log(err);
	  });
}

export function loadBoth() {
	// For every item in a repeater, on both repeaters.
	$w("#reRepeater").forEachItem(($item, itemData, index) => {
		$item("#reTitle").value = itemData.TITLE;
		$item("#reURL").value = itemData.URL;
		$item("#reStart").value = itemData.START_TIME;
		$item("#reEnd").value = itemData.END_TIME;
		if (itemData.ALLDAY === true) {
			$item("#reAllDay").checked = true;
		} else {
			$item("#reAllDay").checked = false;
		}
		$item("#reDescription").value = itemData.DESCRIPTION;
		$item("#reID").text = itemData._id;
	});
	$w("#evRepeater").forEachItem(($item, itemData, index) => {
		$item("#evTitle").value = itemData.TITLE;
		$item("#evURL").value = itemData.URL;
		$item("#evStart").value = itemData.START_TIME;
		$item("#evEnd").value = itemData.END_TIME;
		if (itemData.ALLDAY === true) {
			$item("#evAllDay").checked = true;
		} else {
			$item("#evAllDay").checked = false;
		}
		$item("#evDescription").value = itemData.DESCRIPTION;
		$item("#evID").text = itemData._id;
	});
}

export function evDelete_dblClick(event, $item) {
	dataManager.query("shiftData")
	  .eq("dataNum", Number(memory.getItem("EMweekID")))
	  .limit(1)
	  .find()
	  .then((STResults) => {
		let eventsArray = STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].EVENTS;
		eventsArray = eventsArray.filter(function(arrayInfo){
			return arrayInfo._id !== $item("#evID").text;
		});
		STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].EVENTS = eventsArray;
		dataManager.update("shiftData", STResults.items[0])
		  .then((results) => {
			console.log("Week was updated with new data, excluding removed event.");
			initialLoad();
		  })
		  .catch((err) => {
			console.log("Something went wrong when removing an event.");
			console.log(err);
			initialLoad();
		  });
	  })
	  .catch ((err) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when searching for the week.");
		console.log(err);
	  });
}

export function reDelete_dblClick(event, $item) {
	dataManager.query("shiftData")
	  .eq("dataNum", Number(memory.getItem("EMweekID")))
	  .limit(1)
	  .find()
	  .then((STResults) => {
		let remindersArray = STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].REMINDERS;
		remindersArray = remindersArray.filter(function(arrayInfo){
			return arrayInfo._id !== $item("#reID").text;
		});
		STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].REMINDERS = remindersArray;
		dataManager.update("shiftData", STResults.items[0])
		  .then((results) => {
			console.log("Week was updated with new data, excluding removed reminder.");
			initialLoad();
		  })
		  .catch((err) => {
			console.log("Something went wrong when removing a reminder.");
			console.log(err);
			initialLoad();
		  });
	  })
	  .catch ((err) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when searching for the week.");
		console.log(err);
	  });
}

export function reAdd_click(event) {
	dataManager.query("shiftData")
	  .eq("dataNum", Number(memory.getItem("EMweekID")))
	  .limit(1)
	  .find()
	  .then((STResults) => {
		let remindersArray = STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].REMINDERS;
		let toPush = {
			"DESCRIPTION": "",
			"_id": String(Math.floor((Math.random() * 999999999) + 100000000)) + remindersArray.length,
			"URL": "",
			"START_TIME": "00:00",
			"END_TIME": "23:59",
			"TITLE": "",
			"ALLDAY": true
		}
		remindersArray.push(toPush);
		STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].REMINDERS = remindersArray;
		dataManager.update("shiftData", STResults.items[0])
		  .then((results) => {
			console.log("Week was updated with new data, including new reminder.");
			initialLoad();
		  })
		  .catch((err) => {
			console.log("Something went wrong when inserting a reminder.");
			console.log(err);
			initialLoad();
		  });
	  })
	  .catch ((err) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when searching for the week.");
		console.log(err);
	  });
}

export function evAdd_click(event) {
	dataManager.query("shiftData")
	  .eq("dataNum", Number(memory.getItem("EMweekID")))
	  .limit(1)
	  .find()
	  .then((STResults) => {
		let eventsArray = STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].EVENTS;
		let toPush = {
			"DESCRIPTION": "",
			"_id": String(Math.floor((Math.random() * 999999999) + 100000000)) + eventsArray.length,
			"URL": "",
			"START_TIME": "00:00",
			"END_TIME": "23:59",
			"TITLE": "",
			"ALLDAY": true
		}
		eventsArray.push(toPush);
		STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].EVENTS = eventsArray;
		dataManager.update("shiftData", STResults.items[0])
		  .then((results) => {
			console.log("Week was updated with new data, including new event.");
			initialLoad();
		  })
		  .catch((err) => {
			console.log("Something went wrong when inserting an event.");
			console.log(err);
			initialLoad();
		  });
	  })
	  .catch ((err) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when searching for the week.");
		console.log(err);
	  });
}

export function reUpdate(event, $item) {
	dataManager.query("shiftData")
	  .eq("dataNum", Number(memory.getItem("EMweekID")))
	  .limit(1)
	  .find()
	  .then((STResults) => {
		let remindersArray = STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].REMINDERS;
		let objIndex = remindersArray.findIndex((obj => obj._id == $item("#reID").text));
		
		remindersArray[objIndex].TITLE = $item("#reTitle").value;
		remindersArray[objIndex].URL = $item("#reURL").value;
		remindersArray[objIndex].START_TIME = String($item("#reStart").value).slice(0, 5);
		remindersArray[objIndex].END_TIME = String($item("#reEnd").value).slice(0, 5);
		if ($item("#reAllDay").checked) {
			remindersArray[objIndex].ALLDAY = true;
		} else {
			remindersArray[objIndex].ALLDAY = false;
		}
		remindersArray[objIndex].DESCRIPTION = $item("#reDescription").value;
		STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].REMINDERS = remindersArray;
		dataManager.update("shiftData", STResults.items[0])
		  .then((results) => {
			console.log("Week was updated with new data, updating a reminder.");
			initialLoad();
		  })
		  .catch((err) => {
			console.log("Something went wrong when updating a reminder.");
			console.log(err);
			initialLoad();
		  });
	  })
	  .catch ((err) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when searching for the week.");
		console.log(err);
	  });
}

export function evUpdate(event, $item) {
	dataManager.query("shiftData")
	  .eq("dataNum", Number(memory.getItem("EMweekID")))
	  .limit(1)
	  .find()
	  .then((STResults) => {
		let eventsArray = STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].EVENTS;
		let objIndex = eventsArray.findIndex((obj => obj._id == $item("#evID").text));
		
		eventsArray[objIndex].TITLE = $item("#evTitle").value;
		eventsArray[objIndex].URL = $item("#evURL").value;
		eventsArray[objIndex].START_TIME = String($item("#evStart").value).slice(0, 5);
		eventsArray[objIndex].END_TIME = String($item("#evEnd").value).slice(0, 5);
		if ($item("#evAllDay").checked) {
			eventsArray[objIndex].ALLDAY = true;
		} else {
			eventsArray[objIndex].ALLDAY = false;
		}
		eventsArray[objIndex].DESCRIPTION = $item("#evDescription").value;
		STResults.items[0].shiftData[Number(memory.getItem("EMitemID"))].EVENTS = eventsArray;
		dataManager.update("shiftData", STResults.items[0])
		  .then((results) => {
			console.log("Week was updated with new data, updating an event.");
			initialLoad();
		  })
		  .catch((err) => {
			console.log("Something went wrong when updating an event.");
			console.log(err);
			initialLoad();
		  });
	  })
	  .catch ((err) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when searching for the week.");
		console.log(err);
	  });
}
