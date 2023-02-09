import dataManager from 'wix-data';
import pageManager from 'wix-window';
import wixLocation from 'wix-location';
import wixAnimations from 'wix-animations';
import {memory} from 'wix-storage';
import {local} from 'wix-storage';
import {updateBill} from 'backend/BillsBackend';
import {ldbws} from 'backend/trainTracker';

let refreshTimeline = wixAnimations.timeline();
refreshTimeline.add($w("#refreshST"), {"rotate": 360, "duration": 750});
let resetAll = wixAnimations.timeline();
resetAll.add($w("#ttT1B2ScrollText"), { x: 0, y: 0, duration: 1, opacity: 0, easing: "easeLinear"});
resetAll.add($w("#ttT2B2ScrollText"), { x: 0, y: 0, duration: 1, opacity: 0, easing: "easeLinear"});
resetAll.add($w("#ttT3B2ScrollText"), { x: 0, y: 0, duration: 1, opacity: 0, easing: "easeLinear"});
resetAll.add($w("#ttT4B2ScrollText"), { x: 0, y: 0, duration: 1, opacity: 0, easing: "easeLinear"});
resetAll.add($w("#ttT5B2ScrollText"), { x: 0, y: 0, duration: 1, opacity: 0, easing: "easeLinear"});
resetAll.play()

$w.onReady(function () {
	INTloadST(); // Begin loading shift tracker
	loadBC(); // Begin loading bin collections
	setTimeout(function() {
		loadFC(); // Begin loading finances
	}, 1000);
	loadBF(); // Begin loading bills
	memory.setItem("skipAmount", 0);
	currentTime(); // Starts the Time Clock Updater.
	trainTracker();
});

export function loadBC() {
	// This section of code loads the bin collections
	dataManager.query("BC")
	  .eq("dataId", "default")
	  .limit(1)
	  .find()
	  .then((BCResults) => {
	  	if (BCResults.items.length > 0) {
			// Items have been found!
			let BCData = BCResults.items[0];
			const tempDate = new Date();
			switch(Number(tempDate.getDay())) {
				case 0:
					// Sunday
					$w("#BCDate").text = "Put out tomorrow";
					break;
				case 1:
					// Monday
					$w("#BCDate").text = "Put out today";
					break;
				case 2:
					// Tuesday
					$w("#BCDate").text = "Collection today";
					break;
				default:
					// Any other day
					$w("#BCDate").text = "Collection on Tuesday";
			}
			if (BCData.pink === 0) {
				$w("#BCPink").src = "https://static.wixstatic.com/media/4b711c_4de8894d13844f9fb6e716505975eda8~mv2.png";
				$w("#BCPinkText").show();
			} else {
				$w("#BCPink").src = "https://static.wixstatic.com/media/4b711c_e64dc1ba98e6424fa1283daa04ef87de~mv2.png";
				$w("#BCPinkText").hide();
			}
			if (BCData.brown === 0) {
				$w("#BCBrown").src = "https://static.wixstatic.com/media/4b711c_1d9736bc86464e7182248ddd8b79d158~mv2.png";
				$w("#BCBrownText").show();
			} else {
				$w("#BCBrown").src = "https://static.wixstatic.com/media/4b711c_81379c6552214608b1ee785032221f01~mv2.png";
				$w("#BCBrownText").hide();
			}
			if (BCData.blue === 0) {
				$w("#BCBlue").src = "https://static.wixstatic.com/media/4b711c_1c5fb324fa7f498cb723a869243e28cb~mv2.png";
				$w("#BCBlueText").show();
			} else {
				$w("#BCBlue").src = "https://static.wixstatic.com/media/4b711c_83a8adde1cd04208aebf1e9fb31d4a7e~mv2.png";
				$w("#BCBlueText").hide();
			}
			if (BCData.black === 0) {
				$w("#BCBlack").src = "https://static.wixstatic.com/media/4b711c_e604bf5f3d0b4229bd7583afcfc1a710~mv2.png";
				$w("#BCBlackText").show();
			} else {
				$w("#BCBlack").src = "https://static.wixstatic.com/media/4b711c_d75f297a7b864164b5b82a95fc85b27a~mv2.png";
				$w("#BCBlackText").hide();
			}
		} else {
			$w("#BCDate").text = "Can't fetch.";
			console.log("Whoops, there's no data in Bin Collections.");
		}
	  })
	  .catch ((BCErrorMsg) => {
		// Something went wrong with the query
		$w("#BCDate").text = "Can't fetch.";
		console.log("Whoops, something went wrong when loading Bin Collections.");
		console.log(BCErrorMsg);
	  });
}

export function loadBF() {
	// This section of code loads the Bills section
	dataManager.query("Bills")
	  .ascending("date")
	  .limit(100)
	  .find()
	  .then((BillsResults) => {
	  	if (BillsResults.items.length > 0) {
			// Items have been found!
			let BillsData = BillsResults.items;
			$w("#billsRepeater").data = BillsData;
			loadBFRepeater();
		} else {
			console.log("No items found in Bills.");
			$w("#billsRepeater").collapse();
		}
	  })
	  .catch ((BillsErrorMsg) => {
		console.log(BillsErrorMsg);
	  });
}

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

export function loadBFRepeater() {
  let billsAmount = 0;
  let subscriptionsAmount = 0;
  let manualAmount = 0;
  let weeklyMaxAmount = 0;
  let monthlyTotalAmount = 0;
  $w("#billsRepeater").forEachItem(($item, itemData, index) => {
	let TempDate = new Date(itemData.date);
	let TempMonth = (TempDate.getMonth() + 1).toString().padStart(2, "0");
	let TempDay = TempDate.getDate().toString().padStart(2, "0");
	let TempYear = TempDate.getFullYear();
	let BillsDate = TempDay + "/" + TempMonth + "/" + TempYear;
	let date = new Date(itemData.lastPayDate);
	let week4 = new Date(date.setDate(date.getDate()));
	let week3 = new Date(date.setDate(date.getDate() - 7));
	let week2 = new Date(date.setDate(date.getDate() - 7));
	let week1 = new Date(date.setDate(date.getDate() - 7));
	let defaultWeeklyAmount = Number(Number(itemData.amount / itemData.weekAmount).toFixed(2));
	let finalWeekAmount = Number(itemData.amount - (defaultWeeklyAmount * (itemData.weekAmount - 1)));
	let percentComplete = Number((itemData.weeksComplete / itemData.weekAmount) * 100);
	let amountInPotForBill = 0;
	if (itemData.weeksComplete === itemData.weekAmount) {
		amountInPotForBill = Number(itemData.amount);
		$item("#brdCycleWeeks").enable();
		$item("#brdAddWeek").disable();
	} else {
		amountInPotForBill = Number(defaultWeeklyAmount * itemData.weeksComplete)
		$item("#brdCycleWeeks").disable();
		$item("#brdAddWeek").enable();
	}
	if (itemData.weeksComplete === 0) {
		$item("#brdSubtractWeek").disable();
	} else {
		$item("#brdSubtractWeek").enable();
	}

	  // Bills Repeater Main:
	  $item("#brmName").text = itemData.name;
	  $item("#brmImage").src = itemData.image;
	  $item("#brmDetails").text = "£" + itemData.amount.toFixed(2).toString() + " goes out on " + BillsDate + ".";
	  $item("#brmPercentage").text = percentComplete.toFixed(1) + "%";
	  $item("#brmAmount").text = "£" + amountInPotForBill.toFixed(2).toString() + " of £" + itemData.amount.toFixed(2).toString();
	  $item("#brmProgressBar").value = percentComplete;
	  $item("#brmProgressBar").targetValue = 100;

	  // Bills Repeater Details:
	  $item("#brdID").text = itemData._id;
	  $item("#brdPot").text = itemData.pot;
	  $item("#brdWeeks").text = "Every " + itemData.weekAmount + " weeks";
	  $item("#brdDate").text = BillsDate;
	  $item("#brdAmount").text = itemData.amount.toFixed(2).toString();
	  switch(itemData.pot) {
	  case "Bills":
		$item("#brdImage").src = "https://static.wixstatic.com/media/4b711c_392c30572b3041108a6da291d1af13b6~mv2.png";
		break;
	  case "On Hold":
		$item("#brdImage").src = "https://static.wixstatic.com/media/4b711c_bb24bff2d531446bb7f10f4f2377f302~mv2.png";
		break;
	  case "Subscriptions":
		$item("#brdImage").src = "https://static.wixstatic.com/media/4b711c_e3258d5335464d178dc33b4bccddf270~mv2.png";
		break;
	  case "Manual Subscriptions":
		$item("#brdImage").src = "https://static.wixstatic.com/media/4b711c_a2cef85125184eb6800feccd527e6407~mv2.png";
		break;
	  default:
		$item("#brdImage").src = "https://static.wixstatic.com/media/4b711c_4e62766cd80245f1969068a4279fd79d~mv2.jpg";
	  }
	  let toCheckMark = Number(itemData.weekAmount - itemData.weeksComplete);
	  switch(toCheckMark) {
	  case 0:
		$item("#brdW1Check").show();
		$item("#brdW2Check").show();
		$item("#brdW3Check").show();
		$item("#brdW4Check").show();
		break;
	  case 1:
		$item("#brdW1Check").show();
		$item("#brdW2Check").show();
		$item("#brdW3Check").show();
		$item("#brdW4Check").hide();
		break;
	  case 2:
		$item("#brdW1Check").show();
		$item("#brdW2Check").show();
		$item("#brdW3Check").hide();
		$item("#brdW4Check").hide();
		break;
	  case 3:
		$item("#brdW1Check").show();
		$item("#brdW2Check").hide();
		$item("#brdW3Check").hide();
		$item("#brdW4Check").hide();
		break;
	  default:
		$item("#brdW1Check").hide();
		$item("#brdW2Check").hide();
		$item("#brdW3Check").hide();
		$item("#brdW4Check").hide();
	  }
	  $item("#brdW1Text").text = getDate(week1);
	  $item("#brdW2Text").text = getDate(week2);
	  $item("#brdW3Text").text = getDate(week3);
	  $item("#brdW4Text").text = getDate(week4);
	  $item("#brdW1Amount").text = "£" + defaultWeeklyAmount.toFixed(2).toString();
	  $item("#brdW2Amount").text = "£" + defaultWeeklyAmount.toFixed(2).toString();
	  $item("#brdW3Amount").text = "£" + defaultWeeklyAmount.toFixed(2).toString();
	  $item("#brdW4Amount").text = "£" + finalWeekAmount.toFixed(2).toString();

	  weeklyMaxAmount = weeklyMaxAmount + defaultWeeklyAmount;
	  monthlyTotalAmount = monthlyTotalAmount + (4 * defaultWeeklyAmount);
	  switch(itemData.pot) {
	  case "Bills":
		billsAmount = Number(billsAmount + amountInPotForBill);
		break;
	  case "Subscriptions":
		subscriptionsAmount = Number(subscriptionsAmount + amountInPotForBill);
		break;
	  case "Manual Subscriptions":
		manualAmount = Number(manualAmount + amountInPotForBill);
		break;
	  default:
		console.log("Could not total amounts correctly. Item: " + itemData.name + " does not have an indexed pot name.")
	  }
  });
	$w("#billsPotAmountB").text = "£" + billsAmount.toFixed(2).toString();
	$w("#billsPotAmountS").text = "£" + subscriptionsAmount.toFixed(2).toString();
	$w("#billsPotAmountM").text = "£" + manualAmount.toFixed(2).toString();
	console.log("Max Weekly: £" + weeklyMaxAmount.toFixed(2) + ". Approx Monthly Amount: £" + monthlyTotalAmount.toFixed(2) + ".");
}

export function brmExpandButton_click(event, $item) {
	if ($w("#billsSwitch").checked === true) {
	  $w("#billsRepeater").forEachItem( ($item, itemData, index) => {
		$item("#billsRepeaterDetailBox").collapse();
		$item("#brmCollapseButton").hide();
		$item("#brmExpandButton").show();
	  });
	}
	$item("#brmCollapseButton").show();
	$item("#brmExpandButton").hide();
	$item("#billsRepeaterDetailBox").expand();
}

export function brmCollapseButton_click(event, $item) {
	if ($w("#billsSwitch").checked === true) {
	  $w("#billsRepeater").forEachItem( ($item, itemData, index) => {
		$item("#billsRepeaterDetailBox").collapse();
		$item("#brmCollapseButton").hide();
		$item("#brmExpandButton").show();
	  });
	}
	$item("#brmCollapseButton").hide();
	$item("#brmExpandButton").show();
	$item("#billsRepeaterDetailBox").collapse();
}

export function brdCycleWeeks_click(event, $item) {
	updateBill($item("#brdID").text, "cycle")
	  .then((returned) => {
	  	console.log("Action complete, reloading...");
		console.log(returned);
		loadBF();
		
		let Bamount = 0;
		let Samount = 0;
		let MSamount = 0;
		switch($item("#brdPot").text) {
		  case "Bills":
		    Bamount = Number($item("#brdAmount").text);
		    break;
		  case "Subscriptions":
		    Samount = Number($item("#brdAmount").text);
		    break;
		  case "Manual Subscriptions":
		    MSamount = Number($item("#brdAmount").text);
		    break;
 		  default:
 		    console.log("Error: Could not update finances when cycling weeks.");
		}
		let financeData = local.getItem("financeData");
		let financeObject = JSON.parse(financeData);
		let dataToSave = {
			"Bills": Number(Number(financeObject.Bills) - Bamount).toFixed(2),
			"Subscriptions": Number(Number(financeObject.Subscriptions) - Samount).toFixed(2),
			"ManualSubscriptions": Number(Number(financeObject.ManualSubscriptions) - MSamount).toFixed(2)
		}
		local.setItem("financeData", JSON.stringify(dataToSave));
		loadFC();
	  })
	  .catch ((BRDErrorMsg) => {
		console.log(BRDErrorMsg);
	  });
}

export function brdAddWeek_click(event, $item) {
	updateBill($item("#brdID").text, "add")
	  .then((returned) => {
	  	console.log("Action complete, reloading...");
		console.log(returned);
		loadBF();
	  })
	  .catch ((BRDErrorMsg) => {
		console.log(BRDErrorMsg);
	  });
}

export function brdSubtractWeek_click(event, $item) {
	updateBill($item("#brdID").text, "subtract")
	  .then((returned) => {
	  	console.log("Action complete, reloading...");
		console.log(returned);
		loadBF();
	  })
	  .catch ((BRDErrorMsg) => {
		console.log(BRDErrorMsg);
	  });
}

export function brdViewAll_click(event, $item) {
	pageManager.openLightbox("Bills AP", {
      "_id": $item('#brdID').text
	});
}

export function loadFC() {
	// This section of code loads the Finances section
	
	if (wixLocation.query.updateFinances === "true") {
		// Automatic Sort Requested an Update
		let financeData = local.getItem("financeData");
		let financeObject = JSON.parse(financeData);
		if (wixLocation.query.changeBills !== null && wixLocation.query.changeBills !== undefined) {
			financeObject.Bills = financeObject.Bills + Number(wixLocation.query.changeBills);
		}
		if (wixLocation.query.changeSubscriptions !== null && wixLocation.query.changeBills !== undefined) {
			financeObject.Subscriptions = financeObject.Subscriptions + Number(wixLocation.query.changeSubscriptions);
		}
		if (wixLocation.query.changeManualSubscriptions !== null && wixLocation.query.changeBills !== undefined) {
			financeObject.ManualSubscriptions = financeObject.ManualSubscriptions + Number(wixLocation.query.changeManualSubscriptions);
		}
		if (wixLocation.query.changeDebt !== null && wixLocation.query.changeBills !== undefined) {
			financeObject.Debt = financeObject.Debt + Number(wixLocation.query.changeDebt);
		}
		if (wixLocation.query.changeSavings !== null && wixLocation.query.changeBills !== undefined) {
			financeObject.Savings = financeObject.Savings + Number(wixLocation.query.changeSavings);
		}
		local.setItem("financeData", JSON.stringify(financeObject));
		wixLocation.queryParams.remove(["updateFinances", "changeBills", "changeSubscriptions", "changeManualSubscriptions", "changeDebt", "changeSavings"]);
		console.log("Updated finances with Automatic Sort information.");
	}
	
	let financeData = local.getItem("financeData");
	if (financeData !== null && financeData !== undefined) {
		// Data found
		let financeObject = JSON.parse(financeData);
		console.log(financeObject);
		$w("#financesTitle").text = "Finances";
		$w("#financesLoadBox").collapse();
		$w("#financesUpdateBox").collapse();
		$w("#financesDisplayBox").expand();

		// Set the header depending on day of week
		switch (new Date().getDay()) {
		case 0: // Sunday
			$w("#financesDefaultDayBox").expand();
			$w("#financesThursdayBox").collapse();
			$w("#financesNextPay").text = "4 days until payday!";
			break;
		case 1: // Monday
			$w("#financesDefaultDayBox").expand();
			$w("#financesThursdayBox").collapse();
			$w("#financesNextPay").text = "3 days until payday!";
			break;
		case 2: // Tuesday
			$w("#financesDefaultDayBox").expand();
			$w("#financesThursdayBox").collapse();
			$w("#financesNextPay").text = "2 days until payday!";
			break;
		case 3: // Wednesday
			$w("#financesDefaultDayBox").expand();
			$w("#financesThursdayBox").collapse();
			$w("#financesNextPay").text = "1 day until payday!";
			break;
		case 4: // Thursday - Payday
			$w("#financesDefaultDayBox").collapse();
			$w("#financesThursdayBox").expand();
			$w("#financesNextPay").text = "Something went wrong!";
			break;
		case 5: // Friday
			$w("#financesDefaultDayBox").expand();
			$w("#financesThursdayBox").collapse();
			$w("#financesNextPay").text = "6 days until payday!";
			break;
		case 6: // Saturday
			$w("#financesDefaultDayBox").expand();
			$w("#financesThursdayBox").collapse();
			$w("#financesNextPay").text = "5 days until payday!";
			break;
		default: // Something went wrong
			$w("#financesDefaultDayBox").collapse();
			$w("#financesThursdayBox").collapse();
			console.log("Something went wrong when trying to figure out what day it was? [Payday countdown]");
		}

		// Update the "Display" module values
		$w("#financesDisplayBills").text = "£" + (financeObject.Bills).toString();
		$w("#financesDisplaySubscriptions").text = "£" + (financeObject.Subscriptions).toString();
		$w("#financesDisplayManualSubscriptions").text = "£" + (financeObject.ManualSubscriptions).toString();
		$w("#financesDisplayCash").text = "£" + (financeObject.Cash).toString();
		$w("#financesDisplaySavings").text = "£" + (financeObject.Savings).toString();
		if (Number(financeObject.Debt) <= 0) {
			// Less than or equal to zero
			$w("#financesDisplayDebt").html = '<h5><span>£' + (financeObject.Debt).toString() + '</span></h5>';
		} else if (Number(financeObject.Debt) > 0 && Number(financeObject.Debt) <= 100) {
			// Less than or equal to zero
			$w("#financesDisplayDebt").html = '<h5 style="color:DarkGoldenRod;"><span>£' + (financeObject.Debt).toString() + '</span></h5>';
		} else if (Number(financeObject.Debt) > 100) {
			// Less than or equal to zero
			$w("#financesDisplayDebt").html = '<h5 style="color:DarkRed;"><span>£' + (financeObject.Debt).toString() + '</span></h5>';
		} else {
			// NaN or invalid answer
			$w("#financesDisplayDebt").html = '<h5><span>£' + (financeObject.Debt).toString() + '</span></h5>';
		}

		// Update the "Update" module in case it's used later
		$w("#financesUpdateBills").value = (financeObject.Bills).toString();
		$w("#financesUpdateSubscriptions").value = (financeObject.Subscriptions).toString();
		$w("#financesUpdateManualSubscriptions").value = (financeObject.ManualSubscriptions).toString();
		$w("#financesUpdateDebt").value = (financeObject.Debt).toString();
		$w("#financesUpdateCash").value = (financeObject.Cash).toString();
		$w("#financesUpdateSavings").value = (financeObject.Savings).toString();
	} else {
		// No data found.
		$w("#financesTitle").text = "Please enter some details";
		$w("#financesUpdateButton").label = "Create";
		$w("#financesCancelButton").disable();
		$w("#financesLoadBox").collapse();
		$w("#financesUpdateBox").expand();
		$w("#financesDisplayBox").collapse();
	}
}

export function financesUpdateButton_click(event) {
	$w("#financesUpdateButton").disable();
	let dataToSave = {
		"Bills": Number($w("#financesUpdateBills").value).toFixed(2),
		"Subscriptions": Number($w("#financesUpdateSubscriptions").value).toFixed(2),
		"ManualSubscriptions": Number($w("#financesUpdateManualSubscriptions").value).toFixed(2),
		"Debt": Number($w("#financesUpdateDebt").value).toFixed(2),
		"Cash": Number($w("#financesUpdateCash").value).toFixed(2),
		"Savings": Number($w("#financesUpdateSavings").value).toFixed(2)
	}
	local.setItem("financeData", JSON.stringify(dataToSave));
	loadFC();
}

export function financesCancelButton_click(event) {
	$w("#financesTitle").text = "Finances";
	$w("#financesLoadBox").collapse();
	$w("#financesUpdateBox").collapse();
	$w("#financesDisplayBox").expand();
}

export function financesUpdateData_click(event) {
	$w("#financesTitle").text = "Update financial details";
	$w("#financesUpdateButton").label = "Update";
	$w("#financesUpdateButton").enable();
	$w("#financesCancelButton").enable();
	$w("#financesLoadBox").collapse();
	$w("#financesUpdateBox").expand();
	$w("#financesDisplayBox").collapse();
}

export function managePotsButton_click(event) {
	let financeData = local.getItem("financeData");
	let financeObject = JSON.parse(financeData);
	let Bills = (financeObject.Bills).toString();
	let Subscriptions = (financeObject.Subscriptions).toString();
	let ManualSubscriptions = (financeObject.ManualSubscriptions).toString();
	let billsPotAmount = $w("#billsPotAmountB").text.substring(1);
	let subscriptionsPotAmount = $w("#billsPotAmountS").text.substring(1);
	let manualsubscriptionsPotAmount = $w("#billsPotAmountM").text.substring(1);
	let generatedURL = "/pot-manager?load=sort&locationto=home&bills=" + billsPotAmount + "&subscriptions=" + subscriptionsPotAmount + "&manualsubscriptions=" + manualsubscriptionsPotAmount + "&prefillbills=" + Bills + "&prefillsubscriptions=" + Subscriptions + "&prefillmanualsubscriptions=" + ManualSubscriptions + "&authCode=hidden";
	wixLocation.to(generatedURL);
}

export function INTloadST() {
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
		memory.setItem("weekID", returnValue);
		memory.setItem("weekSkipLimit", Number(STResults.items[0].dataNum + 6));
		memory.setItem("lastWeek", (Number(returnValue) - 1));
		memory.setItem("currentWeek", returnValue);
		memory.setItem("nextWeek", (Number(returnValue) + 1));
		refreshTimeline.play();
		loadST(returnValue);
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
			  loadRemindersAndEvents(STData);
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
			  let actualWorkingEO = 0;
			  let rotaWorkingEO = 0;
			  let dropdownOptionArray = [];
			  let shiftsPublished = false;
				$w("#STRepeater").forEachItem(($item, itemData, index) => {
					$item("#itemID").text = itemData._id;
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
					let dayLabel = itemData.DAY + ", " + date.getDate() + datesuffix + " " +  month + " " + date.getFullYear();
					$item("#STItemDayTitle").text = dayLabel;
					dropdownOptionArray.push({"label": dayLabel, "value": String(itemData._id)});
					if (itemData.ROTA_working_query === true) {
						$item("#STItemScheduledHours").text = "[" + itemData.ROTA_time_scheduled.toFixed(2).toString() + " hours] " + itemData.ROTA_working_time;
						rotaWorkingTotal = Number(rotaWorkingTotal + itemData.ROTA_time_scheduled);
						if (isNaN(Number(itemData.ROTA_EO))) {
							// Data doesn't exist or not stored correctly. Perhaps an old version of Shift Tracker?
						} else {
							rotaWorkingEO = Number(rotaWorkingEO + itemData.ROTA_EO);
						}
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
						if (isNaN(Number(itemData.ACTUAL_EO))) {
							// Data doesn't exist or not stored correctly. Perhaps an old version of Shift Tracker?
						} else {
							actualWorkingEO = Number(actualWorkingEO + itemData.ACTUAL_EO);
						}
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
					} else { // v1 or No Status. Default value.
						$item("#STItemCompletedHours").text = "-";
						$item("#STItemCompletedTitle").text = "Shift Status:";
					}
					if (itemData.MYJDW_net_punched !== 0) {
						$item("#STItemPunchedHours").text = itemData.MYJDW_net_punched.toFixed(2).toString() + " hours";
						netPunchedTotal = Number(netPunchedTotal + itemData.MYJDW_net_punched);
					} else {
						$item("#STItemPunchedHours").text = "-";
					}
					
					if (STData.version === "v2") {
						$item("#reminderEventsButton").show();
						if (itemData.REMINDERS.length > 0 && itemData.EVENTS.length > 0) {
							$item("#reminderEventsButton").label = itemData.EVENTS.length + " Events, " + itemData.REMINDERS.length + " Rem...";
							$item("#reminderEventsButton").style.backgroundColor = "#BA0BD3";
							$item("#reminderEventsButton").style.color = "#FFFFFF";
						} else if (itemData.EVENTS.length > 0) {
							$item("#reminderEventsButton").label = itemData.EVENTS.length + " Events";
							$item("#reminderEventsButton").style.backgroundColor = "#0B81D3";
							$item("#reminderEventsButton").style.color = "#FFFFFF";
						} else if (itemData.REMINDERS.length > 0) {
							$item("#reminderEventsButton").label = itemData.REMINDERS.length + " Reminders";
							$item("#reminderEventsButton").style.backgroundColor = "#D3AB0B";
							$item("#reminderEventsButton").style.color = "#FFFFFF";
						} else {
							$item("#reminderEventsButton").label = " ";
							$item("#reminderEventsButton").style.backgroundColor = "#E3E3E3";
							$item("#reminderEventsButton").style.color = "#000000";
						}
					} else {
						$item("#reminderEventsButton").hide();
					}
				});
				if (shiftsPublished === false) {
					$w("#STItemScheduledHours").text = "No Data";
				}
				$w("#STEditDate").options = dropdownOptionArray;
				$w("#STEditDate").selectedIndex = undefined;
				$w("#STEditOnHoliday").enable();
				$w("#STEditOnRota").enable();
				$w("#STEditWorked").enable();
				$w("#STEditWorked").checked = false;
				$w("#STEditOnRota").checked = false;
				$w("#STEditOnHoliday").checked = false;
				$w("#STEditRotaStart").disable();
				$w("#STEditRotaEnd").disable();
				$w("#STEditRotaStart").value = "15:00";
				$w("#STEditRotaEnd").value = "00:30";
				$w("#STEditActualStart").disable();
				$w("#STEditActualEnd").disable();
				$w("#STEditActualStart").value = "15:00";
				$w("#STEditActualEnd").value = "00:30";
					$w("#STJDWScheduled").text = rotaWorkingTotal.toFixed(2).toString() + " hours";
					$w("#STJDWCompleted").text = actualWorkingTotal.toFixed(2).toString() + " hours";
					$w("#STJDWNetPunched").text = netPunchedTotal.toFixed(2).toString() + " hours";
				let additionalDeductions = Number(0); // Additional deductions should there be any.
				let basicPayRate = Number(12.21); // This is the hourly rate paid.
				let nationalInsuranceStartNum = Number(242); // Any money after this amount pays national insurance.
				let nationalInsuranceRate = Number(13.25 / 100); // NI Percentage, divided by hundred to make calculatios work.
				let incomeTaxStartNum = Number(242.88); // Any money after this amount pays income tax.
				let incomeTaxRate = Number(20 / 100); // Tax Percentage, divided by hundred to make calculatios work.
				let enhancedO = Number(1.71); // £1.71 extra is paid for every hour worked after midnight.

				// Scheduled Calculations
				let ScheduledBP = Number(rotaWorkingTotal * basicPayRate);
				let ScheduledEO = Number(enhancedO * Number(rotaWorkingEO.toFixed(2)));
				let ScheduledEE1 = Number(rotaWorkingTotal * basicPayRate + ScheduledEO - additionalDeductions).toFixed(2).toString();
				let ScheduledEE2Money = Number(rotaWorkingTotal * basicPayRate + ScheduledEO - additionalDeductions);
				let ScheduledEE2NH = 0;
				if (ScheduledEE2Money >= nationalInsuranceStartNum) {
					ScheduledEE2NH = Number((ScheduledEE2Money - nationalInsuranceStartNum) * nationalInsuranceRate);
				}
				let ScheduledEE2Tax = 0;
				if (ScheduledEE2Money >= incomeTaxStartNum) {
					ScheduledEE2Tax = Number((ScheduledEE2Money - incomeTaxStartNum) * incomeTaxRate);
				}
				let ScheduledEE2 = Number(ScheduledEE2Money - (ScheduledEE2NH + ScheduledEE2Tax)).toFixed(2).toString();

				// Completed Calculations
				let CompletedBP = Number(actualWorkingTotal * basicPayRate);
				let CompletedEO = Number(enhancedO * Number(actualWorkingEO.toFixed(2)));
				let CompletedEE1 = Number(actualWorkingTotal * basicPayRate + CompletedEO - additionalDeductions).toFixed(2).toString();
				let CompletedEE2Money = Number(actualWorkingTotal * basicPayRate + CompletedEO - additionalDeductions);
				let CompletedEE2NH = 0;
				if (CompletedEE2Money >= nationalInsuranceStartNum) {
					CompletedEE2NH = Number((CompletedEE2Money - nationalInsuranceStartNum) * nationalInsuranceRate);
				}
				let CompletedEE2Tax = 0;
				if (CompletedEE2Money >= incomeTaxStartNum) {
					CompletedEE2Tax = Number((CompletedEE2Money - incomeTaxStartNum) * incomeTaxRate);
				}
				let CompletedEE2 = Number(CompletedEE2Money - (CompletedEE2NH + CompletedEE2Tax)).toFixed(2).toString();

				// NetPunched Calculations
				let NetPunchedBP = Number(netPunchedTotal * basicPayRate);
				let NetPunchedEE1 = Number(netPunchedTotal * basicPayRate + CompletedEO - additionalDeductions).toFixed(2).toString();
				let NetPunchedEE2Money = Number(netPunchedTotal * basicPayRate + CompletedEO - additionalDeductions);
				let NetPunchedEE2NH = 0;
				if (NetPunchedEE2Money >= nationalInsuranceStartNum) {
					NetPunchedEE2NH = Number((NetPunchedEE2Money - nationalInsuranceStartNum) * nationalInsuranceRate);
				}
				let NetPunchedEE2Tax = 0;
				if (NetPunchedEE2Money >= incomeTaxStartNum) {
					NetPunchedEE2Tax = Number((NetPunchedEE2Money - incomeTaxStartNum) * incomeTaxRate);
				}
				let NetPunchedEE2 = Number(NetPunchedEE2Money - (NetPunchedEE2NH + NetPunchedEE2Tax)).toFixed(2).toString();
				$w("#1BP").text = ScheduledBP.toFixed(2).toString();
				$w("#1EO").text = ScheduledEO.toFixed(2).toString();
				$w("#1IT").text = ScheduledEE2Tax.toFixed(2).toString();
				$w("#1NI").text = ScheduledEE2NH.toFixed(2).toString();
				$w("#1SP").text = additionalDeductions.toFixed(2).toString();
				$w("#1NET").text = "£" + ScheduledEE2;
				$w("#2BP").text = CompletedBP.toFixed(2).toString();
				$w("#2EO").text = CompletedEO.toFixed(2).toString();
				$w("#2IT").text = CompletedEE2Tax.toFixed(2).toString();
				$w("#2NI").text = CompletedEE2NH.toFixed(2).toString();
				$w("#2SP").text = additionalDeductions.toFixed(2).toString();
				$w("#2NET").text = "£" + CompletedEE2;
				$w("#3BP").text = NetPunchedBP.toFixed(2).toString();
				$w("#3EO").text = CompletedEO.toFixed(2).toString();
				$w("#3IT").text = NetPunchedEE2Tax.toFixed(2).toString();
				$w("#3NI").text = NetPunchedEE2NH.toFixed(2).toString();
				$w("#3SP").text = additionalDeductions.toFixed(2).toString();
				$w("#3NET").text = "£" + NetPunchedEE2;
				$w("#STFooter").expand();
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

export function STUpdateButton_click(event) {
	if ($w("#STEdit").collapsed === true) {
		$w("#STHeader").collapse();
		$w("#STBody").collapse();
		$w("#STFooter").collapse();
		$w("#STEdit").expand();
		$w("#STUpdateButton").text = "Cancel";
	} else {
		$w("#STHeader").expand();
		$w("#STBody").expand();
		$w("#STFooter").expand();
		$w("#STEdit").collapse();
		$w("#STUpdateButton").text = "Update";
	}
}

export function STEditDate_change(event) {
	let weekID = Number(memory.getItem("weekID"));
	dataManager.query("shiftData")
	  .eq("dataNum", weekID)
	  .ascending("dataNum")
	  .limit(1)
	  .find()
	  .then((STResults) => {
	  	if (STResults.items.length > 0) {
			// Items have been found!
			let STData = STResults.items[0];
			let itemToSet = $w("#STEditDate").value;
				if (STData.shiftData[itemToSet].ROTA_working_query === true) {
					$w("#STEditOnRota").checked = true;
					$w("#STEditRotaStart").enable();
					$w("#STEditRotaEnd").enable();
					$w("#STEditOnHoliday").disable();
					let startTime = new Date(STData.shiftData[itemToSet].ROTA_start_time);
					let endTime = new Date(STData.shiftData[itemToSet].ROTA_end_time);
					$w("#STEditRotaStart").value = String(String(startTime.getHours()).padStart(2, '0') + ":" + String(startTime.getMinutes()).padStart(2, '0'));
					$w("#STEditRotaEnd").value = String(String(endTime.getHours()).padStart(2, '0') + ":" + String(endTime.getMinutes()).padStart(2, '0'));
				} else {
					$w("#STEditOnRota").checked = false;
					$w("#STEditRotaStart").disable();
					$w("#STEditRotaEnd").disable();
					$w("#STEditOnHoliday").enable();
					$w("#STEditRotaStart").value = "15:00";
					$w("#STEditRotaEnd").value = "00:30";
				}
				if (STData.shiftData[itemToSet].ACTUAL_working_query === true) {
					$w("#STEditWorked").checked = true;
					$w("#STEditActualStart").enable();
					$w("#STEditActualEnd").enable();
					let startTime = new Date(STData.shiftData[itemToSet].ACTUAL_start_time);
					let endTime = new Date(STData.shiftData[itemToSet].ACTUAL_end_time);
					$w("#STEditActualStart").value = String(String(startTime.getHours()).padStart(2, '0') + ":" + String(startTime.getMinutes()).padStart(2, '0'));
					$w("#STEditActualEnd").value = String(String(endTime.getHours()).padStart(2, '0') + ":" + String(endTime.getMinutes()).padStart(2, '0'));
				} else {
					$w("#STEditWorked").checked = false;
					$w("#STEditActualStart").disable();
					$w("#STEditActualEnd").disable();
					$w("#STEditActualStart").value = "15:00";
					$w("#STEditActualEnd").value = "00:30";
				}
				if (STData.shiftData[itemToSet].HOLIDAY === true) {
					$w("#STEditOnHoliday").checked = true;
					$w("#STEditOnRota").disable();
				} else {
					$w("#STEditOnHoliday").checked = false;
					$w("#STEditOnRota").enable();
				}
				$w("#STEditNetPunched").value = STData.shiftData[itemToSet].MYJDW_net_punched.toFixed(2).toString();
		} else {
			console.log("Whoops, there's no data in shiftData.");
		}
	  })
	  .catch ((STErrorMsg) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when loading Shift Tracker.");
		console.log(STErrorMsg);
	  });
}

export function STCheckboxes_change(event) {
	if ($w("#STEditOnRota").checked === true) {
		$w("#STEditRotaStart").enable();
		$w("#STEditRotaEnd").enable();
		$w("#STEditOnHoliday").disable();
	} else {
		$w("#STEditOnRota").checked = false;
		$w("#STEditRotaStart").disable();
		$w("#STEditRotaEnd").disable();
		$w("#STEditOnHoliday").enable();
	}
	if ($w("#STEditWorked").checked === true) {
		$w("#STEditActualStart").enable();
		$w("#STEditActualEnd").enable();
	} else {
		$w("#STEditWorked").checked = false;
		$w("#STEditActualStart").disable();
		$w("#STEditActualEnd").disable();
	}
	if ($w("#STEditOnHoliday").checked === true) {
		$w("#STEditOnRota").disable();
	} else {
		$w("#STEditOnRota").enable();
	}
}

export function STEditButtonSubmit_click(event) {
	let weekID = Number(memory.getItem("weekID"));
	dataManager.query("shiftData")
	  .eq("dataNum", weekID)
	  .ascending("dataNum")
	  .limit(1)
	  .find()
	  .then((STResults) => {
	  	if (STResults.items.length > 0) {
			// Items have been found!
			let STData = STResults.items[0];
			let itemToUpdate = $w("#STEditDate").value;
			if ($w("#STEditOnRota").checked === true) {
				STData.shiftData[itemToUpdate].ROTA_working_query = true;
				let rotaStartTime = new Date(STData.shiftData[itemToUpdate].DATE);
				rotaStartTime.setHours(Number($w("#STEditRotaStart").value.slice(0, 2)), Number($w("#STEditRotaStart").value.slice(3, 5)));
				let rotaEndTime = new Date(STData.shiftData[itemToUpdate].DATE);
				rotaEndTime.setHours(Number($w("#STEditRotaEnd").value.slice(0, 2)), Number($w("#STEditRotaEnd").value.slice(3, 5)));
				STData.shiftData[itemToUpdate].ROTA_start_time = rotaStartTime;
				STData.shiftData[itemToUpdate].ROTA_working_time = $w("#STEditRotaStart").value.slice(0, 5) + " - " + $w("#STEditRotaEnd").value.slice(0, 5);
				if (rotaEndTime.getHours() < 5) {
					// Add a day to date
					rotaEndTime.setDate(rotaEndTime.getDate() + 1);
					STData.shiftData[itemToUpdate].ROTA_end_time = rotaEndTime;
					// Work out Enhanced O
					let midnight = new Date(STData.shiftData[itemToUpdate].DATE);
					midnight.setDate(midnight.getDate() + 1);
					midnight.setHours(0, 0);
					let EOInMS = rotaEndTime.getTime() - midnight.getTime();
					let EORota = EOInMS / (1000 * 3600);
					STData.shiftData[itemToUpdate].ROTA_EO = EORota;
				} else {
					// Finish time is same day, no action required.
					STData.shiftData[itemToUpdate].ROTA_end_time = rotaEndTime;
					STData.shiftData[itemToUpdate].ROTA_EO = 0;
				}
				let hoursOnRotaInMS = rotaEndTime.getTime() - rotaStartTime.getTime();
				let hoursOnRota = hoursOnRotaInMS / (1000 * 3600);
				let adjustedHoursOnRota = 0;
				if (hoursOnRota > 8) {
					// 30 minutes unpaid break deducted
					adjustedHoursOnRota = Number(hoursOnRota - 0.5);
				} else if (hoursOnRota > 6) {
					// 15 minutes unpaid break deducted
					adjustedHoursOnRota = Number(hoursOnRota - 0.25);
				} else {
					// No unpaid break
					adjustedHoursOnRota = Number(hoursOnRota);
				}
				STData.shiftData[itemToUpdate].ROTA_time_scheduled = adjustedHoursOnRota;
			} else {
				STData.shiftData[itemToUpdate].ROTA_working_query = false;
				STData.shiftData[itemToUpdate].ROTA_working_time = "";
				STData.shiftData[itemToUpdate].ROTA_start_time = null;
				STData.shiftData[itemToUpdate].ROTA_end_time = null;
				STData.shiftData[itemToUpdate].ROTA_time_scheduled = 0;
			}
			if ($w("#STEditWorked").checked === true) {
				STData.shiftData[itemToUpdate].ACTUAL_working_query = true;
				let actualStartTime = new Date(STData.shiftData[itemToUpdate].DATE);
				actualStartTime.setHours(Number($w("#STEditActualStart").value.slice(0, 2)), Number($w("#STEditActualStart").value.slice(3, 5)));
				let actualEndTime = new Date(STData.shiftData[itemToUpdate].DATE);
				actualEndTime.setHours(Number($w("#STEditActualEnd").value.slice(0, 2)), Number($w("#STEditActualEnd").value.slice(3, 5)));
				STData.shiftData[itemToUpdate].ACTUAL_start_time = actualStartTime;
				STData.shiftData[itemToUpdate].ACTUAL_working_time = $w("#STEditActualStart").value.slice(0, 5) + " - " + $w("#STEditActualEnd").value.slice(0, 5);
				
				/* This code is temporarily disabled.
				if (actualEndTime.getHours() < 5) {
					// Add a day to date
					actualEndTime.setDate(actualEndTime.getDate() + 1);
					STData.shiftData[itemToUpdate].ACTUAL_end_time = actualEndTime;
					// Work out Enhanced O
					let midnight = new Date(STData.shiftData[itemToUpdate].DATE);
					midnight.setDate(midnight.getDate() + 1);
					midnight.setHours(0, 0);
					let EOInMS = actualEndTime.getTime() - midnight.getTime();
					let EOActual = EOInMS / (1000 * 3600);
					STData.shiftData[itemToUpdate].ACTUAL_EO = EOActual; 
				} else {
					// Finish time is same day, no action required.
					STData.shiftData[itemToUpdate].ACTUAL_end_time = actualEndTime;
					STData.shiftData[itemToUpdate].ACTUAL_EO = 0;
				} */ // Temporarily disabled, was used for wetherspoon.
				STData.shiftData[itemToUpdate].ACTUAL_end_time = actualEndTime; // Temporary, remove this code.
				STData.shiftData[itemToUpdate].ACTUAL_EO = 0 // Temporary, remove this code.
				
				let hoursActualInMS = actualEndTime.getTime() - actualStartTime.getTime();
				let hoursActual = hoursActualInMS / (1000 * 3600);
				let adjustedHoursActual = 0;

				if (hoursActual > 8) {
					// 30 minutes unpaid break deducted
					adjustedHoursActual = Number(hoursActual - 0.5);
				} else if (hoursActual > 6) {
					// 15 minutes unpaid break deducted
					adjustedHoursActual = Number(hoursActual - 0.25);
				} else {
					// No unpaid break
					adjustedHoursActual = Number(hoursActual);
				}
				STData.shiftData[itemToUpdate].ACTUAL_time_scheduled = adjustedHoursActual;
			} else {
				STData.shiftData[itemToUpdate].ACTUAL_working_query = false;
				STData.shiftData[itemToUpdate].ACTUAL_working_time = "";
				STData.shiftData[itemToUpdate].ACTUAL_start_time = null;
				STData.shiftData[itemToUpdate].ACTUAL_end_time = null;
				STData.shiftData[itemToUpdate].ACTUAL_time_scheduled = 0;
			}
			if ($w("#STEditNetPunched").value === "0.00") {
				// Can be safely set to zero.
				STData.shiftData[itemToUpdate].MYJDW_net_punched = 0;
			} else if ($w("#STEditNetPunched").value === null || $w("#STEditNetPunched").value === undefined) {
				// Can be safely set to zero.
				STData.shiftData[itemToUpdate].MYJDW_net_punched = 0;
			} else {
				// Can be set to user entered value.
				STData.shiftData[itemToUpdate].MYJDW_net_punched = Number($w("#STEditNetPunched").value);
			}
			if ($w("#STEditOnRota").checked === true && $w("#STEditWorked").checked === true) {
				STData.shiftData[itemToUpdate].SHIFT_status = "C";
			} else if ($w("#STEditOnRota").checked === true && $w("#STEditWorked").checked === false) {
				STData.shiftData[itemToUpdate].SHIFT_status = "NC";
			} else if ($w("#STEditOnRota").checked === false && $w("#STEditWorked").checked === true) {
				STData.shiftData[itemToUpdate].SHIFT_status = "C";
			} else if ($w("#STEditOnRota").checked === false && $w("#STEditWorked").checked === false) {
				STData.shiftData[itemToUpdate].SHIFT_status = "NS";
			} else {
				STData.shiftData[itemToUpdate].SHIFT_status = "NS";
			}
			if ($w("#STEditOnHoliday").checked === true) {
				STData.shiftData[itemToUpdate].HOLIDAY = true;
			} else {
				STData.shiftData[itemToUpdate].HOLIDAY = false;
			}
			dataManager.update("shiftData", STData)
			.then((results) => {
				console.log("Updated week " + results.dataNum + "!");
				$w("#STHeader").expand();
				$w("#STBody").expand();
				$w("#STFooter").expand();
				$w("#STEdit").collapse();
				$w("#STUpdateButton").text = "Update";
				loadST(weekID);
			})
			.catch( (err) => {
				console.log("Error when trying to insert");
				console.log(err);
			});
		} else {
			console.log("Whoops, there's no data in shiftData.");
		}
	  })
	  .catch ((STErrorMsg) => {
		// Something went wrong with the query
		console.log("Whoops, something went wrong when loading Shift Tracker.");
		console.log(STErrorMsg);
	  });
}

export function STPrevious_click(event) {
let currentlyDisplayed = Number(memory.getItem("weekID"));
	let toLoadNext = Number(currentlyDisplayed - 1);
	memory.setItem("weekID", toLoadNext);
	loadST(toLoadNext);
}

export function STNext_click(event) {
	let currentlyDisplayed = Number(memory.getItem("weekID"));
	let toLoadNext = Number(currentlyDisplayed + 1);
	memory.setItem("weekID", toLoadNext);
	loadST(toLoadNext);
}

export function reminderEventsButton_click(event, $item) {
	console.log("Item ID: " + $item("#itemID").text + ", Week ID: " + memory.getItem("weekID"));
	pageManager.openLightbox("Events Manager", {"itemID": $item("#itemID").text, "weekID": memory.getItem("weekID"), "date": $item("#STItemDayTitle").text});
}

export function refreshST_click(event) {
	loadST(Number(memory.getItem("weekID")));
}

export function ExpandCollapseSTF_click(event) {
	if ($w("#STScheduledBoxDetail").collapsed) {
		$w("#STScheduledBoxDetail").expand();
		$w("#STCompletedBoxDetail").expand();
		$w("#STNetPunchedBoxDetail").expand();
	} else {
		$w("#STScheduledBoxDetail").collapse();
		$w("#STCompletedBoxDetail").collapse();
		$w("#STNetPunchedBoxDetail").collapse();
	}
}

export function billsMultiAction_dblClick(event) {
	let action = $w("#billsMultiAction").value;
	switch(action) {
	case "Add":
		$w("#billsMultiAction").value = "null";
		$w("#billsRepeater").forEachItem(($item, itemData, index) => {
			if (itemData.weeksComplete !== itemData.weekAmount) {
				updateBill($item("#brdID").text, "add")
				.then((returned) => {
					console.log(returned);
				})
				.catch ((BRDErrorMsg) => {
					console.log(BRDErrorMsg);
				});
			}
		});
		console.log("Action complete, reloading....");
		$w("#billsRepeaterDetailBox").expand();
		$w("#brmCollapseButton").show();
		$w("#brmExpandButton").hide();
		loadBF();
		break;
	case "Subtract":
		$w("#billsMultiAction").value = "null";
		$w("#billsRepeater").forEachItem(($item, itemData, index) => {
			if (itemData.weeksComplete !== 0) {
				updateBill($item("#brdID").text, "subtract")
				.then((returned) => {
					console.log(returned);
				})
				.catch ((BRDErrorMsg) => {
					console.log(BRDErrorMsg);
				});
			}
		});
		console.log("Action complete, reloading....");
		$w("#billsRepeaterDetailBox").expand();
		$w("#brmCollapseButton").show();
		$w("#brmExpandButton").hide();
		loadBF();
		break;
	default:
		console.log("No action was selected.");
	}
}

export function currentTime() {
	// Updates the current time clock every second.
	let currentDate = new Date();
	setTimeout(function() {
		$w("#ttCurrentTime").text = currentDate.toJSON().substring(11, 19);
		currentTime();
		if (currentDate.toJSON().substring(17, 19) === "00") {
			resetAll.replay();
			console.log("Fired update event!");
		}
	}, 1000);
}

export function trainTracker() {
	let scrollingText1A = wixAnimations.timeline();
	let scrollingText1B = wixAnimations.timeline();
	let scrollingText2A = wixAnimations.timeline();
	let scrollingText2B = wixAnimations.timeline();
	let scrollingText3A = wixAnimations.timeline();
	let scrollingText3B = wixAnimations.timeline();
	let scrollingText4A = wixAnimations.timeline();
	let scrollingText4B = wixAnimations.timeline();
	let scrollingText5A = wixAnimations.timeline();
	let scrollingText5B = wixAnimations.timeline();

	setTimeout(function() {

	ldbws($w("#ttStationSelector").value)
	  .then((returnedData) => {
		console.log(returnedData);
		let serviceArray = returnedData.GetStationBoardResult.trainServices.service;
		
		if (serviceArray !== null && serviceArray !== undefined) {
			if (serviceArray.length > 0) {
				// At least 1 item
				if (Array.isArray(serviceArray)) {
					serviceArray = returnedData.GetStationBoardResult.trainServices.service;
				} else {
					let tempArray = [];
					tempArray.push(returnedData.GetStationBoardResult.trainServices.service);
					serviceArray = tempArray;
				}
				let callingPointsArray = serviceArray[0].subsequentCallingPoints.callingPointList.callingPoint;
				let tempList = "Calling at: ";
				for (let index = 0; index < callingPointsArray.length; ++index) {
					if (index === (callingPointsArray.length - 1)) {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + ").";
					} else {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + "), ";
					}
				}
				let callingPointsList1 = tempList;
				$w("#ttT1B1").expand();
				$w("#ttT1B2").expand();
				$w("#ttT1B1Time").text = serviceArray[0].std;
				$w("#ttT1B1Dest").text = serviceArray[0].destination.location.locationName;
				$w("#ttT1B1Expt").text = serviceArray[0].etd;
				if (serviceArray[0].platform !== null && serviceArray[0].platform !== undefined) {
					$w("#ttT1B1Plat").text = serviceArray[0].platform;
				} else {
					$w("#ttT1B1Plat").text = "";
				}
				if (serviceArray[0].isCancelled !== true && serviceArray[0].isCancelled !== "true") {
					$w("#ttT1B2ScrollText").text = callingPointsList1;
				} else {
					$w("#ttT1B2ScrollText").text = serviceArray[0].cancelReason + ".";
				}
				scrollingText1A.add($w("#ttT1B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText1A.add($w("#ttT1B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText1A.add($w("#ttT1B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText1A.add($w("#ttT1B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText1A.add($w("#ttT1B2ScrollText"), { x: Number("-" + (Number($w("#ttT1B2ScrollText").text.length * 10) + 60)), duration: Number($w("#ttT1B2ScrollText").text.length * 110), easing: "easeLinear"});
				scrollingText1A.add($w("#ttT1B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText1B.add($w("#ttT1B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText1B.add($w("#ttT1B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText1B.add($w("#ttT1B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText1B.add($w("#ttT1B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText1B.add($w("#ttT1B2ScrollText"), { x: 0, y: -30, duration: 750, opacity: 1, easing: "easeLinear"});
				setTimeout(function() {
					$w("#ttT1B2ScrollText").show();
					scrollingText1A.play();
					scrollingText1A.onComplete(() => {
						if (serviceArray[0].isCancelled !== true && serviceArray[0].isCancelled !== "true") {
							if (serviceArray[0].length !== null && serviceArray[0].length !== undefined) {
								$w("#ttT1B2ScrollText").text = "A " + serviceArray[0].operator + " service with " + serviceArray[0].length + " carriages.";
							} else {
								$w("#ttT1B2ScrollText").text = "A " + serviceArray[0].operator + " service.";
							}
							scrollingText1B.replay();
						} else {
							$w("#ttT1B2ScrollText").text = "This service has been cancelled.";
							scrollingText1B.replay();
						}
					});
					scrollingText1B.onComplete(() => {
						if (serviceArray[0].isCancelled !== true && serviceArray[0].isCancelled !== "true") {
							$w("#ttT1B2ScrollText").text = callingPointsList1;
							scrollingText1A.replay();
						} else {
							$w("#ttT1B2ScrollText").text = serviceArray[0].cancelReason + ".";
							scrollingText1A.replay();
						}
					});
				}, 3000);
			} else {
				$w("#ttT1B1").expand();
				$w("#ttT1B2").collapse();
				$w("#ttT1B1Time").text = "NONE";
				$w("#ttT1B1Dest").text = "No trains scheduled at [" + $w("#ttStationSelector").value + "].";
				$w("#ttT1B1Plat").text = "";
				$w("#ttT1B1Expt").text = "";
			}
			if (serviceArray.length > 1) {
				// At least 2 item
				let callingPointsArray = serviceArray[1].subsequentCallingPoints.callingPointList.callingPoint;
				let tempList = "Calling at: ";
				for (let index = 0; index < callingPointsArray.length; ++index) {
					if (index === (callingPointsArray.length - 1)) {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + ").";
					} else {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + "), ";
					}
				}
				let callingPointsList2 = tempList;
				$w("#ttT2B1").expand();
				$w("#ttT2B2").expand();
				$w("#ttT2B1Time").text = serviceArray[1].std;
				$w("#ttT2B1Dest").text = serviceArray[1].destination.location.locationName;
				$w("#ttT2B1Expt").text = serviceArray[1].etd;
				if (serviceArray[1].platform !== null && serviceArray[1].platform !== undefined) {
					$w("#ttT2B1Plat").text = serviceArray[1].platform;
				} else {
					$w("#ttT2B1Plat").text = "";
				}
				if (serviceArray[1].isCancelled !== true && serviceArray[1].isCancelled !== "true") {
					$w("#ttT2B2ScrollText").text = callingPointsList2;
				} else {
					$w("#ttT2B2ScrollText").text = serviceArray[1].cancelReason + ".";
				}
				scrollingText2A.add($w("#ttT2B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText2A.add($w("#ttT2B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText2A.add($w("#ttT2B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText2A.add($w("#ttT2B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText2A.add($w("#ttT2B2ScrollText"), { x: Number("-" + (Number($w("#ttT2B2ScrollText").text.length * 10) + 60)), duration: Number($w("#ttT2B2ScrollText").text.length * 110), easing: "easeLinear"});
				scrollingText2A.add($w("#ttT2B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText2B.add($w("#ttT2B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText2B.add($w("#ttT2B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText2B.add($w("#ttT2B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText2B.add($w("#ttT2B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText2B.add($w("#ttT2B2ScrollText"), { x: 0, y: -30, duration: 750, opacity: 1, easing: "easeLinear"});
				setTimeout(function() {
					$w("#ttT2B2ScrollText").show();
					scrollingText2A.play();
					scrollingText2A.onComplete(() => {
						if (serviceArray[1].isCancelled !== true && serviceArray[1].isCancelled !== "true") {
							if (serviceArray[1].length !== null && serviceArray[1].length !== undefined) {
								$w("#ttT2B2ScrollText").text = "A " + serviceArray[1].operator + " service with " + serviceArray[1].length + " carriages.";
							} else {
								$w("#ttT2B2ScrollText").text = "A " + serviceArray[1].operator + " service.";
							}
							scrollingText2B.replay();
						} else {
							$w("#ttT2B2ScrollText").text = "This service has been cancelled.";
							scrollingText2B.replay();
						}
					});
					scrollingText2B.onComplete(() => {
						if (serviceArray[1].isCancelled !== true && serviceArray[1].isCancelled !== "true") {
							$w("#ttT2B2ScrollText").text = callingPointsList2;
							scrollingText2A.replay();
						} else {
							$w("#ttT2B2ScrollText").text = serviceArray[1].cancelReason + ".";
							scrollingText2A.replay();
						}
					});
				}, 3000);
			} else {
				$w("#ttT2B1").collapse();
				$w("#ttT2B2").collapse();
			}
			if (serviceArray.length > 2) {
				// At least 3 item
				let callingPointsArray = serviceArray[2].subsequentCallingPoints.callingPointList.callingPoint;
				let tempList = "Calling at: ";
				for (let index = 0; index < callingPointsArray.length; ++index) {
					if (index === (callingPointsArray.length - 1)) {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + ").";
					} else {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + "), ";
					}
				}
				let callingPointsList3 = tempList;
				$w("#ttT3B1").expand();
				$w("#ttT3B2").expand();
				$w("#ttT3B1Time").text = serviceArray[2].std;
				$w("#ttT3B1Dest").text = serviceArray[2].destination.location.locationName;
				$w("#ttT3B1Expt").text = serviceArray[2].etd;
				if (serviceArray[2].platform !== null && serviceArray[2].platform !== undefined) {
					$w("#ttT3B1Plat").text = serviceArray[2].platform;
				} else {
					$w("#ttT3B1Plat").text = "";
				}
				if (serviceArray[2].isCancelled !== true && serviceArray[2].isCancelled !== "true") {
					$w("#ttT3B2ScrollText").text = callingPointsList3;
				} else {
					$w("#ttT3B2ScrollText").text = serviceArray[2].cancelReason + ".";
				}
				scrollingText3A.add($w("#ttT3B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText3A.add($w("#ttT3B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText3A.add($w("#ttT3B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText3A.add($w("#ttT3B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText3A.add($w("#ttT3B2ScrollText"), { x: Number("-" + (Number($w("#ttT3B2ScrollText").text.length * 10) + 60)), duration: Number($w("#ttT3B2ScrollText").text.length * 110), easing: "easeLinear"});
				scrollingText3A.add($w("#ttT3B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText3B.add($w("#ttT3B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText3B.add($w("#ttT3B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText3B.add($w("#ttT3B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText3B.add($w("#ttT3B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText3B.add($w("#ttT3B2ScrollText"), { x: 0, y: -30, duration: 750, opacity: 1, easing: "easeLinear"});
				setTimeout(function() {
					$w("#ttT3B2ScrollText").show();
					scrollingText3A.play();
					scrollingText3A.onComplete(() => {
						if (serviceArray[2].isCancelled !== true && serviceArray[2].isCancelled !== "true") {
							if (serviceArray[2].length !== null && serviceArray[2].length !== undefined) {
								$w("#ttT3B2ScrollText").text = "A " + serviceArray[2].operator + " service with " + serviceArray[2].length + " carriages.";
							} else {
								$w("#ttT3B2ScrollText").text = "A " + serviceArray[2].operator + " service.";
							}
							scrollingText3B.replay();
						} else {
							$w("#ttT3B2ScrollText").text = "This service has been cancelled.";
							scrollingText3B.replay();
						}
					});
					scrollingText3B.onComplete(() => {
						if (serviceArray[2].isCancelled !== true && serviceArray[2].isCancelled !== "true") {
							$w("#ttT3B2ScrollText").text = callingPointsList3;
							scrollingText3A.replay();
						} else {
							$w("#ttT3B2ScrollText").text = serviceArray[2].cancelReason + ".";
							scrollingText3A.replay();
						}
					});
				}, 3000);
			} else {
				$w("#ttT3B1").collapse();
				$w("#ttT3B2").collapse();
			}
			if (serviceArray.length > 3) {
				// At least 4 item
				let callingPointsArray = serviceArray[3].subsequentCallingPoints.callingPointList.callingPoint;
				let tempList = "Calling at: ";
				for (let index = 0; index < callingPointsArray.length; ++index) {
					if (index === (callingPointsArray.length - 1)) {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + ").";
					} else {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + "), ";
					}
				}
				let callingPointsList4 = tempList;
				$w("#ttT4B1").expand();
				$w("#ttT4B2").expand();
				$w("#ttT4B1Time").text = serviceArray[3].std;
				$w("#ttT4B1Dest").text = serviceArray[3].destination.location.locationName;
				$w("#ttT4B1Expt").text = serviceArray[3].etd;
				if (serviceArray[3].platform !== null && serviceArray[3].platform !== undefined) {
					$w("#ttT4B1Plat").text = serviceArray[3].platform;
				} else {
					$w("#ttT4B1Plat").text = "";
				}
				if (serviceArray[3].isCancelled !== true && serviceArray[3].isCancelled !== "true") {
					$w("#ttT4B2ScrollText").text = callingPointsList4;
				} else {
					$w("#ttT4B2ScrollText").text = serviceArray[3].cancelReason + ".";
				}
				scrollingText4A.add($w("#ttT4B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText4A.add($w("#ttT4B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText4A.add($w("#ttT4B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText4A.add($w("#ttT4B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText4A.add($w("#ttT4B2ScrollText"), { x: Number("-" + (Number($w("#ttT4B2ScrollText").text.length * 10) + 60)), duration: Number($w("#ttT4B2ScrollText").text.length * 110), easing: "easeLinear"});
				scrollingText4A.add($w("#ttT4B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText4B.add($w("#ttT4B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText4B.add($w("#ttT4B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText4B.add($w("#ttT4B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText4B.add($w("#ttT4B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText4B.add($w("#ttT4B2ScrollText"), { x: 0, y: -30, duration: 750, opacity: 1, easing: "easeLinear"});
				setTimeout(function() {
					$w("#ttT4B2ScrollText").show();
					scrollingText4A.play();
					scrollingText4A.onComplete(() => {
						if (serviceArray[3].isCancelled !== true && serviceArray[3].isCancelled !== "true") {
							if (serviceArray[3].length !== null && serviceArray[3].length !== undefined) {
								$w("#ttT4B2ScrollText").text = "A " + serviceArray[3].operator + " service with " + serviceArray[3].length + " carriages.";
							} else {
								$w("#ttT4B2ScrollText").text = "A " + serviceArray[3].operator + " service.";
							}
							scrollingText4B.replay();
						} else {
							$w("#ttT4B2ScrollText").text = "This service has been cancelled.";
							scrollingText4B.replay();
						}
					});
					scrollingText4B.onComplete(() => {
						if (serviceArray[3].isCancelled !== true && serviceArray[3].isCancelled !== "true") {
							$w("#ttT4B2ScrollText").text = callingPointsList4;
							scrollingText4A.replay();
						} else {
							$w("#ttT4B2ScrollText").text = serviceArray[3].cancelReason + ".";
							scrollingText4A.replay();
						}
					});
				}, 3000);
			} else {
				$w("#ttT4B1").collapse();
				$w("#ttT4B2").collapse();
			}
			if (serviceArray.length > 4) {
				// At least 5 item
				let callingPointsArray = serviceArray[4].subsequentCallingPoints.callingPointList.callingPoint;
				let tempList = "Calling at: ";
				for (let index = 0; index < callingPointsArray.length; ++index) {
					if (index === (callingPointsArray.length - 1)) {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + ").";
					} else {
						tempList = tempList + callingPointsArray[index].locationName + " (" + callingPointsArray[index].st + "), ";
					}
				}
				let callingPointsList5 = tempList;
				$w("#ttT5B1").expand();
				$w("#ttT5B2").expand();
				$w("#ttT5B1Time").text = serviceArray[4].std;
				$w("#ttT5B1Dest").text = serviceArray[4].destination.location.locationName;
				$w("#ttT5B1Expt").text = serviceArray[4].etd;
				if (serviceArray[4].platform !== null && serviceArray[4].platform !== undefined) {
					$w("#ttT5B1Plat").text = serviceArray[4].platform;
				} else {
					$w("#ttT5B1Plat").text = "";
				}
				if (serviceArray[4].isCancelled !== true && serviceArray[4].isCancelled !== "true") {
					$w("#ttT5B2ScrollText").text = callingPointsList5;
				} else {
					$w("#ttT5B2ScrollText").text = serviceArray[4].cancelReason + ".";
				}
				scrollingText5A.add($w("#ttT5B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText5A.add($w("#ttT5B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText5A.add($w("#ttT5B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText5A.add($w("#ttT5B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText5A.add($w("#ttT5B2ScrollText"), { x: Number("-" + (Number($w("#ttT5B2ScrollText").text.length * 10) + 60)), duration: Number($w("#ttT5B2ScrollText").text.length * 110), easing: "easeLinear"});
				scrollingText5A.add($w("#ttT5B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText5B.add($w("#ttT5B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 0, easing: "easeLinear"});
				scrollingText5B.add($w("#ttT5B2ScrollText"), { x: 0, y: 30, duration: 1, opacity: 1, easing: "easeLinear"});
				scrollingText5B.add($w("#ttT5B2ScrollText"), { x: 0, y: 0, duration: 750, opacity: 1, easing: "easeLinear"});
				scrollingText5B.add($w("#ttT5B2ScrollText"), { x: 0, y: 0, duration: 2000, opacity: 1, easing: "easeLinear"});
				scrollingText5B.add($w("#ttT5B2ScrollText"), { x: 0, y: -30, duration: 750, opacity: 1, easing: "easeLinear"});
				setTimeout(function() {
					$w("#ttT5B2ScrollText").show();
					scrollingText5A.play();
					scrollingText5A.onComplete(() => {
						if (serviceArray[4].isCancelled !== true && serviceArray[4].isCancelled !== "true") {
							if (serviceArray[4].length !== null && serviceArray[4].length !== undefined) {
								$w("#ttT5B2ScrollText").text = "A " + serviceArray[4].operator + " service with " + serviceArray[4].length + " carriages.";
							} else {
								$w("#ttT5B2ScrollText").text = "A " + serviceArray[4].operator + " service.";
							}
							scrollingText5B.replay();
						} else {
							$w("#ttT5B2ScrollText").text = "This service has been cancelled.";
							scrollingText5B.replay();
						}
					});
					scrollingText5B.onComplete(() => {
						if (serviceArray[4].isCancelled !== true && serviceArray[4].isCancelled !== "true") {
							$w("#ttT5B2ScrollText").text = callingPointsList5;
							scrollingText5A.replay();
						} else {
							$w("#ttT5B2ScrollText").text = serviceArray[4].cancelReason + ".";
							scrollingText5A.replay();
						}
					});
				}, 3000);
			} else {
				$w("#ttT5B1").collapse();
				$w("#ttT5B2").collapse();
			}
		} else {
			$w("#ttT1B1").expand();
			$w("#ttT1B2").collapse();
			$w("#ttT1B1Time").text = "NONE";
			$w("#ttT1B1Dest").text = "Station [" + $w("#ttStationSelector").value + "] has no timetable.";
			$w("#ttT1B1Plat").text = "";
			$w("#ttT1B1Expt").text = "";
		}
	  })
	  .catch ((ttErrorMsg) => {
		console.log(ttErrorMsg);
			$w("#ttT1B1").expand();
			$w("#ttT1B2").collapse();
			$w("#ttT1B1Time").text = "ERR1";
			$w("#ttT1B1Dest").text = "Station [" + $w("#ttStationSelector").value + "] has no timetable.";
			$w("#ttT1B1Plat").text = "";
			$w("#ttT1B1Expt").text = "";
	  });

	resetAll.onComplete(() => {
	
		console.log("Received update event!");

		$w("#ttT1B2ScrollText").hide();
		$w("#ttT2B2ScrollText").hide();
		$w("#ttT3B2ScrollText").hide();
		$w("#ttT4B2ScrollText").hide();
		$w("#ttT5B2ScrollText").hide();

			scrollingText1A.pause();
			scrollingText1B.pause();
			scrollingText2A.pause();
			scrollingText2B.pause();
			scrollingText3A.pause();
			scrollingText3B.pause();
			scrollingText4A.pause();
			scrollingText4B.pause();
			scrollingText5A.pause();
			scrollingText5B.pause();

		setTimeout(function() {
			trainTracker();
		}, 500);
	});
	}, 500);
}

export function ttStationSelector_change(event) {
	resetAll.replay();
}

export function loadRemindersAndEvents(STData) {
	let today = new Date();
	let dayID = null;
	switch(today.getDay()) {
	case 0:
		// Sunday
		$w("#REDay").text = "Sunday";
		dayID = 6;
		break;
	case 1:
		// Monday
		$w("#REDay").text = "Monday";
		dayID = 0;
		break;
	case 2:
		// Tuesday
		$w("#REDay").text = "Tuesday";
		dayID = 1;
		break;
	case 3:
		// Wednesday
		$w("#REDay").text = "Wednesday";
		dayID = 2;
		break;
	case 4:
		// Thursday
		$w("#REDay").text = "Thursday";
		dayID = 3;
		break;
	case 5:
		// Friday
		$w("#REDay").text = "Friday";
		dayID = 4;
		break;
	case 6:
		// Saturday
		$w("#REDay").text = "Saturday";
		dayID = 5;
		break;
	}
	console.log("Events & Reminders: Week dataNum #" + STData.dataNum + ". Day of week #" + dayID + " (0-6).");
	
	let eventsArray = STData.shiftData[dayID].EVENTS;
	let remindersArray = STData.shiftData[dayID].REMINDERS;
	let repeaterArray = [];
	console.log("Events & Reminders: " + eventsArray.length + " events found, " + remindersArray.length + " reminders found.");

	if (eventsArray.length >= 1) {
		for (let currentNumberEvents = 0; currentNumberEvents < eventsArray.length; currentNumberEvents++) {
			if (eventsArray[currentNumberEvents].ALLDAY !== true) { 
				repeaterArray.push({
					"Type": "Event",
					"Text": "[" + eventsArray[currentNumberEvents].START_TIME + " - " + eventsArray[currentNumberEvents].END_TIME + "] " + eventsArray[currentNumberEvents].TITLE,
					"_id": String(currentNumberEvents)
				});
			} else {
				repeaterArray.push({
					"Type": "Event",
					"Text": "[All Day] " + eventsArray[currentNumberEvents].TITLE,
					"_id": String(currentNumberEvents)
				});
			}
		}
	} else {
		repeaterArray.push({
			"Type": "Event",
			"Text": "[None] No events",
			"_id": String(-1)
		});
	}

	if (remindersArray.length >= 1) {
		for (let currentNumberReminders = 0; currentNumberReminders < remindersArray.length; currentNumberReminders++) {
			if (remindersArray[currentNumberReminders].ALLDAY !== true) { 
				repeaterArray.push({
					"Type": "Reminder",
					"Text": "[" + remindersArray[currentNumberReminders].START_TIME + " - " + remindersArray[currentNumberReminders].END_TIME + "] " + remindersArray[currentNumberReminders].TITLE,
					"_id": String(currentNumberReminders + eventsArray.length)
				});
			} else {
				repeaterArray.push({
					"Type": "Reminder",
					"Text": "[All Day] " + remindersArray[currentNumberReminders].TITLE,
					"_id": String(currentNumberReminders + eventsArray.length)
				});
			}
		}
	} else {
		repeaterArray.push({
			"Type": "Reminder",
			"Text": "[None] No reminders",
			"_id": String(eventsArray.length + 1)
		});
	}
	$w("#RERepeater").data = repeaterArray;

	$w("#RERepeater").forEachItem(($item, itemData, index) => {
		$item("#REDetail").text = itemData.Text;
		switch(itemData.Type) {
			case "Event":
				$item("#reminderIndicator").hide();
				$item("#eventIndicator").show();
				break;
			case "Reminder":
				$item("#reminderIndicator").show();
				$item("#eventIndicator").hide();
				break;
			default:
				$item("#reminderIndicator").hide();
				$item("#eventIndicator").hide();
		}
	});
}
