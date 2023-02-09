import pageManager from 'wix-location';
import {transact} from 'backend/FCPotFetch';
import {memory} from 'wix-storage';

$w.onReady(function () {
	beginLoad(pageManager.query.load);
});

export function beginLoad(receivedQuery) {
	switch(receivedQuery) {
	case "withdraw":
		console.log("withdraw");
		$w("#pageTitle").text = "Pot Withdrawal";
		$w("#selectionBox").collapse();
		$w("#withdrawDisplayBox").expand();
		$w("#depositDisplayBox").collapse();
		$w("#autoSortBox").collapse();
		$w("#actionBox").expand();
		break;
	case "deposit":
		console.log("deposit");
		$w("#pageTitle").text = "Pot Deposit";
		$w("#selectionBox").collapse();
		$w("#withdrawDisplayBox").collapse();
		$w("#depositDisplayBox").expand();
		$w("#autoSortBox").collapse();
		$w("#actionBox").expand();
		break;
	case "sort":
		console.log("sort");
		$w("#pageTitle").text = "Automatic Sort";
		$w("#selectionBox").collapse();
		$w("#withdrawDisplayBox").collapse();
		$w("#depositDisplayBox").collapse();
		$w("#autoSortBox").expand();
		$w("#actionBox").collapse();
		$w("#qqContainer").expand();
		loadAutoSort();
		break;
	default:
		console.log("default");
		$w("#pageTitle").text = "Please select an option!";
		$w("#selectionBox").expand();
		$w("#withdrawDisplayBox").collapse();
		$w("#depositDisplayBox").collapse();
		$w("#autoSortBox").collapse();
		$w("#actionBox").collapse();
	}
}

export function depositButton_click(event) {beginLoad("deposit")}
export function withdrawButton_click(event) {beginLoad("withdraw")}
export function sortButton_click(event) {beginLoad("sort")}

export function actionPot_change(event) {
	switch($w("#actionPot").value) {
	case "Bills":
		console.log("Bills");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_392c30572b3041108a6da291d1af13b6~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_392c30572b3041108a6da291d1af13b6~mv2.png";
		break;
	case "Subscriptions":
	console.log("Subscriptions");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_e3258d5335464d178dc33b4bccddf270~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_e3258d5335464d178dc33b4bccddf270~mv2.png";
		break;
	case "Manual_Subscriptions":
	console.log("Manual Subscriptions");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_a2cef85125184eb6800feccd527e6407~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_a2cef85125184eb6800feccd527e6407~mv2.png";
		break;
	case "Date_Fund":
	console.log("Date Fund");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_0d67e73abb144d81a4d958712d2ee94f~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_0d67e73abb144d81a4d958712d2ee94f~mv2.png";
		break;
	case "Holiday_Fund":
	console.log("Holiday Fund");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_0d67e73abb144d81a4d958712d2ee94f~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_0d67e73abb144d81a4d958712d2ee94f~mv2.png";
		break;
	case "Work_Fund":
	console.log("Work Fund");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_7b5a9957399c4357857dc0a55926aff0~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_7b5a9957399c4357857dc0a55926aff0~mv2.png";
		break;
	case "Food_Fund":
	console.log("Food Fund");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_67f0465b5d774149b3edfcaf265c3c36~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_67f0465b5d774149b3edfcaf265c3c36~mv2.png";
		break;
	case "Spending_Account":
	console.log("Spending Account");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_f065eb4014714a7592766c15aeb2c071~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_f065eb4014714a7592766c15aeb2c071~mv2.png";
		break;
	case "Budgeting_Fund":
	console.log("Budgeting Fund");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_a201039459334e5da07ae5ef6105a3ef~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_a201039459334e5da07ae5ef6105a3ef~mv2.png";
		break;
	case "Weekly_Money_Fund":
	console.log("Weekly Money Fund");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_2c88c8f66029453a93cb7ebbde80c14c~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_2c88c8f66029453a93cb7ebbde80c14c~mv2.png";
		break;
	default:
	console.log("Default: Bills");
		$w("#potImage1").src = "https://static.wixstatic.com/media/4b711c_392c30572b3041108a6da291d1af13b6~mv2.png";
		$w("#potImage2").src = "https://static.wixstatic.com/media/4b711c_392c30572b3041108a6da291d1af13b6~mv2.png";
	}
}

export function actionAmount_change(event) {
	let amountValue = Number($w("#actionAmount").value).toFixed(2);
	$w("#potUpdateAmount1").text = "+£" + amountValue;
	$w("#potUpdateAmount2").text = "-£" + amountValue;
	$w("#potUpdateAmount3").text = "-£" + amountValue;
	$w("#potUpdateAmount4").text = "+£" + amountValue;
}

export function actionButton_click(event) {
	let transactionType = "None";
	let transactionValue = Number(Number($w("#actionAmount").value).toFixed(2));
	if ($w("#actionAmount").value.length > 0) {
		if ($w("#pageTitle").text === "Pot Withdrawal") {
			transactionType = "withdraw_" + $w("#actionPot").value.toLowerCase();
		} else if ($w("#pageTitle").text === "Pot Deposit") {
			transactionType = "deposit_" + $w("#actionPot").value.toLowerCase();
		} else {
			$w("#pageTitle").text = "Something went wrong!";
			console.log("Page titles did not equal expected values.");
			transactionType = "None";
		}
		transact(transactionType, transactionValue)
		.then((response) => {
			if (response === true) {
				console.log("Transaction successful.");
				$w("#pageTitle").text = "Please select an option!";
				$w("#selectionBox").expand();
				$w("#withdrawDisplayBox").collapse();
				$w("#depositDisplayBox").collapse();
				$w("#autoSortBox").collapse();
				$w("#actionBox").collapse();
			} else {
				console.log("Transaction failed.");
			}
		})
		.catch(errormsg => {
			console.log("Transaction failed.");
			console.log(errormsg);
		});
	} else {
		$w("#potUpdateAmount1").text = "Invalid Amount!";
		$w("#potUpdateAmount2").text = "Invalid Amount!";
		$w("#potUpdateAmount3").text = "Invalid Amount!";
		$w("#potUpdateAmount4").text = "Invalid Amount!";
	}
}

export function loadAutoSort() {
	let authCode = pageManager.query.authCode;
	if (authCode === "hidden") {
		memory.setItem("sortStage", "QQ1");
		$w("#qqTitle").text = "Quick Question (1 of 4)";
		$w("#qqQuestion").text = "Would you like to start an AutoSort job?";
		$w("#qqYes").label = "Yes";
		$w("#qqNo").label = "No";
		$w("#qqQuestion").show();
		$w("#qqYes").show();
		$w("#qqNo").show();
		$w("#qqDEQuestion").hide();
		$w("#qqDEInput1").hide();
		$w("#qqDEInput2").hide();
		$w("#qqDEInput3").hide();
		$w("#qqDEInput1Title").hide();
		$w("#qqDEInput2Title").hide();
		$w("#qqDEInput3Title").hide();
		$w("#qqDESubmit").hide();
	} else {
		memory.setItem("sortStage", "QQE");
		$w("#qqTitle").text = "No data was found!";
		$w("#qqQuestion").text = "You need to initiate the sort from the Dashboard Home!";
		$w("#qqYes").label = "Go Home";
		$w("#qqNo").label = "Go Back";
		$w("#qqQuestion").show();
		$w("#qqYes").show();
		$w("#qqNo").show();
		$w("#qqDEQuestion").hide();
		$w("#qqDEInput1").hide();
		$w("#qqDEInput2").hide();
		$w("#qqDEInput3").hide();
		$w("#qqDEInput1Title").hide();
		$w("#qqDEInput2Title").hide();
		$w("#qqDEInput3Title").hide();
		$w("#qqDESubmit").hide();
	}
}

export function qqYes_click(event) {
	let sortStage = memory.getItem("sortStage");
	switch (sortStage) {
	  case "QQ1":
		memory.setItem("sortStage", "QQ2");
		$w("#qqTitle").text = "Quick Question (2 of 4)";
		$w("#qqQuestion").text = "Are you currently in an overdraft?";
		$w("#qqYes").label = "Yes";
		$w("#qqNo").label = "No";
		$w("#qqQuestion").show();
		$w("#qqYes").show();
		$w("#qqNo").show();
		$w("#qqDEQuestion").hide();
		$w("#qqDEInput1").hide();
		$w("#qqDEInput2").hide();
		$w("#qqDEInput3").hide();
		$w("#qqDEInput1Title").hide();
		$w("#qqDEInput2Title").hide();
		$w("#qqDEInput3Title").hide();
		$w("#qqDESubmit").hide();
		break;
	  case "QQ2":
		memory.setItem("sortStage", "QQ2A");
		$w("#qqTitle").text = "Quick Question (2 of 4)";
		$w("#qqQuestion").text = "We won't be able to automatically sort this payment.";
		$w("#qqYes").label = "Okay";
		$w("#qqNo").label = "Go Back";
		$w("#qqQuestion").show();
		$w("#qqYes").show();
		$w("#qqNo").show();
		$w("#qqDEQuestion").hide();
		$w("#qqDEInput1").hide();
		$w("#qqDEInput2").hide();
		$w("#qqDEInput3").hide();
		$w("#qqDEInput1Title").hide();
		$w("#qqDEInput2Title").hide();
		$w("#qqDEInput3Title").hide();
		$w("#qqDESubmit").hide();
		break;
	  case "QQ2A":
		memory.setItem("sortStage", "QQ3");
		memory.setItem("inOverdraft", "true");
		$w("#qqTitle").text = "Quick Question (3 of 4)";
		$w("#qqDEQuestion").text = "Please enter the information below!";
		$w("#qqDESubmit").label = "Continue";
		$w("#qqDEInput1").value = "0.00";
		$w("#qqDEInput2").value = "0.00";
		$w("#qqDEInput3").value = "0.00";
		$w("#qqDEInput1Title").text = "Overdraft Balance";
		$w("#qqDEInput2Title").text = "Amazon Income";
		$w("#qqDEInput3Title").text = "Weekly Money Fund Income";
		$w("#qqQuestion").hide();
		$w("#qqYes").hide();
		$w("#qqNo").hide();
		$w("#qqDEQuestion").show();
		$w("#qqDEInput1").show();
		$w("#qqDEInput2").show();
		$w("#qqDEInput3").show();
		$w("#qqDEInput1Title").show();
		$w("#qqDEInput2Title").show();
		$w("#qqDEInput3Title").show();
		$w("#qqDESubmit").show();
		break;
	  default:
	    pageManager.queryParams.remove(["load", "locationto", "bills", "subscriptions", "manualsubscriptions", "authCode"]);
		pageManager.to("/home");
	}
}

export function qqNo_click(event) {
	let sortStage = memory.getItem("sortStage");
	switch (sortStage) {
	  case "QQ1":
		pageManager.queryParams.remove(["load", "bills", "subscriptions", "manualsubscriptions", "authCode"]);
		pageManager.to("/pot-manager");
		beginLoad();
		break;
	  case "QQ2":
		memory.setItem("sortStage", "QQ3");
		memory.setItem("inOverdraft", "false");
		$w("#qqTitle").text = "Quick Question (3 of 4)";
		$w("#qqDEQuestion").text = "Please enter the information below!";
		$w("#qqDESubmit").label = "Continue";
		$w("#qqDEInput1").value = "0.00";
		$w("#qqDEInput2").value = "0.00";
		$w("#qqDEInput3").value = "0.00";
		$w("#qqDEInput1Title").text = "Monzo Balance";
		$w("#qqDEInput2Title").text = "Amazon Income";
		$w("#qqDEInput3Title").text = "Weekly Money Fund Income";
		$w("#qqQuestion").hide();
		$w("#qqYes").hide();
		$w("#qqNo").hide();
		$w("#qqDEQuestion").show();
		$w("#qqDEInput1").show();
		$w("#qqDEInput2").show();
		$w("#qqDEInput3").show();
		$w("#qqDEInput1Title").show();
		$w("#qqDEInput2Title").show();
		$w("#qqDEInput3Title").show();
		$w("#qqDESubmit").show();
		break;
	  case "QQ2A":
		memory.setItem("sortStage", "QQ2");
		$w("#qqTitle").text = "Quick Question (2 of 4)";
		$w("#qqQuestion").text = "Are you currently in an overdraft?";
		$w("#qqYes").label = "Yes";
		$w("#qqNo").label = "No";
		$w("#qqQuestion").show();
		$w("#qqYes").show();
		$w("#qqNo").show();
		$w("#qqDEQuestion").hide();
		$w("#qqDEInput1").hide();
		$w("#qqDEInput2").hide();
		$w("#qqDEInput3").hide();
		$w("#qqDEInput1Title").hide();
		$w("#qqDEInput2Title").hide();
		$w("#qqDEInput3Title").hide();
		$w("#qqDESubmit").hide();
		break;
	  default:
	    pageManager.queryParams.remove(["load", "locationto", "bills", "subscriptions", "manualsubscriptions", "authCode"]);
		pageManager.to("/pot-manager");
		beginLoad();
	}
}

export function qqDESubmit_click(event) {
let sortStage = memory.getItem("sortStage");
	switch (sortStage) {
	  case "QQ3":
		memory.setItem("sortStage", "QQ4");
		memory.setItem("jobIncome", $w("#qqDEInput2").value);
		memory.setItem("wmfIncome", $w("#qqDEInput3").value);
		if (String(memory.getItem("inOverdraft")) === "true") {
			memory.setItem("monzoBalance", "-" + $w("#qqDEInput1").value);
		} else {
			memory.setItem("monzoBalance", $w("#qqDEInput1").value);
		}
		$w("#qqTitle").text = "Quick Question (4 of 4)";
		$w("#qqDEQuestion").text = "Please enter the information below!";
		$w("#qqDESubmit").label = "Continue";
		$w("#qqDEInput1").value = pageManager.query.prefillbills;
		$w("#qqDEInput2").value = pageManager.query.prefillsubscriptions;
		$w("#qqDEInput3").value = pageManager.query.prefillmanualsubscriptions;
		$w("#qqDEInput1Title").text = "Bills Balance";
		$w("#qqDEInput2Title").text = "Subscriptions Balance";
		$w("#qqDEInput3Title").text = "Manual Subscriptions Balance";
		$w("#qqQuestion").hide();
		$w("#qqYes").hide();
		$w("#qqNo").hide();
		$w("#qqDEQuestion").show();
		$w("#qqDEInput1").show();
		$w("#qqDEInput2").show();
		$w("#qqDEInput3").show();
		$w("#qqDEInput1Title").show();
		$w("#qqDEInput2Title").show();
		$w("#qqDEInput3Title").show();
		$w("#qqDESubmit").show();
		break;
	  case "QQ4":
		memory.setItem("sortStage", "userSelect");
		memory.setItem("currentBills", $w("#qqDEInput1").value);
		memory.setItem("currentSubscriptions", $w("#qqDEInput2").value);
		memory.setItem("currentManualSubscriptions", $w("#qqDEInput3").value);
		$w("#qqTitle").text = "Please wait...";
		$w("#qqQuestion").text = "Working out the best options...";
		$w("#qqQuestion").show();
		$w("#qqYes").hide();
		$w("#qqNo").hide();
		$w("#qqDEQuestion").hide();
		$w("#qqDEInput1").hide();
		$w("#qqDEInput2").hide();
		$w("#qqDEInput3").hide();
		$w("#qqDEInput1Title").hide();
		$w("#qqDEInput2Title").hide();
		$w("#qqDEInput3Title").hide();
		$w("#qqDESubmit").hide();
		loadUserSelect();
		break;
	  default:
	    console.log("Something went wrong... default option was chosen on Submit/Continue.");
	}
}

export function loadUserSelect() {
	let pulledData = {
		"inOverdraft": String(memory.getItem("inOverdraft")),
		"monzoBalance": Number(memory.getItem("monzoBalance")),
		"jobIncome": Number(memory.getItem("jobIncome")),
		"wmfIncome": Number(memory.getItem("wmfIncome")),
		"totalIncome": Number(memory.getItem("wmfIncome")) + Number(memory.getItem("jobIncome")) + Number(memory.getItem("monzoBalance")),
		"currentBills": Number(memory.getItem("currentBills")),
		"currentSubscriptions": Number(memory.getItem("currentSubscriptions")),
		"currentManualSubscriptions": Number(memory.getItem("currentManualSubscriptions")),
		"requestedBills": Number(pageManager.query.bills),
		"requestedSubscriptions": Number(pageManager.query.subscriptions),
		"requestedManualSubscriptions": Number(pageManager.query.manualsubscriptions),
		"locationTo": String(pageManager.query.locationTo)
	}
	pulledData.toBills = Number((pulledData.requestedBills - pulledData.currentBills).toFixed(2));
	pulledData.toSubscriptions = Number((pulledData.requestedSubscriptions - pulledData.currentSubscriptions).toFixed(2));
	pulledData.toManualSubscriptions = Number((pulledData.requestedManualSubscriptions - pulledData.currentManualSubscriptions).toFixed(2));
	pulledData.totalDeductions = Number((pulledData.toBills + pulledData.toSubscriptions + pulledData.toManualSubscriptions).toFixed(2));
	pulledData.totalRemaining = Number(pulledData.totalIncome - pulledData.totalDeductions);

	if (pulledData.inOverdraft === "true") {
		$w("#sortItButton").hide();
	} else {
		$w("#sortItButton").show();
	}

	let repeaterData = [
	{
		"_id": "0",
		"image": "https://static.wixstatic.com/media/4b711c_2c88c8f66029453a93cb7ebbde80c14c~mv2.png",
		"title": "Weekly Money Fund",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "weekly_money_fund"
	},
	{
		"_id": "1",
		"image": "https://static.wixstatic.com/media/4b711c_392c30572b3041108a6da291d1af13b6~mv2.png",
		"title": "Bills",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "bills"
	},
	{
		"_id": "2",
		"image": "https://static.wixstatic.com/media/4b711c_e3258d5335464d178dc33b4bccddf270~mv2.png",
		"title": "Subscriptions",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "subscriptions"
	},
	{
		"_id": "3",
		"image": "https://static.wixstatic.com/media/4b711c_a2cef85125184eb6800feccd527e6407~mv2.png",
		"title": "Manual Subscriptions",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "manual_subscriptions"
	},
	{
		"_id": "4",
		"image": "https://static.wixstatic.com/media/4b711c_bb24bff2d531446bb7f10f4f2377f302~mv2.png",
		"title": "On Hold",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "on_hold"
	},
	{
		"_id": "5",
		"image": "https://static.wixstatic.com/media/4b711c_7b5a9957399c4357857dc0a55926aff0~mv2.png",
		"title": "Work Fund",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "work_fund"
	},
	{
		"_id": "6",
		"image": "https://static.wixstatic.com/media/4b711c_67f0465b5d774149b3edfcaf265c3c36~mv2.png",
		"title": "Food Fund",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "food_fund"
	},
	{
		"_id": "7",
		"image": "https://static.wixstatic.com/media/4b711c_9959309b591d4686bb74104107b8f9b3~mv2.png",
		"title": "Spare Money",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "spare_money"
	},
	{
		"_id": "8",
		"image": "https://static.wixstatic.com/media/4b711c_0d67e73abb144d81a4d958712d2ee94f~mv2.png",
		"title": "Date Fund",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "date_fund"
	},
	{
		"_id": "9",
		"image": "https://static.wixstatic.com/media/4b711c_0d67e73abb144d81a4d958712d2ee94f~mv2.png",
		"title": "Holiday Fund",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "holiday_fund"
	},
	{
		"_id": "10",
		"image": "https://static.wixstatic.com/media/4b711c_f065eb4014714a7592766c15aeb2c071~mv2.png",
		"title": "Spending Account",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "spending_account"
	},
	{
		"_id": "11",
		"image": "https://static.wixstatic.com/media/4b711c_a201039459334e5da07ae5ef6105a3ef~mv2.png",
		"title": "Budgeting Fund",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "budgeting_fund"
	},
	{
		"_id": "12",
		"image": "https://static.wixstatic.com/media/4b711c_9128405f297c44f0ab1048fb3a221627~mv2.png",
		"title": "Savings",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "savings"
	},
	{
		"_id": "13",
		"image": "https://static.wixstatic.com/media/4b711c_4b6681f21b574ad39b651d8c626e7c35~mv2.png",
		"title": "Rainy Day Fund",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "rainy_day_fund"
	},
	{
		"_id": "14",
		"image": "https://static.wixstatic.com/media/4b711c_205253e52ee34e4dbb839c1a426672be~mv2.png",
		"title": "Capital One",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "reject"
	},
	{
		"_id": "15",
		"image": "https://static.wixstatic.com/media/4b711c_38368b2baa0448c193dd0c6000f20861~mv2.png",
		"title": "Aqua",
		"action": "none",
		"amount": 0,
		"system_recommends": 0,
		"expression": "",
		"transactionType": "reject"
	}
	]

	repeaterData[1].expression = "£" + pulledData.requestedBills.toFixed(2) + " - £" + pulledData.currentBills.toFixed(2) + " = £" + pulledData.toBills.toFixed(2);
	repeaterData[2].expression = "£" + pulledData.requestedSubscriptions.toFixed(2) + " - £" + pulledData.currentSubscriptions.toFixed(2) + " = £" + pulledData.toSubscriptions.toFixed(2);
	repeaterData[3].expression = "£" + pulledData.requestedManualSubscriptions.toFixed(2) + " - £" + pulledData.currentManualSubscriptions.toFixed(2) + " = £" + pulledData.toManualSubscriptions.toFixed(2);

	if (pulledData.wmfIncome > 0) {
		repeaterData[0].action = "withdraw";
		repeaterData[0].amount = pulledData.wmfIncome;
	}
	if (pulledData.toBills > 0) {
		repeaterData[1].action = "deposit";
		repeaterData[1].amount = pulledData.toBills;
	}
	if (pulledData.toSubscriptions > 0) {
		repeaterData[2].action = "deposit";
		repeaterData[2].amount = pulledData.toSubscriptions;
	}
	if (pulledData.toManualSubscriptions > 0) {
		repeaterData[3].action = "deposit";
		repeaterData[3].amount = pulledData.toManualSubscriptions;
	}

	let toUse = Number(pulledData.totalRemaining);
	console.log(toUse);

		/*
		ID:  0 = Weekly Money Fund
		ID:  1 = Bills
		ID:  2 = Subscriptions
		ID:  3 = Manual Subscriptions
		ID:  4 = On Hold
		ID:  5 = Work Fund
		ID:  6 = Food Fund
		ID:  7 = Spare Money
		ID:  8 = Date Fund
		ID:  9 = Holiday Fund
		ID: 10 = Spending Account
		ID: 11 = Budgeting Fund
		ID: 12 = Savings
		ID: 13 = Rainy Day Fund
		ID: 14 = Capital One
		ID: 15 = Aqua Card
		*/
	
	if (toUse < 0) {
		// Less than 0
	} else if (toUse >= 0 && toUse < 50) {
		// Between 0 and 50
		repeaterData[15].action = "deposit"; // Aqua Card
		repeaterData[15].amount = toUse;
		repeaterData[15].expression = "Lowest Debt Repayment";
	} else if (toUse >= 50 && toUse < 128) {
		// Between 50 and 128
		repeaterData[15].action = "deposit"; // Aqua Card
		repeaterData[15].amount = 50;
		repeaterData[15].expression = "Standard Debt Repayment";
	} else if (toUse >= 128 && toUse < 150.50) {
		// Between 128 and 150.50
		repeaterData[15].action = "deposit"; // Aqua Card
		repeaterData[15].amount = 50.00;
		repeaterData[15].expression = "Standard Debt Repayment";
		repeaterData[5].action = "deposit"; // Work Fund (Money for buses/travel)
		repeaterData[5].amount = 48.00;
		repeaterData[5].expression = "4 days of travel (4 * £12.00)";
		repeaterData[6].action = "deposit"; // Food Fund
		repeaterData[6].amount = 30.00;
		repeaterData[6].expression = "4 days of food at work (4 * £7.50)";
	} else if (toUse >= 150.5 && toUse < 180.5) {
		// Between 150.50 and 180.50
		repeaterData[15].action = "deposit"; // Aqua Card
		repeaterData[15].amount = 50.00;
		repeaterData[15].expression = "Standard Debt Repayment";
		repeaterData[5].action = "deposit"; // Work Fund (Money for buses/travel)
		repeaterData[5].amount = 48.00;
		repeaterData[5].expression = "4 days of travel (4 * £12.00)";
		repeaterData[6].action = "deposit"; // Food Fund
		repeaterData[6].amount = 30.00;
		repeaterData[6].expression = "4 days of food at work (4 * £7.50)";
		repeaterData[7].action = "deposit"; // Spare Money Fund
		repeaterData[7].amount = 22.50;
		repeaterData[7].expression = "3 days of food at home (3 * £7.50)";
	} else if (toUse >= 180.5 && toUse < 213) {
		// Between 180.50 and 213
		repeaterData[15].action = "deposit"; // Aqua Card
		repeaterData[15].amount = 50.00;
		repeaterData[15].expression = "Standard Debt Repayment";
		repeaterData[5].action = "deposit"; // Work Fund (Money for buses/travel)
		repeaterData[5].amount = 48.00;
		repeaterData[5].expression = "4 days of travel (4 * £12.00)";
		repeaterData[6].action = "deposit"; // Food Fund
		repeaterData[6].amount = 30.00;
		repeaterData[6].expression = "4 days of food at work (4 * £7.50)";
		repeaterData[7].action = "deposit"; // Spare Money Fund
		repeaterData[7].amount = 22.50;
		repeaterData[7].expression = "3 days of food at home (3 * £7.50)";
		repeaterData[8].action = "deposit"; // Date Fund
		repeaterData[8].amount = 30.00;
		repeaterData[8].expression = "Lowest Date Amount";
	} else if (toUse >= 213 && toUse < 233) {
		// Between 213 and 233
		repeaterData[15].action = "deposit"; // Aqua Card
		repeaterData[15].amount = 50.00;
		repeaterData[15].expression = "Standard Debt Repayment";
		repeaterData[5].action = "deposit"; // Work Fund (Money for buses/travel)
		repeaterData[5].amount = 48.00;
		repeaterData[5].expression = "4 days of travel (4 * £12.00)";
		repeaterData[6].action = "deposit"; // Food Fund
		repeaterData[6].amount = 40.00;
		repeaterData[6].expression = "4 days of food at work (4 * £10.00)";
		repeaterData[7].action = "deposit"; // Spare Money Fund
		repeaterData[7].amount = 45.00;
		repeaterData[7].expression = "3 days of food at home (3 * £15.00)";
		repeaterData[8].action = "deposit"; // Date Fund
		repeaterData[8].amount = 30.00;
		repeaterData[8].expression = "Lowest Date Amount";
	} else if (toUse >= 233 && toUse < 250) {
		// Between 233 and 250
		repeaterData[15].action = "deposit"; // Aqua Card
		repeaterData[15].amount = 50.00;
		repeaterData[15].expression = "Standard Debt Repayment";
		repeaterData[5].action = "deposit"; // Work Fund (Money for buses/travel)
		repeaterData[5].amount = 48.00;
		repeaterData[5].expression = "4 days of travel (4 * £12.00)";
		repeaterData[6].action = "deposit"; // Food Fund
		repeaterData[6].amount = 40.00;
		repeaterData[6].expression = "4 days of food at work (4 * £10.00)";
		repeaterData[7].action = "deposit"; // Spare Money Fund
		repeaterData[7].amount = 45.00;
		repeaterData[7].expression = "3 days of food at home (3 * £15.00)";
		repeaterData[8].action = "deposit"; // Date Fund
		repeaterData[8].amount = 50.00;
		repeaterData[8].expression = "Standard Date Amount";
	} else if (toUse >= 250) {
		// Greater than 250
		repeaterData[15].action = "deposit"; // Aqua Card
		repeaterData[15].amount = 50;
		repeaterData[15].expression = "Standard Debt Repayment";
		repeaterData[5].action = "deposit"; // Work Fund (Money for buses/travel)
		repeaterData[5].amount = 48;
		repeaterData[5].expression = "4 days of travel (4 * £12.00)";
		repeaterData[6].action = "deposit"; // Food Fund
		repeaterData[6].amount = 40;
		repeaterData[6].expression = "4 days of food at work (4 * £10.00)";
		repeaterData[7].action = "deposit"; // Spare Money Fund
		repeaterData[7].amount = 45;
		repeaterData[7].expression = "3 days of food at home (3 * £15.00)";
		repeaterData[8].action = "deposit"; // Date Fund
		repeaterData[8].amount = 50;
		repeaterData[8].expression = "Standard Date Amount";
		toUse = toUse - 233;
		repeaterData[12].action = "deposit"; // Savings
		repeaterData[12].amount = (toUse * 0.30);
		repeaterData[12].expression = "30% of Remaining amount (£" + toUse.toFixed(2) + ")";
		repeaterData[13].action = "deposit"; // Rainy Day Fund
		repeaterData[13].amount = (toUse * 0.35);
		repeaterData[13].expression = "35% of Remaining amount (£" + toUse.toFixed(2) + ")";
	} else {
		// Something went wrong.
		console.log("Conditions were not met [ERR]");
	}

	$w("#usRepeater").data = repeaterData;

	$w("#usRepeater").forEachItem(($item, itemData, index) => {
		$item("#usPotTitle").text = itemData.title;
		$item("#usPotImg").src = itemData.image;
		$item("#usAction").value = itemData.action;
		$item("#usAmount").value = itemData.amount.toFixed(2);
		$item("#usPotCalc").text = itemData.expression;
		if (itemData.amount <= 0) {
			$item("#usSystemRecommend").hide();
		}
		if (itemData.action === "withdraw") {
			$item("#usDepositText").hide();
			$item("#usWithdrawText").show();
			$item("#usWithdrawText").text = "+" + itemData.amount.toFixed(2);
			$item("#usSystemRecommend").text = "Recommended: Withdraw £" + itemData.amount.toFixed(2);
		} else if (itemData.action === "deposit") {
			$item("#usWithdrawText").hide();
			$item("#usDepositText").show();
			$item("#usDepositText").text = itemData.amount.toFixed(2);
			$item("#usSystemRecommend").text = "Recommended: Deposit £" + itemData.amount.toFixed(2);
		} else {
			$item("#usWithdrawText").hide();
			$item("#usDepositText").show();
			$item("#usDepositText").text = "-";
		}
	});
	runAmountRemaining();

	$w("#userSelectBox").expand();
	$w("#qqContainer").collapse();
}

export function runAmountRemaining() {
	let sumup = Number(memory.getItem("monzoBalance")) + Number(memory.getItem("jobIncome"));
	$w("#usRepeater").forEachItem(($item, itemData, index) => {
		if (Number($item("#usAmount").value) > 0) {
			if ($item("#usAction").value === "withdraw") {
				sumup = sumup + Number($item("#usAmount").value);
			} else if ($item("#usAction").value === "deposit") {
				sumup = sumup - Number($item("#usAmount").value);
			} else {
				//
			}
		}
	});
	$w("#usRemainingText").text = "Remaining: £" + sumup.toFixed(2);
}

export function updateItem(event, $item) {
	if ($item("#usAction").value === "withdraw" && Number($item("#usAmount").value) > 0) {
		$item("#usDepositText").hide();
		$item("#usWithdrawText").show();
		$item("#usWithdrawText").text = "+" + Number($item("#usAmount").value).toFixed(2);
	} else if ($item("#usAction").value === "deposit" && Number($item("#usAmount").value) > 0) {
		$item("#usWithdrawText").hide();
		$item("#usDepositText").show();
		$item("#usDepositText").text = Number($item("#usAmount").value).toFixed(2);
	} else {
		$item("#usWithdrawText").hide();
		$item("#usDepositText").show();
		$item("#usDepositText").text = "-";
	}
	runAmountRemaining();
}

export function sortItButton_click(event) {
	$w("#page1").scrollTo();
	$w("#animationBox").expand();
	$w("#userSelectBox").collapse();
	$w("#qqContainer").collapse();
	$w("#animationBoxAction").text = "Creating a list of transfers.";
	let actionList = [];
	$w("#usRepeater").forEachItem(($item, itemData, index) => {
		let toPush = null;
		if (Number($item("#usAmount").value) > 0 && itemData.title !== "Capital One" && itemData.title !== "Aqua") {
			if ($item("#usAction").value === "withdraw") {
				toPush = {"transactionType": "withdraw_" + itemData.transactionType, "description": "Withdrawing £" + Number($item("#usAmount").value).toFixed(2) + " from " + itemData.title, "amount": Number(Number($item("#usAmount").value).toFixed(2))};
				actionList.push(toPush);
			} else if ($item("#usAction").value === "deposit") {
				toPush = {"transactionType": "deposit_" + itemData.transactionType, "description": "Depositing £" + Number($item("#usAmount").value).toFixed(2) + " to " + itemData.title, "amount": Number(Number($item("#usAmount").value).toFixed(2))};
				actionList.push(toPush);
			} else {
				//
			}
		} else if (itemData.title === "Aqua") {
			$w("#aquaRepayAmount").text = "£" + String(Number($item("#usAmount").value).toFixed(2));
		}
	});
	$w("#animationBoxAction").text = "Gathering Pot Information...";
	if (actionList.length > 0) { // Is there at least 1 item?
		setTimeout(() => {
			transactEachPot(actionList[0]);
		}, 2500);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 2500);
	}
	if (actionList.length > 1) { // Is there at least 2 items?
		setTimeout(() => {
			transactEachPot(actionList[1]);
		}, 5000);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 7500);
	}
	if (actionList.length > 2) { // Is there at least 3 items?
		setTimeout(() => {
			transactEachPot(actionList[2]);
		}, 7500);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 10000);
	}
	if (actionList.length > 3) { // Is there at least 4 item?
		setTimeout(() => {
			transactEachPot(actionList[3]);
		}, 10000);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 12500);
	}
	if (actionList.length > 4) { // Is there at least 5 items?
		setTimeout(() => {
			transactEachPot(actionList[4]);
		}, 12500);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 15000);
	}
	if (actionList.length > 5) { // Is there at least 6 items?
		setTimeout(() => {
			transactEachPot(actionList[5]);
		}, 15000);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 17500);
	}
	if (actionList.length > 6) { // Is there at least 7 item?
		setTimeout(() => {
			transactEachPot(actionList[6]);
		}, 17500);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 20000);
	}
	if (actionList.length > 7) { // Is there at least 8 items?
		setTimeout(() => {
			transactEachPot(actionList[7]);
		}, 20000);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 22500);
	}
	if (actionList.length > 8) { // Is there at least 9 items?
		setTimeout(() => {
			transactEachPot(actionList[8]);
		}, 22500);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 25000);
	}
	if (actionList.length > 9) { // Is there at least 10 item?
		setTimeout(() => {
			transactEachPot(actionList[9]);
		}, 25000);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 27500);
	}
	if (actionList.length > 10) { // Is there at least 11 items?
		setTimeout(() => {
			transactEachPot(actionList[10]);
		}, 27500);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 30000);
	}
	if (actionList.length > 11) { // Is there at least 12 items?
		setTimeout(() => {
			transactEachPot(actionList[11]);
		}, 30000);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 32500);
	}
	if (actionList.length > 12) { // Is there at least 13 items?
		setTimeout(() => {
			transactEachPot(actionList[12]);
		}, 32500);
	} else {
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 35000);
	}
	if (actionList.length > 13) { // Is there at least 14 items?
		setTimeout(() => {
			transactEachPot(actionList[13]);
		}, 35000);
		setTimeout(() => {
			aquaTransfer(actionList);
		}, 37500);
	}
}

export function transactEachPot(currentItem) {
	$w("#animationBoxAction").text = currentItem.description;
	transact(currentItem.transactionType, currentItem.amount)
	.then((response) => {
		if (response === true) {
			console.log("Transaction successful (£" + currentItem.amount + " to " + currentItem.transactionType + ").");
		} else {
			console.log("Transaction failed (£" + currentItem.amount + " to " + currentItem.transactionType + ").");
		}
	})
	.catch(errormsg => {
		console.log("Transaction failed (£" + currentItem.amount + " to " + currentItem.transactionType + ").");
		console.log(errormsg);
	});
}

export function aquaTransfer(actionList) {
	$w("#animationBoxTitle").text = "Money has been sorted";
	$w("#animationBoxAction").text = "All transactions have complete! (" + actionList.length + " transactions)";
	$w("#animationBoxAnimation").hide();
	memory.setItem("actionList", String(actionList));
	setTimeout(() => {
		$w("#animationBox").collapse();
		$w("#aquaBox").expand();
	}, 2500);
}

export function completeAqua_click(event) {
	let queryString = "/home?updateFinances=true";
	// This currently tells the home page to update its finance information after the sort, but in next update it needs to know exactly what has happened in order to be accurate.
	pageManager.to(queryString);
}
