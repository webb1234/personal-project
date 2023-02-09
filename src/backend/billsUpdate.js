// Updates bill information when called by the Home page.

import dataManager from 'wix-data';

export function updateBill(bill_ID, action) {
    return dataManager.query("Bills")
      .eq("_id", bill_ID)
      .limit(1)
      .find()
      .then((resultsV1) => {
        let itemData = resultsV1.items[0];
        let date1 = new Date(itemData.date);
        let NEWdate1 = new Date(date1.setMonth(date1.getMonth() + 1));
        NEWdate1.setHours(0, 0, 0);
        NEWdate1.setDate(date1.getDate());
        let date2 = new Date(itemData.lastPayDate);
        let weeks4 = new Date(date2.setDate(date2.getDate() + 28));
        let weeks5 = new Date(date2.setDate(date2.getDate() + 7));
        let NEWdate2 = weeks4;
          if (NEWdate1 > weeks5) {
            NEWdate2 = weeks5;
          } else {
            NEWdate2 = weeks4;
          }
          NEWdate2.setHours(15, 0, 0);
        switch(action) {
        case "add":
            if (itemData.weeksComplete !== itemData.weekAmount) {
              itemData.weeksComplete = Number(itemData.weeksComplete + 1);
              return dataManager.update("Bills", itemData)
              .then((resultsV2) => {
                  return "Complete";
              })
              .catch((errormsg) => {
                  console.log("Error:" + errormsg);
                  return errormsg;
              });
            } else {
              return "Error";
            }
            break;
        case "subtract":
            if (itemData.weeksComplete !== 0) {
              itemData.weeksComplete = Number(itemData.weeksComplete - 1);
              return dataManager.update("Bills", itemData)
              .then((resultsV3) => {
                  return "Complete";
              })
              .catch((errormsg) => {
                  console.log("Error:" + errormsg);
                  return errormsg;
              });
            } else {
              return "Error";
            }
            break;
        case "cycle":
            itemData.weeksComplete = 0;
            itemData.date = NEWdate1;
            itemData.lastPayDate = NEWdate2;
            return dataManager.update("Bills", itemData)
            .then((resultsV4) => {
                return "Complete";
            })
            .catch((errormsg) => {
                console.log("Error:" + errormsg);
                return errormsg;
            });
            break;
        default:
            return "No Action";
        }
      })
      .catch((errormsg) => {
        console.log("Error:" + errormsg);
        return errormsg;
      });
}
