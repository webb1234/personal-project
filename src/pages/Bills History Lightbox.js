// Shows all pay dates for a specific bill, this can be accessed by pressing "View All Payments" on the Home page.

import dataManager from 'wix-data';
import pageManager from 'wix-window';

$w.onReady(function () {
	let passedData = pageManager.lightbox.getContext();
	console.log("Passed ID: " + passedData._id);

	dataManager.query("Bills")
	  .eq("_id", passedData._id)
	  .limit(1)
	  .find()
	  .then((BillsResults) => {
	  	if (BillsResults.items.length > 0) {
			// Items have been found!
			let itemData = BillsResults.items[0];
			let date = new Date(itemData.lastPayDate);
			let finalWeek = new Date(date.setDate(date.getDate()));
			let firstWeek = new Date(date.setDate(date.getDate() - (7 * itemData.weekAmount)));
			console.log("First Week: " + firstWeek + ", Final Week: " + finalWeek);
			let defaultWeeklyAmount = Number(Number(itemData.amount / itemData.weekAmount).toFixed(2));
			let finalWeekAmount = Number(itemData.amount - (defaultWeeklyAmount * (itemData.weekAmount - 1)));
			let array = [];

			for (let i = 0; i < itemData.weekAmount; i++) {
				let thisWeek = new Date(firstWeek.setDate(firstWeek.getDate() + 7));
				let amount = 0;
				let isPaid = false;
				if ((i + 1) === itemData.weekAmount) {
					amount = finalWeekAmount;
				} else {
					amount = defaultWeeklyAmount;
				}
				if (itemData.weeksComplete === 0) {
					isPaid = false;
				} else if ((i + 1) <= itemData.weeksComplete) {
					isPaid = true;
				} else {
					isPaid = false;
				}
				let toPush = {
					"_id": i.toString(),
					"date": thisWeek,
					"amount": amount,
					"paid": isPaid
				}
				array.push(toPush);
			}
			console.log(array);
			$w("#billsRepeater").data = array;
			loadBFRepeater();
		} else {
			console.log("No items found in Bills.");
			pageManager.lightbox.close();
		}
	  })
	  .catch ((BillsErrorMsg) => {
		console.log(BillsErrorMsg);
	  });
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

export function loadBFRepeater() {
  $w("#billsRepeater").forEachItem(($item, itemData, index) => {
	$item("#date").text = getDate(itemData.date);
	$item("#amount").text = "£" + itemData.amount.toFixed(2).toString();
	if (itemData.paid === true) {
		$item("#paidIMG").show();
		$item("#unpaidIMG").hide();
	} else {
		$item("#paidIMG").hide();
		$item("#unpaidIMG").show();
	}
  });
}
