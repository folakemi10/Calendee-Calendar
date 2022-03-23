/**** Calendar JS ***/
let logged_in = false;
//checks if user is logged in everytime script loads (prevent logout on refresh)
function check_login() {
  fetch("check_logged_in.php", {
    method: "POST",
    body: JSON.stringify(),
    headers: { "content-type": "application/json" },
  })
    .then((response) => response.json())
    .then(function (data) {
      if (data.success) {
        console.log("logged in");
        //hide login & register panel
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";

        //display logout button
        document.getElementById("logout_btn").style.display = "block";

        // //display theme button
        // document.getElementById("dark_theme_btn").style.display = "block";
        // document.getElementById("default_theme_btn").style.display = "block";

        //hide dialog
        document.getElementById("edit_event_dialog").style.display = "none";
        //hide dialog
        document.getElementById("display_event").style.display = "none";

        document.getElementById("calendar_user").innerHTML =
          data.username + "'s Calendar";
        showEvents();
        addDialog();
        displayInfo();
        // showTheme();
      } else {
        console.log("not logged in");
        //display login and register panel
        document.getElementById("login").style.display = "block";
        document.getElementById("register").style.display = "block";

        //hide logout button
        document.getElementById("logout_btn").style.display = "none";

        //hide theme button
        // document.getElementById("dark_theme_btn").style.display = "none";
        // document.getElementById("default_theme_btn").style.display = "none";

        //hide dialog
        document.getElementById("add_event_dialog").style.display = "none";

        //hide dialog
        document.getElementById("edit_event_dialog").style.display = "none";

        //hide dialog
        document.getElementById("display_event").style.display = "none";
        //delete all events from calendar
        const event_boxes = document.querySelectorAll(".event_box");
        event_boxes.forEach((event_box) => {
          console.log("deleting events from calendar.js");
          event_box.remove();
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}

//get current date
const current_date = new Date();
let month = current_date.getMonth();
let year = current_date.getFullYear();
let day = current_date.getDate();

// For our purposes, we can keep the current month in a variable in the global scope
var currentMonth = new Month(year, month); // March 2022

var day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var month_names = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.onload = function () {
  updateCalendar();
};
// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener(
  "click",
  function (event) {
    currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
  },
  false
);

// Change the month when the "prev" button is pressed
document.getElementById("prev_month_btn").addEventListener(
  "click",
  function (event) {
    currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
  },
  false
);

// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.

/*** Calendar Grid: in part constructed with https://codepen.io/andyydna/pen/VwYRVQE as a reference ***/
function updateCalendar() {
  let table = document.getElementById("calendar_body");
  table.innerHTML = "";

  //show current month and year at top of calendar
  $("#month_year").empty();
  $("#month_year").append(month_names[currentMonth.month] + " ");
  $("#month_year").append(currentMonth.year);

  var weeks = currentMonth.getWeeks();

  for (var w in weeks) {
    var days = weeks[w].getDates();
    // days contains normal JavaScript Date objects.
    let row = document.createElement("tr");
    row.setAttribute("id", "day_row");
    for (var d in days) {
      month_int = days[d].getMonth();
      date_int = days[d].getDate();
      year_int = days[d].getFullYear();

      // create a new div element
      let cell = document.createElement("td");
      let date_div = document.createElement("div");
      cell_id = month_int + "_" + date_int + "_" + year_int;
      cell.setAttribute("id", cell_id);
      cell.setAttribute("class", "day_cell");
      date_div.setAttribute("class", "day_number");
      let date = document.createTextNode(days[d].getDate());
      date_div.appendChild(date);
      cell.appendChild(date_div);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  check_login();
}

(function () {
  "use strict";

  /* Date.prototype.deltaDays(n)
   *
   * Returns a Date object n days in the future.
   */
  Date.prototype.deltaDays = function (n) {
    // relies on the Date object to automatically wrap between months for us
    return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
  };

  /* Date.prototype.getSunday()
   *
   * Returns the Sunday nearest in the past to this date (inclusive)
   */
  Date.prototype.getSunday = function () {
    return this.deltaDays(-1 * this.getDay());
  };
})();

/** Week
 *
 * Represents a week.
 *
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
  "use strict";

  this.sunday = initial_d.getSunday();

  this.nextWeek = function () {
    return new Week(this.sunday.deltaDays(7));
  };

  this.prevWeek = function () {
    return new Week(this.sunday.deltaDays(-7));
  };

  this.contains = function (d) {
    return this.sunday.valueOf() === d.getSunday().valueOf();
  };

  this.getDates = function () {
    var dates = [];
    for (var i = 0; i < 7; i++) {
      dates.push(this.sunday.deltaDays(i));
    }
    return dates;
  };
}

/** Month
 *
 * Represents a month.
 *
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 *
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
  "use strict";

  this.year = year;
  this.month = month;

  this.nextMonth = function () {
    return new Month(year + Math.floor((month + 1) / 12), (month + 1) % 12);
  };

  this.prevMonth = function () {
    return new Month(year + Math.floor((month - 1) / 12), (month + 11) % 12);
  };

  this.getDateObject = function (d) {
    return new Date(this.year, this.month, d);
  };

  this.getWeeks = function () {
    var firstDay = this.getDateObject(1);
    var lastDay = this.nextMonth().getDateObject(0);

    var weeks = [];
    var currweek = new Week(firstDay);
    weeks.push(currweek);
    while (!currweek.contains(lastDay)) {
      currweek = currweek.nextWeek();
      weeks.push(currweek);
    }

    return weeks;
  };
}

/******************************************************************************************************************/
/***  addDialog(): Open the intial dialog for creating an event when clicking on a cell in the calendar table ***/
/******************************************************************************************************************/
//Written with help of official JQuery UI documentation: https://jqueryui.com/dialog/#modal-form
function addDialog() {
  let dialog,
    form,
    title = $("#event_title"),
    starttime = $("#starttime"),
    endtime = $("#endtime"),
    allFields = $([]).add(title).add(starttime).add(endtime);

  //offer option to clear priority tags
  $(".clear_tag").click(function () {
    $("#high").prop("checked", false);
    $("#medium").prop("checked", false);
    $("#low").prop("checked", false);
  });

  function addEvent() {
    let valid = true;
    allFields.removeClass("ui-state-error");

    //make variables for passing data
    let hidden_event_date =
      document.getElementById("hidden_event_date").innerHTML;
    let checked_tag = $("input[type='radio']:checked").val();

    //connect to php and send variables
    const data = {
      add_event_date: hidden_event_date, //string for event_date in MM_DD_YYYY format
      add_title: title.val(), //string for event name
      add_starttime: starttime.val(), //string for start time
      add_endtime: endtime.val(), //string for end time
      add_tag: checked_tag, //string for which priority is checked
      token: csrf_token, //csrf token
    };

    fetch("addevent.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(function (data) {
        console.log(data.message);
        updateCalendar();
      })
      .catch((err) => console.error(err));

    dialog.dialog("close");
    return valid;
  }

  dialog = $("#add_event_dialog").dialog({
    autoOpen: false,
    height: 400,
    width: 400,
    modal: true,
    buttons: {
      Save: addEvent,
      Cancel: function () {
        dialog.dialog("close");
      },
    },
    close: function () {
      form[0].reset();
      allFields.removeClass("ui-state-error");
    },
  });

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    addEvent();
  });

  $("#day_row td").on("click", function (event) {
    //get current date from cell id and open dialog
    let cell_id = $(this).attr("id");
    const re = /(\d{1,2})_(\d{1,2})_(\d{4})/;
    let match = re.exec(cell_id);
    let full_date = month_names[match[1]] + " " + match[2] + ", " + match[3];
    document.getElementById("hidden_event_date").innerHTML = cell_id;
    document.getElementById("event_date").innerHTML = full_date;

    dialog.dialog("open");
  });
}

/*****************************************************************************************************/
/***  showEvents(): shows all events on the calendar after recieving from database in getallevents.php ***/
/*****************************************************************************************************/
function showEvents() {
  let eventid_arr,
    eventdate_arr,
    title_arr,
    starttime_arr,
    endtime_arr,
    tag_arr,
    group_share_arr;

  const data = { token: csrf_token };
  //get arrays with all events stored
  fetch("getallevents.php", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  })
    .then((response) => response.json())
    .then(function (data) {
      if (data.success) {
        eventid_arr = data.eventid_arr;
        eventdate_arr = data.eventdate_arr;
        title_arr = data.title_arr;
        starttime_arr = data.starttime_arr;
        endtime_arr = data.endtime_arr;
        tag_arr = data.tag_arr;
        group_share_arr = data.group_share_arr;

        //display each event inside the proper cells
        for (let i = 0; i < eventdate_arr.length; i++) {
          //get id of the cell the event should be in
          let cell = document.getElementById(eventdate_arr[i]);

          //check if cell id is currently present
          if (cell == null) {
            //this means the cell for the current event doesn't exist on the page, go to next element
          } else {
            //create the div for where the event will be displayed
            let event_box = document.createElement("div");
            let event_display = document.createTextNode(title_arr[i]);
            event_box.appendChild(event_display);
            //if it is null, not a shared event
            if (!group_share_arr[i]) {
              event_box.setAttribute("class", "event_box");
              event_box.setAttribute("id", eventid_arr[i]);
              cell.appendChild(event_box);
            } else {
              console.log("shared: " + group_share_arr[i]);
              event_box.setAttribute("class", "locked_event_box");
              event_box.setAttribute("id", eventid_arr[i]);
              cell.appendChild(event_box);
            }
          }
        }
      }
    })
    .catch((err) => console.error(err));
}

/**********************************************************************************************/
/***  editDialog(): opens dialog when user clicks on existing event for editing or deleting ***/
/**********************************************************************************************/
function editDialog(id) {
  let event_id = id;

  let dialog,
    form,
    title = $("#edit_event_title"),
    starttime = $("#edit_starttime"),
    endtime = $("#edit_endtime"),
    allFields = $([]).add(title).add(starttime).add(endtime);

  //offer option to clear priority tags
  $(".clear_tag").click(function () {
    $("#edit_high").prop("checked", false);
    $("#edit_medium").prop("checked", false);
    $("#edit_low").prop("checked", false);
  });

  function editEvent() {
    let valid = true;
    allFields.removeClass("ui-state-error");

    //make variables for passing data
    let checked_tag = $("input[type='radio']:checked").val();

    //connect to php and send variables
    const data = {
      event_id: event_id,
      edit_title: title.val(), //string for event name
      edit_starttime: starttime.val(), //string for start time
      edit_endtime: endtime.val(), //string for end time
      edit_tag: checked_tag, //string for which priority is checked
      token: csrf_token, //csrf token
    };

    fetch("editevent.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(function (data) {
        console.log(data.message);
      })
      .catch((err) => console.error(err));
    return valid;
  }

  dialog = $("#edit_event_dialog").dialog({
    autoOpen: false,
    height: 400,
    width: 400,
    modal: true,
    buttons: {
      Update: function () {
        editEvent();
        updateCalendar();
        $(this).dialog("close");
      },
    },
    close: function () {
      form[0].reset();
      allFields.removeClass("ui-state-error");
    },
  });

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    editEvent();
  });

  dialog.dialog("open");
}

/**********************************************************************************************/
/***  displayInfo(): displays event information from get event.php ****************************/
/**********************************************************************************************/
function displayInfo() {
  $("#day_row td").on("click", ".event_box", function (event) {
    event.stopPropagation();
    let event_id = parseInt($(this).attr("id"));

    function display(eventdate, title, starttime, endtime, tag, group_share) {
      //regex for event date
      const re = /(\d{1,2})_(\d{1,2})_(\d{4})/;
      let match = re.exec(eventdate);
      let full_date = month_names[match[1]] + " " + match[2] + ", " + match[3];
      document.getElementById("display_date").innerHTML = full_date;

      document.getElementById("display_title").innerHTML = title;
      document.getElementById("display_startendtime").innerHTML =
        "Start: " + starttime + " - " + "End: " + endtime;
      document.getElementById("display_tag").innerHTML = "Priority: " + tag;
      document.getElementById("display_id").innerHTML = event_id;
    }

    let eventdate, title, starttime, endtime, tag, group_share;
    const data = {
      event_id: event_id,
      token: csrf_token,
    };
    //get arrays with all events stored
    fetch("getevent.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(function (data) {
        if (data.success) {
          eventdate = data.eventdate;
          title = data.title;
          starttime = data.starttime;
          endtime = data.endtime;
          tag = data.tag;
          group_share = data.group_share;

          display(eventdate, title, starttime, endtime, tag, group_share);
        }
      })
      .catch((err) => console.error(err));

    $("#display_event").dialog({
      resizable: true,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Edit Event": function () {
          editDialog(event_id);
          $(this).dialog("close");
        },
        "Delete Event": function () {
          const data = {
            event_id: event_id,
            token: csrf_token,
          };
          //deleting event with deleteevent.php
          fetch("deleteevent.php", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "content-type": "application/json" },
          })
            .then((response) => response.json())
            .then(function (data) {
              console.log(data.message);
            })
            .catch((err) => console.error(err));

          updateCalendar();
          $(this).dialog("close");
        },
      },
    });
  });

  $("#day_row td").on("click", ".locked_event_box", function (event) {
    event.stopPropagation();
    let event_id = parseInt($(this).attr("id"));

    function display(eventdate, title, starttime, endtime, tag) {
      //regex for event date
      const re = /(\d{1,2})_(\d{1,2})_(\d{4})/;
      let match = re.exec(eventdate);
      let full_date = month_names[match[1]] + " " + match[2] + ", " + match[3];
      document.getElementById("locked_display_date").innerHTML = full_date;

      document.getElementById("locked_display_title").innerHTML = title;
      document.getElementById("locked_display_startendtime").innerHTML =
        "Start: " + starttime + " - " + "End: " + endtime;
      document.getElementById("locked_display_tag").innerHTML =
        "Priority: " + tag;
      document.getElementById("locked_display_sharedwith").innerHTML =
        "This event was shared with you.";
    }

    let eventdate, title, starttime, endtime, tag, group_share;
    const data = {
      event_id: event_id,
      token: csrf_token,
    };
    //get arrays with all events stored
    fetch("getevent.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(function (data) {
        if (data.success) {
          eventdate = data.eventdate;
          title = data.title;
          starttime = data.starttime;
          endtime = data.endtime;
          tag = data.tag;
          group_share = data.group_share;

          display(eventdate, title, starttime, endtime, tag, group_share);
        }
      })
      .catch((err) => console.error(err));

    $("#locked_display_event").dialog({
      resizable: true,
      height: "auto",
      width: 400,
      modal: true,
    });
  });
}

/**********************************************************************************************/
/*** showTheme(): displays chosen theme or default ********************************************/
/**********************************************************************************************/
$(document).ready(function () {
  $("#checkbox").click(function () {
    var element = document.body;
    // $("body").attr("class", "body_dark_theme");
    element.classList.toggle("dark");
    element.classList.toggle("body_light_theme");
  });
});
// function showTheme() {
//     let current_theme;
//     if (document.getElementById("theme").innerHTML != null) {
//         current_theme = document.getElementById("theme").innerHTML;
//     } else {
//         current_theme = "default";
//     }

//     console.log(current_theme);
//     const data = {
//         token: csrf_token,
//         theme: current_theme
//     };

//     fetch("gettheme.php", {
//             method: "POST",
//             body: JSON.stringify(data),
//             headers: { "content-type": "application/json" },
//         })
//         .then((response) => response.json())
//         .then(function(data) {
//             if (data.success) {
//                 let new_theme = data.theme;
//                 console.log("inside show theme: " + new_theme);
//                 if (new_theme == "dark") {
//                     document.body.style.backgroundImage = "linear-gradient(to right, #e045db, #0cbaba)";
//                 } else {
//                     // change to default
//                     document.body.style.backgroundImage = "linear-gradient(to left, #e045db, #0cbaba)";
//                 }
//             }
//         })
//         .catch((err) => console.error(err));
// }

// document
//     .getElementById("dark_theme_btn")
//     .addEventListener("click", darkThemeChange, false);
// document
//     .getElementById("default_theme_btn")
//     .addEventListener("click", defaultThemeChange, false);

// function darkThemeChange(event) {
//     //hidden html
//     document.getElementById("theme").innerHTML = "dark";
//     showTheme();
// }

// function defaultThemeChange(event) {
//     //hidden html
//     document.getElementById("theme").innerHTML = "default";
//     showTheme();
// }

/**********************************************************************************************/
/***  shareEvent(): shares event with another user ****************************/
/**********************************************************************************************/
document
  .getElementById("share_event")
  .addEventListener("click", shareEvent, false);

function shareEvent() {
  let share_with_username = document.getElementById("share_username").value;
  let event_id = document.getElementById("display_id").innerHTML;

  //connect to php and send variables

  const data = {
    event_id: event_id,
    share_user: share_with_username,
    token: csrf_token, //csrf token
  };

  fetch("shareevent.php", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log(data.message);
      updateCalendar();
    })
    .catch((err) => console.error(err));
}

/**********************************************************************************************/
/***  jumpTo(): allows the user to skip to a new month/year of  their choosing ****************/
/**********************************************************************************************/
/* completed with reference to: https://codepen.io/andyydna/pen/VwYRVQE */
let current_month = document.getElementById("month_change");
let current_year = document.getElementById("year_change");

current_month.addEventListener("change", jumpTo, false);
current_year.addEventListener("change", jumpTo, false);

function generate_year_range(start, end) {
  let years = "";
  for (let i = start; i <= end; i++) {
    years += "<option value='" + i + "'>" + i + "</option>";
  }
  return years;
}

selectedYear = generate_year_range(1999, 2050);
document.getElementById("year_change").innerHTML = selectedYear;

current_year.value = year;
current_month.value = month;

function jumpTo() {
  let newMonth = parseInt(current_month.value);
  let newYear = parseInt(current_year.value);

  currentMonth = new Month(newYear, newMonth);
  updateCalendar();
}
