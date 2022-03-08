/**** Calendar JS ***/

// For our purposes, we can keep the current month in a variable in the global scope
var currentMonth = new Month(2022, 3); // March 2022

var day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

//run update immediately to get current calendar
updateCalendar();

// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar() {
    alert("in update calendar, current month: " + currentMonth.month);

    //show current month and year at top of calendar
    $('#month_year').empty();
    $('#month_year').append(currentMonth.month + " ");
    $('#month_year').append(currentMonth.year);

    var weeks = currentMonth.getWeeks();

    for (var w in weeks) {
        var days = weeks[w].getDates();
        // days contains normal JavaScript Date objects.
        //alert("Week starting on " + days[0].getMonth() + days[0].getDate());

        for (var d in days) {
            // You can see console.log() output in your JavaScript debugging tool, like Firebug,
            // WebWit Inspector, or Dragonfly.
            //console.log(days[d].toISOString());

            // create a new div element
            const cell = document.createElement("td");
            const date = document.createTextNode(days[d].getDate());

            // add the text node to the newly created div
            cell.appendChild(date);

            // add the newly created element and its content into the DOM
            const currentDiv = document.getElementById("div1");
            document.body.insertBefore(newDiv, currentDiv);
        }
        //table.appendChild(row);
    }
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