//get data from getevent.php

fetch("getevent.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => console.log(data.success ? "Event added!" : `Event was not added ${data.message}`))
    .catch(err => console.error(err))

//execute 
.then(function(data) {
    var data = $.parseJSON(JSON.stringify(data));
    //get information from event in database
    let title = returnData.title;
    let startTime = returnData.startTime;
    let endTime = returnData.endTime;
    //add new variables into the DOM
})