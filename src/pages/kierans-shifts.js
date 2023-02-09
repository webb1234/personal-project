// This is a page shared with friends and family so they can see when I'm working, doing something (events), or am available. Requires an authCode to access.

import dataManager from 'wix-data';
import {memory} from 'wix-storage';
import pageManager from 'wix-location';
import wixAnimations from 'wix-animations';

let refreshTimeline = wixAnimations.timeline();
refreshTimeline.add($w("#refreshST"), 
[
	{
	"rotate": 360,
	"duration": 750,
	}
]);

$w.onReady(function () {
	setTimeout(function() {
		$w("#mainSection").expand();
		$w("#loadSection").collapse();
		console.log(pageManager.baseUrl);
		if (pageManager.query.authCode === "hidden" && pageManager.query.focus === "shouldFocus") {
			// Code accepted, there is a specific week to focus on.
			INTloadST({"focus": "shouldFocus", "weekDataNum": pageManager.query.dataNum});
			memory.setItem("skipAmount", 0);
			if (pageManager.baseUrl === "hiddenOldURL") {
				pageManager.to("hiddenNewURL with AuthCode");
			}
		} else if (pageManager.query.authCode === "hidden") {
			// Code accepted, there is nothing to focus on.
			INTloadST({"focus": "shouldNot"});
			memory.setItem("skipAmount", 0);
			if (pageManager.baseUrl === "hiddenOldURL") {
				pageManager.to("hiddenNewURL with AuthCode");
			}
		} else {
			// Code not accepted.
			$w("#STLayouter").hide();
			$w("#STTitle").text = "Invalid magic link. Ask Kieran.";
			if (pageManager.baseUrl === "hiddenOldURL") {
				pageManager.to("hiddenNewURL");
			}
		}
	}, 1750);
	setTimeout(function() {
		loadST(Number(memory.getItem("weekID")));
	}, 2750);
});
export function getDate(passedDate) {
	let date = new Date(passedDate);
	let month = "ERROR";
	let datesuffix = "th";
	let day = "ERROR";
	switch(date.getMonth()) {
	case 0:
		month = "Jan";
		break;
	case 1:
		month = "Feb";
		break;
	case 2:
		month = "Mar";
		break;
	case 3:
		month = "Apr";
		break;
	case 4:
		month = "May";
		break;
	case 5:
		month = "Jun";
		break;
	case 6:
		month = "Jul";
		break;
	case 7:
		month = "Aug";
		break;
	case 8:
		month = "Sep";
		break;
	case 9:
		month = "Oct";
		break;
	case 10:
		month = "Nov";
		break;
	case 11:
		month = "Dec";
		break;
	default:
		month = "ERROR";
	}
	switch (date.getDate()) {
	case 1:
		datesuffix = "st";
		break;
	case 2:
		datesuffix = "nd";
		break;
	case 3:
		datesuffix = "rd";
		break;
	case 21:
		datesuffix = "st";
		break;
	case 22:
		datesuffix = "nd";
		break;
	case 23:
		datesuffix = "rd";
		break;
	case 31:
		datesuffix = "st";
		break;
	default:
		datesuffix = "th";
	}
	switch (date.getDay()) {
	case 0:
		day = "Sunday";
		break;
	case 1:
		day = "Monday";
		break;
	case 2:
		day = "Tuesday";
		break;
	case 3:
		day = "Wednesday";
		break;
	case 4:
		day = "Thursday";
		break;
	case 5:
		day = "Friday";
		break;
	case 6:
		day = "Saturday";
		break;
	default:
		day = "ERROR";
	}
	let dateString = day + ", " + date.getDate() + datesuffix + " " +  month + " " + date.getFullYear();
	return dateString;
}

export function INTloadST(passedData) {
	// This section of code finds the current week, and passes it to loadST().
	const today = new Date();
	let returnValue = 0;
	dataManager.query("shiftData")
	  .ge("endDate", today)
	  .le("beginDate", today)
	  .ascending("dataNum")
	  .limit(1)
	  .find()
	  .then((STResults) => {
	  	if (STResults.items.length > 0) {
			// Found the current week
			console.log("Current week is dataNum #" + STResults.items[0].dataNum);
			returnValue = STResults.items[0].dataNum;
		} else {
			// Could not find the current week.
			console.log("Current week could not be found, default to 0.");
			returnValue = 0;
		}
		memory.setItem("weekSkipLimit", Number(STResults.items[0].dataNum + 6));
		refreshTimeline.play();
		if (passedData.focus === "shouldFocus") {
			memory.setItem("weekID", passedData.weekDataNum);
			loadST(Number(passedData.weekDataNum));
		} else {
			memory.setItem("weekID", returnValue);
			loadST(returnValue);
		}
		memory.setItem("lastWeek", (Number(returnValue) - 1));
		memory.setItem("currentWeek", returnValue);
		memory.setItem("nextWeek", (Number(returnValue) + 1));
	  })
	  .catch ((INTSTErrorMsg) => {
		// Something went wrong with the query
		$w("#STWeekDate").text = "Can't fetch.";
		console.log("Whoops, something went wrong when INT loading Shift Tracker.");
		console.log(INTSTErrorMsg);
	  });
}

export function loadST(weekID) {
	// This section of code loads the Shift Tracker
	$w("#STevent1").text = "Checking events...";
	$w("#STevent2").text = "Checking events...";
	$w("#STevent3").text = "Checking events...";
	$w("#STevent4").text = "Checking events...";
	$w("#STeventBox1").collapse();
	$w("#STeventBox2").collapse();
	$w("#STeventBox3").collapse();
	$w("#STeventBox4").collapse();
	refreshTimeline.replay();
	let weekSkipLimit = memory.getItem("weekSkipLimit");
	if (weekID === 0) {
		$w("#STPrevious").hide();
		$w("#STNext").show();
	} else if (weekID === Number(weekSkipLimit)) {
		$w("#STPrevious").show();
		$w("#STNext").hide();
	} else {
		$w("#STPrevious").show();
		$w("#STNext").show();
	}
	dataManager.query("shiftData")
	  .eq("dataNum", weekID)
	  .ascending("dataNum")
	  .limit(1)
	  .find()
	  .then((STResults) => {
	  	if (STResults.items.length > 0) {
			// Items have been found!
			let STData = STResults.items[0];
			  let tempDate = new Date(STData.beginDate);
			  let tempMonth = (tempDate.getMonth() + 1).toString().padStart(2, "0");
			  let tempDay = tempDate.getDate().toString().padStart(2, "0");
			  let tempYear = tempDate.getFullYear();
			  let STDate = tempDay + "/" + tempMonth + "/" + tempYear;
			  if (Number(memory.getItem("lastWeek")) === weekID) {
			  	$w("#STWeekDate").text = "Last Week";
			  } else if (Number(memory.getItem("currentWeek")) === weekID) {
				$w("#STWeekDate").text = "Current Week";
			  } else if (Number(memory.getItem("nextWeek")) === weekID) {
				$w("#STWeekDate").text = "Next Week";
			  } else {
				$w("#STWeekDate").text = STDate;
			  }
			  $w("#STRepeater").data = STData.shiftData;
			  console.log("loadST: Success");
			  let netPunchedTotal = 0;
			  let actualWorkingTotal = 0;
			  let rotaWorkingTotal = 0;
			  let shiftsPublished = false;
				$w("#STRepeater").forEachItem( ($item, itemData, index) => {
					let date = new Date(itemData.DATE);
					let month = "ERROR";
					let datesuffix = "th";
					switch(date.getMonth()) {
					case 0:
						month = "Jan";
						break;
					case 1:
						month = "Feb";
						break;
					case 2:
						month = "Mar";
						break;
					case 3:
						month = "Apr";
						break;
					case 4:
						month = "May";
						break;
					case 5:
						month = "Jun";
						break;
					case 6:
						month = "Jul";
						break;
					case 7:
						month = "Aug";
						break;
					case 8:
						month = "Sep";
						break;
					case 9:
						month = "Oct";
						break;
					case 10:
						month = "Nov";
						break;
					case 11:
						month = "Dec";
						break;
					default:
						month = "ERROR";
					}
					switch (date.getDate()) {
					case 1:
						datesuffix = "st";
						break;
					case 2:
						datesuffix = "nd";
						break;
					case 3:
						datesuffix = "rd";
						break;
					case 21:
						datesuffix = "st";
						break;
					case 22:
						datesuffix = "nd";
						break;
					case 23:
						datesuffix = "rd";
						break;
					case 31:
						datesuffix = "st";
						break;
					default:
						datesuffix = "th";
					}
					$item("#STItemDayTitle").text = itemData.DAY + ", " + date.getDate() + datesuffix + " " +  month + " " + date.getFullYear();
					if (itemData.ROTA_working_query === true) {
						$item("#STItemScheduledHours").text = "[" + itemData.ROTA_time_scheduled.toFixed(2).toString() + " hours] " + itemData.ROTA_working_time;
						rotaWorkingTotal = Number(rotaWorkingTotal + itemData.ROTA_time_scheduled);
						shiftsPublished = true;
					} else if (STData.version === "v2" && itemData.HOLIDAY === true) {
						$item("#STItemScheduledHours").text = "On Holiday";
						shiftsPublished = true;
					} else {
						$item("#STItemScheduledHours").text = "Day Off";
					}
					if (itemData.ACTUAL_working_query === true) {
						$item("#STItemCompletedHours").text = "[" + itemData.ACTUAL_time_scheduled.toFixed(2).toString() + " hours] " + itemData.ACTUAL_working_time;
						actualWorkingTotal = Number(actualWorkingTotal + itemData.ACTUAL_time_scheduled);
						$item("#STItemCompletedTitle").text = "Completed:";
					} else if (STData.version === "v2" && itemData.SHIFT_status === "NS") { // v2 & Not Scheduled
						$item("#STItemCompletedHours").text = "-";
						$item("#STItemCompletedTitle").text = "Shift Status:";
					} else if (STData.version === "v2" && itemData.SHIFT_status === "NC") { // v2 & Not Started/Completed
						$item("#STItemCompletedHours").text = "Not Started";
						$item("#STItemCompletedTitle").text = "Shift Status:";
					} else if (STData.version === "v2" && itemData.SHIFT_status === "IP") { // v2 & In Progress
						$item("#STItemCompletedHours").text = "In Progress";
						$item("#STItemCompletedTitle").text = "Shift Status:";
					} else if (STData.version === "v2" && itemData.SHIFT_status === "C") { // v2 & Complete
						$item("#STItemCompletedHours").text = "Completed";
						$item("#STItemCompletedTitle").text = "Shift Status:";
					} else {
						$item("#STItemCompletedHours").text = "-";
						$item("#STItemCompletedTitle").text = "Shift Status:";
					}
					if (itemData.MYJDW_net_punched !== 0) {
						$item("#STItemPunchedHours").text = itemData.MYJDW_net_punched.toFixed(2).toString() + " hours";
						netPunchedTotal = Number(netPunchedTotal + itemData.MYJDW_net_punched);
					} else {
						$item("#STItemPunchedHours").text = "-";
					}
					
					// Code to find events and show them.
					$item("#STeventBox1").collapse();
					$item("#STeventBox2").collapse();
					$item("#STeventBox3").collapse();
					$item("#STeventBox4").collapse();
					let dayEvents = itemData.EVENTS;
					if (dayEvents.length >= 1) {
						$item("#STeventBox1").expand();
						if (dayEvents[0].ALLDAY !== true) { 
							$item("#STevent1").text = "[" + dayEvents[0].START_TIME + " - " + dayEvents[0].END_TIME + "] " + dayEvents[0].TITLE;
						} else {
							$item("#STevent1").text = "[All Day] " + dayEvents[0].TITLE;
						}
					}
					if (dayEvents.length >= 2) {
						$item("#STeventBox2").expand();
						if (dayEvents[1].ALLDAY !== true) { 
							$item("#STevent2").text = "[" + dayEvents[1].START_TIME + " - " + dayEvents[1].END_TIME + "] " + dayEvents[1].TITLE;
						} else {
							$item("#STevent2").text = "[All Day] " + dayEvents[1].TITLE;
						}
					}
					if (dayEvents.length >= 3) {
						$item("#STeventBox3").expand();
						if (dayEvents[2].ALLDAY !== true) { 
							$item("#STevent3").text = "[" + dayEvents[2].START_TIME + " - " + dayEvents[2].END_TIME + "] " + dayEvents[2].TITLE;
						} else {
							$item("#STevent3").text = "[All Day] " + dayEvents[2].TITLE;
						}
					}
					if (dayEvents.length >= 4) {
						let count = Number(dayEvents.length - 3);
						$item("#STeventBox4").expand();
						$item("#STevent4").text = "and " + count + " more event(s).";
					}
				});
				if (shiftsPublished === false) {
					$w("#STItemScheduledHours").text = "No Data";
				}
				$w("#STJDWScheduled").text = rotaWorkingTotal.toFixed(2).toString() + " hours";
				$w("#STJDWCompleted").text = actualWorkingTotal.toFixed(2).toString() + " hours";
				$w("#STJDWNetPunched").text = netPunchedTotal.toFixed(2).toString() + " hours";
		} else {
			$w("#STWeekDate").text = "Can't fetch.";
			console.log("Whoops, there's no data in shiftData.");
		}
	  })
	  .catch ((STErrorMsg) => {
		// Something went wrong with the query
		$w("#STWeekDate").text = "Can't fetch.";
		console.log("Whoops, something went wrong when loading Shift Tracker.");
		console.log(STErrorMsg);
	  });
}

export function STPrevious_click(event) {
let currentlyDisplayed = Number(memory.getItem("weekID"));
	let toLoadNext = Number(currentlyDisplayed - 1);
	memory.setItem("weekID", toLoadNext);
	loadST(toLoadNext);
	setTimeout(function() {
		loadST(toLoadNext);
	}, 750);
}

export function STNext_click(event) {
	let currentlyDisplayed = Number(memory.getItem("weekID"));
	let toLoadNext = Number(currentlyDisplayed + 1);
	memory.setItem("weekID", toLoadNext);
	loadST(toLoadNext);
	setTimeout(function() {
		loadST(toLoadNext);
	}, 750);
}

export function refreshST_click(event) {
	loadST(Number(memory.getItem("weekID")));
}
