/**** Calendar JS ***/

let logged_in = false;
//keep user logged in after refresh
fetch("check_logged_in.php", {
        method: 'POST',
        body: JSON.stringify(),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => is_loggedin(data))
    .catch(error => console.error('Error:', error));

function is_loggedin(data) {
    if (data.success) {
        console.log("logged in");
        logged_in = true;
        //hide login & register panel
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";

        //display logout button
        document.getElementById("logout_btn").style.display = "block";

        document.getElementById("calendar_user").innerHTML = data.username + "'s Calendar";
    } else {
        console.log("not logged in");
        logged_in = false;
        //display login and register panel
        document.getElementById("login").style.display = "block";
        document.getElementById("register").style.display = "block";

        //hide logout button
        document.getElementById("logout_btn").style.display = "none";
    }
}

//get current date
const current_date = new Date();
let month = current_date.getMonth();
let year = current_date.getFullYear();
let day = current_date.getDate();

// For our purposes, we can keep the current month in a variable in the global scope
var currentMonth = new Month(year, month); // March 2022

var day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.onload = function() {
    updateCalendar();
};
// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event) {
    currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);

// Change the month when the "prev" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function(event) {
    currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.

/*** Calendar Grid: in part constructed with https://codepen.io/andyydna/pen/VwYRVQE as a reference ***/
function updateCalendar() {
    //alert("in update calendar, current month: " + currentMonth.month);
    let table = document.getElementById("calendar_body");
    table.innerHTML = "";

    //show current month and year at top of calendar
    $('#month_year').empty();
    $('#month_year').append(month_names[currentMonth.month] + " ");
    $('#month_year').append(currentMonth.year);

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
            cell_id = month_int + "_" + date_int + "_" + year_int;
            cell.setAttribute("id", cell_id);
            cell.setAttribute("class", "day_cell");
            let date = document.createTextNode(days[d].getDate());
            cell.appendChild(date);
            row.appendChild(cell);

        }
        table.appendChild(row);
    }
    //disable calendar clicks if user is not logged in
    openDialog();
}


(function() {
    "use strict";

    /* Date.prototype.deltaDays(n)
     * 
     * Returns a Date object n days in the future.
     */
    Date.prototype.deltaDays = function(n) {
        // relies on the Date object to automatically wrap between months for us
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
    };

    /* Date.prototype.getSunday()
     * 
     * Returns the Sunday nearest in the past to this date (inclusive)
     */
    Date.prototype.getSunday = function() {
        return this.deltaDays(-1 * this.getDay());
    };
}());

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


    this.nextWeek = function() {
        return new Week(this.sunday.deltaDays(7));
    };

    this.prevWeek = function() {
        return new Week(this.sunday.deltaDays(-7));
    };

    this.contains = function(d) {
        return (this.sunday.valueOf() === d.getSunday().valueOf());
    };

    this.getDates = function() {
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

    this.nextMonth = function() {
        return new Month(year + Math.floor((month + 1) / 12), (month + 1) % 12);
    };

    this.prevMonth = function() {
        return new Month(year + Math.floor((month - 1) / 12), (month + 11) % 12);
    };

    this.getDateObject = function(d) {
        return new Date(this.year, this.month, d);
    };

    this.getWeeks = function() {
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

//Written with help of official JQuery UI documentation: https://jqueryui.com/dialog/#modal-form
function openDialog() {
    let dialog, form,
        title = $("#event_title"),
        starttime = $("#starttime"),
        endtime = $("#endtime"),
        allFields = $([]).add(title).add(starttime).add(endtime);

    //offer option to clear priority tags
    $(".clear_tag").click(function() {
        $("#high").prop("checked", false);
        $("#medium").prop("checked", false);
        $("#low").prop("checked", false);
    });



    function addEvent() {
        let valid = true;
        allFields.removeClass("ui-state-error");

        //console.log(document.getElementById('event_date').innerHTML);
        //hidden event id is to make it easier to pass over month, day, and year values into database
        //console.log(document.getElementById('hidden_event_id').innerHTML);
        //console.log(title.val());
        //console.log(starttime.val());
        //console.log(endtime.val());
        //console.log($("input[type='radio']:checked").val());

        //make variables for passing data
        let hidden_event_date = document.getElementById('hidden_event_date').innerHTML;
        let checked_tag = $("input[type='radio']:checked").val();

        //connect to php and send variables
        const data = {
            'add_event_date': hidden_event_date, //string for event_date in MM_DD_YYYY format
            'add_title': title.val(), //string for event name
            'add_starttime': starttime.val(), //string for start time
            'add_endtime': endtime.val(), //string for end time
            'add_tag': checked_tag, //string for which priority is checked
            'token': csrf_token //csrf token
        };

        fetch("addevent.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
            .then(response => response.json())
            .then(function(data) {
                console.log(data.message);
            })
            .catch(err => console.error(err));

        dialog.dialog("close");
        return valid;
    }

    dialog = $("#add_event_dialog").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {
            "Save": addEvent,
            Cancel: function() {
                dialog.dialog("close");
            }
        },
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });


    form = dialog.find("form").on("submit", function(event) {
        event.preventDefault();
        addEvent();
    });


    $("#day_row td").on("click", function() {
        //get current date from cell id and open dialog
        let cell_id = $(this).attr("id");
        const re = /(\d{1,2})_(\d{1,2})_(\d{4})/;
        let match = re.exec(cell_id);
        let full_date = month_names[match[1]] + " " + match[2] + ", " + match[3];
        document.getElementById('hidden_event_date').innerHTML = cell_id;
        document.getElementById('event_date').innerHTML = full_date;


        dialog.dialog('open');
    });
}