// A backend module, which creates a new week every week (called by a job scheduler).
// Also receives updates hrough webhooks (from my phone), to set actual clock in / out times, or shift statuses (Not Started, In Progress, Completed)

import dataManager from 'wix-data';

export function createNew() {
    return dataManager.query("shiftData")
	  .descending("dataNum")
	  .limit(1)
	  .find()
	  .then((SDResults) => {
	  	if (SDResults.items.length > 0) {
			// Items have been found!
			let dataNum = Number(SDResults.items[0].dataNum) + 1;
			
			let date = new Date(SDResults.items[0].endDate);
			let mondayDate =  new Date(SDResults.items[0].endDate);
			let tuesdayDate = new Date(date.setDate(date.getDate() + 1));
			let wednesdayDate = new Date(date.setDate(date.getDate() + 1));
			let thursdayDate = new Date(date.setDate(date.getDate() + 1));
			let fridayDate = new Date(date.setDate(date.getDate() + 1));
			let saturdayDate = new Date(date.setDate(date.getDate() + 1));
			let sundayDate = new Date(date.setDate(date.getDate() + 1));
			let endDate = new Date(date.setDate(date.getDate() + 1));
			let beginDate = mondayDate;
			let MondayReminder = {
				"ALLDAY":                                              false,
				"START_TIME":                                        "18:00",
				"END_TIME":                                          "18:15",
				"TITLE":                                     "Take Bins Out",
				"DESCRIPTION": "See which bins via the Dashboard Home page.",
				"URL":                                               "/home",
				"_id":                                                   "0"
			};
			
			let blankData = [
			  {
				"_id":                    "0",
				"DAY":               "Monday",
				"DATE":            mondayDate,
				"ROTA_working_query":   false,
				"ROTA_working_time":       "",
				"ROTA_start_time":       null,
				"ROTA_end_time":         null,
				"ROTA_time_scheduled":      0,
				"ACTUAL_working_query": false,
				"ACTUAL_working_time":     "",
				"ACTUAL_start_time":     null,
				"ACTUAL_end_time":       null,
				"ACTUAL_time_scheduled":    0,
				"MYJDW_net_punched":        0,
				"SHIFT_status":          "NS",
				"EVENTS":                  [],
				"REMINDERS": [MondayReminder],
				"HOLIDAY":              false
			  },
			  {
				"_id":                    "1",
				"DAY":              "Tuesday",
				"DATE":           tuesdayDate,
				"ROTA_working_query":   false,
				"ROTA_working_time":       "",
				"ROTA_start_time":       null,
				"ROTA_end_time":         null,
				"ROTA_time_scheduled":      0,
				"ACTUAL_working_query": false,
				"ACTUAL_working_time":     "",
				"ACTUAL_start_time":     null,
				"ACTUAL_end_time":       null,
				"ACTUAL_time_scheduled":    0,
				"MYJDW_net_punched":        0,
				"SHIFT_status":          "NS",
				"EVENTS":                  [],
				"REMINDERS":               [],
				"HOLIDAY":              false
			  },
			  {
				"_id":                    "2",
				"DAY":            "Wednesday",
				"DATE":         wednesdayDate,
				"ROTA_working_query":   false,
				"ROTA_working_time":       "",
				"ROTA_start_time":       null,
				"ROTA_end_time":         null,
				"ROTA_time_scheduled":      0,
				"ACTUAL_working_query": false,
				"ACTUAL_working_time":     "",
				"ACTUAL_start_time":     null,
				"ACTUAL_end_time":       null,
				"ACTUAL_time_scheduled":    0,
				"MYJDW_net_punched":        0,
				"SHIFT_status":          "NS",
				"EVENTS":                  [],
				"REMINDERS":               [],
				"HOLIDAY":              false
			  },
			  {
				"_id":                    "3",
				"DAY":             "Thursday",
				"DATE":          thursdayDate,
				"ROTA_working_query":   false,
				"ROTA_working_time":       "",
				"ROTA_start_time":       null,
				"ROTA_end_time":         null,
				"ROTA_time_scheduled":      0,
				"ACTUAL_working_query": false,
				"ACTUAL_working_time":     "",
				"ACTUAL_start_time":     null,
				"ACTUAL_end_time":       null,
				"ACTUAL_time_scheduled":    0,
				"MYJDW_net_punched":        0,
				"SHIFT_status":          "NS",
				"EVENTS":                  [],
				"REMINDERS":               [],
				"HOLIDAY":              false
			  },
			  {
				"_id":                    "4",
				"DAY":               "Friday",
				"DATE":            fridayDate,
				"ROTA_working_query":   false,
				"ROTA_working_time":       "",
				"ROTA_start_time":       null,
				"ROTA_end_time":         null,
				"ROTA_time_scheduled":      0,
				"ACTUAL_working_query": false,
				"ACTUAL_working_time":     "",
				"ACTUAL_start_time":     null,
				"ACTUAL_end_time":       null,
				"ACTUAL_time_scheduled":    0,
				"MYJDW_net_punched":        0,
				"SHIFT_status":          "NS",
				"EVENTS":                  [],
				"REMINDERS":               [],
				"HOLIDAY":              false
			  },
			  {
				"_id":                    "5",
				"DAY":             "Saturday",
				"DATE":          saturdayDate,
				"ROTA_working_query":   false,
				"ROTA_working_time":       "",
				"ROTA_start_time":       null,
				"ROTA_end_time":         null,
				"ROTA_time_scheduled":      0,
				"ACTUAL_working_query": false,
				"ACTUAL_working_time":     "",
				"ACTUAL_start_time":     null,
				"ACTUAL_end_time":       null,
				"ACTUAL_time_scheduled":    0,
				"MYJDW_net_punched":        0,
				"SHIFT_status":          "NS",
				"EVENTS":                  [],
				"REMINDERS":               [],
				"HOLIDAY":              false
			  },
			  {
				"_id":                    "6",
				"DAY":               "Sunday",
				"DATE":            sundayDate,
				"ROTA_working_query":   false,
				"ROTA_working_time":       "",
				"ROTA_start_time":       null,
				"ROTA_end_time":         null,
				"ROTA_time_scheduled":      0,
				"ACTUAL_working_query": false,
				"ACTUAL_working_time":     "",
				"ACTUAL_start_time":     null,
				"ACTUAL_end_time":       null,
				"ACTUAL_time_scheduled":    0,
				"MYJDW_net_punched":        0,
				"SHIFT_status":          "NS",
				"EVENTS":                  [],
				"REMINDERS":               [],
				"HOLIDAY":              false
			  }
			];

			let toInsert = {
			  "null":             "",
			  "dataNum":     dataNum,
			  "beginDate": beginDate,
			  "endDate":     endDate,
			  "shiftData": blankData,
			  "version":        "v2"
			};
			
			dataManager.insert("shiftData", toInsert)
			.then((createdItem) => {
				console.log("(ST) Week (with dataNum: " + createdItem.dataNum + ") has been created.");
				return "Complete";
			})
			.catch((err) => {
				console.log("(ST) " + err);
				return err;
			});
			
		} else {
			console.log("(ST) No items found in shiftData. Initial data required.");
			return "No existing items.";
		}
	  })
	  .catch((BCErrorMsg) => {
		// Something went wrong with the query
		console.log("(ST) " + BCErrorMsg);
		return BCErrorMsg;
	  });
}

export function updateExisting(body) {
	// Update a weeks data with new data
	console.log("updateExisting has been run.");
	
	let useData = {
		"inDate": new Date(body.inDate),
		"outDate": new Date(body.outDate),
		"inTime": String(body.inTime),
		"outTime": String(body.outTime)
	}

	dataManager.query("shiftData")
	  .ge("endDate", useData.inDate)
	  .le("beginDate", useData.inDate)
	  .ascending("dataNum")
	  .limit(1)
	  .find()
	  .then((STResults) => {
	  	if (STResults.items.length > 0) {
			// Found the current week.
			let dayID = null;
			switch(useData.inDate.getDay()) {
			case 0:
				// Sunday
				dayID = 6;
				break;
			case 1:
				// Monday
				dayID = 0;
				break;
			case 2:
				// Tuesday
				dayID = 1;
				break;
			case 3:
				// Wednesday
				dayID = 2;
				break;
			case 4:
				// Thursday
				dayID = 3;
				break;
			case 5:
				// Friday
				dayID = 4;
				break;
			case 6:
				// Saturday
				dayID = 5;
				break;
			}
			console.log("Week found with dataNum #" + STResults.items[0].dataNum);
			console.log("The day of the item is #" + dayID);

			let weekData = STResults.items[0];

			let hoursActualInMS = useData.outDate.getTime() - useData.inDate.getTime();
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

			weekData.shiftData[dayID].SHIFT_status = "C";
			weekData.shiftData[dayID].ACTUAL_working_time = String(useData.inTime + " - " + useData.outTime);
			weekData.shiftData[dayID].ACTUAL_start_time = useData.inDate;
			weekData.shiftData[dayID].ACTUAL_end_time = useData.outDate;
			weekData.shiftData[dayID].ACTUAL_working_query = true;
			weekData.shiftData[dayID].ACTUAL_time_scheduled = adjustedHoursActual;

			if (useData.outDate.getHours() < 5) {
				// Work out Enhanced O
				let midnight = new Date(weekData.shiftData[dayID].DATE);
				midnight.setDate(midnight.getDate() + 1);
				midnight.setHours(0, 0);
				let EOInMS = useData.outDate.getTime() - midnight.getTime();
				let EOActual = EOInMS / (1000 * 3600);
				weekData.shiftData[dayID].ACTUAL_EO = EOActual;
			} else {
				// Set Enhanced O to zero
				weekData.shiftData[dayID].ACTUAL_EO = 0;
			}

			dataManager.update("shiftData", weekData)
			.then((returned) => {
				console.log("Updated item successfully!");
				console.log(returned);
			})
			.catch((errmsg) => {
				console.log("Something went wrong when updating data.");
				console.log(errmsg);
			});
		} else {
			// Could not find the current week.
			console.log("Current week could not be found, can't do anything with the data.");
		}
	  })
	  .catch ((INTSTErrorMsg) => {
		// Something went wrong with the query.
		console.log("Current week could not be found, can't do anything with the data.");
		console.log(INTSTErrorMsg);
	  });
}

export function updateStatus(body) {
	// Update a weeks data with new data
	console.log("updateStatus has been run.");
	
	let useData = {
		"inDate": new Date(body.inDate),
		"status":   String(body.status)
	}

	dataManager.query("shiftData")
	  .ge("endDate", useData.inDate)
	  .le("beginDate", useData.inDate)
	  .ascending("dataNum")
	  .limit(1)
	  .find()
	  .then((STResults) => {
	  	if (STResults.items.length > 0) {
			// Found the current week.
			let dayID = null;
			switch(useData.inDate.getDay()) {
			case 0:
				// Sunday
				dayID = 6;
				break;
			case 1:
				// Monday
				dayID = 0;
				break;
			case 2:
				// Tuesday
				dayID = 1;
				break;
			case 3:
				// Wednesday
				dayID = 2;
				break;
			case 4:
				// Thursday
				dayID = 3;
				break;
			case 5:
				// Friday
				dayID = 4;
				break;
			case 6:
				// Saturday
				dayID = 5;
				break;
			}
			console.log("Week found with dataNum #" + STResults.items[0].dataNum);
			console.log("The day of the item is #" + dayID);

			let weekData = STResults.items[0];

			if (weekData.shiftData[dayID].SHIFT_status !== "C") {
				weekData.shiftData[dayID].SHIFT_status = useData.status;

				dataManager.update("shiftData", weekData)
				.then((returned) => {
					console.log("Updated item successfully!");
					console.log(returned);
				})
				.catch((errmsg) => {
					console.log("Something went wrong when updating data.");
					console.log(errmsg);
				});
			}
		} else {
			// Could not find the current week.
			console.log("Current week could not be found, can't do anything with the data.");
		}
	  })
	  .catch ((INTSTErrorMsg) => {
		// Something went wrong with the query.
		console.log("Current week could not be found, can't do anything with the data.");
		console.log(INTSTErrorMsg);
	  });
}
