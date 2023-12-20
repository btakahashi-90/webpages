// get chart canvases
const totals_chart_ctx = $("#totals_chart");
const categories_chart_ctx = $("#categories_chart");

// set-up local storage
window.Foo = {};

current_range = "";
custom_from_qstring = "";
custom_to_qstring = "";

const COLORS = [
    'rgb(255, 99, 132)', //red
    'rgb(255, 159, 64)', //orange
    'rgb(255, 205, 86)', //yellow
    'rgb(75, 192, 192)', //green
    'rgb(54, 162, 235)', //blue
    'rgb(153, 102, 255)', //purple
    'rgb(201, 203, 207)' //grey
];

// get date range objects that will be important for turning on/off
default_ranges = $(".range_options ul li");
custom_range_button = $("#update_by_custom");

function update_charts(){
    // get labels, will apply to both charts
    new_labels = window.Foo.STORAGE["chart_labels"];

    // set-up to hold totals for Chart 1 while we pull datasets for Chart 2
    month_totals = [];
    for(i = 0; i < new_labels.length; i++){
        month_totals.push(0)
    }
    chart_2_datasets = [];
    for(i = 0; i < window.Foo.STORAGE["categories"].length; i++){
        temp = window.Foo.STORAGE["categories"][i]["active_tickets"];
        category_sum = 0;
        // this is dumb, please find a better way
        for(j = 0; j < temp.length; j++){
            month_totals[j] += temp[j];
            category_sum += temp[j]
        }
        if(category_sum !== 0)
            chart_2_datasets.push(window.Foo.STORAGE["categories"][i]);
    }

    // update chart 1, probably the easier of the two with only 1 dataset.
    totals_chart.data.labels = new_labels;
    totals_chart.data.datasets[0].data = month_totals;
    totals_chart.update();

    // update chart 2, a bit more difficult.
    num_datasets = categories_chart.data.datasets.length
    // pop current datasets - ALL OF THEM
    for(i = 0; i < num_datasets; i++){
        categories_chart.data.datasets.pop();
    }
    // reset labels

    categories_chart.data.labels = new_labels;
    // apply new datasets
    for(i = 0; i < chart_2_datasets.length; i++){
        data_dict = {
            label: chart_2_datasets[i]["name"],
            data: chart_2_datasets[i]["active_tickets"],
            fill: false,
            lineTension: 0,
            backgroundColor: COLORS[i % COLORS.length],
            borderColor: COLORS[i % COLORS.length],

            borderWidth: 1
        };

        categories_chart.data.datasets.push(data_dict);
    }
    // update
    categories_chart.update();
}

function display_category(category_dict, active_total){
    if(category_dict["new_tickets"] === 0 && category_dict["completed_tickets"] === 0 && category_dict["overdue_tickets"] === 0 && active_total === 0)
        return false;
    else
        return true;
}


function update_lhs(){
    console.log("Updating LHS of report");
    // get categories container to append to
    container = $(".categories_container");

    // clear current categories displayed
    container.empty();

    // build html to append, loop over all categories in storage
    for(i = 0; i < window.Foo.STORAGE["categories"].length; i++){
        sum_active = 0;
        for(j = 0; j < window.Foo.STORAGE["categories"][i]["active_tickets"].length; j++){
            sum_active += window.Foo.STORAGE["categories"][i]["active_tickets"][j];
        }
        if(display_category(window.Foo.STORAGE["categories"][i], sum_active)){
            category_html = '<div class="category">\
            <div class="category_name" style="border-bottom: solid; border-width: 1px;">\
                <strong>' + window.Foo.STORAGE["categories"][i]["name"] + '</strong>\
            </div>\
            <div class="new_tickets">\
                New Tickets Received\
                <div class="count" style="float: right">\
                    ' + window.Foo.STORAGE["categories"][i]["new_tickets"] + '\
                </div>\
            </div>\
            <div class="active_tickets">\
                Total Active Tickets\
                <div class="count" style="float: right">\
                    ' + sum_active +'\
                </div>\
            </div>\
            <div class="completed_tickets">\
                Tickets Completed\
                <div class="count" style="float: right">\
                    ' + window.Foo.STORAGE["categories"][i]["completed_tickets"] + '\
                </div>\
            </div>\
            <div class="overdue_tickets">\
                Overdue Tickets\
                <div class="count" style="float: right">\
                    ' + window.Foo.STORAGE["categories"][i]["overdue_tickets"] + '\
                </div>\
            </div>\
            <div class="external_link" style="text-align: center">\
                <a target="_blank" href="' + window.Foo.STORAGE["categories"][i]["id"] + '/' + current_range + '/'

            // add query strings if necessary
            if(current_range === "custom"){
                category_html += '?start=' + custom_from_qstring + '&end=' + custom_to_qstring + '">\
                    View Ticket List (for period selected)</a>\
                </div>\
                </div>'
            }
            else{
                category_html += '">\
                    View Ticket List (for period selected)</a>\
                </div>\
                </div>'
            }

            container.append(category_html);
        }
    }
}

function update_rhs(){
    console.log("Updating RHS of report");
    // get containers
    // oldest tickets:
    oldest_container = $(".oldest_tickets_data");
    // employee activity:
    activity_container = $(".activity_data_wrapper");

    // clear them both
    oldest_container.empty();
    activity_container.empty();

    // fill oldest tickets in loop, append to container after each iteration
    for(i = 0; i < window.Foo.STORAGE["oldest_tickets"].length; i++){
        current_item = window.Foo.STORAGE["oldest_tickets"][i];
        edit_date = new Date(current_item["edit_date"]);
        created_date = new Date(current_item["created_date"]);
        ticket_html = '<div class="ticket_data_wrapper">\
            <div class="">\
            <a target="_blank" href="' + current_item["id"] + '/">' + current_item["ticket_number"] + '</a>\
            </div>\
            <div class="">\
                ' + current_item["type_name"] + '\
            </div>\
            <div class="">\
                ' + (edit_date.getMonth() + 1) + '/' + edit_date.getDate() + '/' + edit_date.getFullYear() + '\
            </div>\
            <div class="">\
                ' + (created_date.getMonth() + 1) + '/' + created_date.getDate() + '/' + created_date.getFullYear()  + ' (' + current_item["age"] + ' days)\
            </div>\
        </div>'

        oldest_container.append(ticket_html);
    }


    // fill employee activity in a loop, append to activity container after each iteration
    for(i = 0; i < window.Foo.STORAGE["activity"].length; i++){
        current_item = window.Foo.STORAGE["activity"][i];
        activity_html = '<div class="activity_data"> \
            <div class="">\
                ' + current_item["name"] + '\
            </div> \
            <div class=""> \
                ' + current_item["notes"] + '\
            </div> \
            <div class=""> \
                ' + current_item["actions"] + '\
            </div> \
            </div>'

        activity_container.append(activity_html);
    }
}

function bind_li_date_ranges(){
    default_ranges.off(); // clear any current event listeners, this is incase we ever have to reload the page.
    default_ranges.on("click", function(){
        // disable click functions, try to prevents multiple ajax requests, don't forget to turn them back on...
        default_ranges.off();
        custom_range_button.off();
        data = {"range": this.dataset["range"], "type": "ajax"}
        current_range = data["range"];
        /*return $.ajax("/tickets/reports/", {
            type: 'GET',
            dataType: 'json',
            data: data,
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Ajax failed: " + textStatus);
                return void 0;
            },
            success: function(data, textStatus, jqXHR) {
              window.Foo.STORAGE = data;
              update_charts();
              update_lhs();
              update_rhs();
              bind_li_date_ranges();
              bind_custom_range();
              return void 0;
            }
       });*/
    })
}

function bind_custom_range(){
    custom_range_button.off() // clear any current event listeners.
    custom_range_button.on("click", function(){
        // disable click functions, try to prevents multiple ajax requests, don't forget to turn them back on...
        default_ranges.off();
        custom_range_button.off();

        // get input field values
        from = $("#from_input").val();
        to = $("#to_input").val();

        // try to cast inputs to dates & get today/now
        from = new Date(from)
        to = new Date(to)
        now = new Date()

        // check if we succeeded
        if(from != "Invalid Date" && to != "Invalid Date"){
            // okay we succeeded, now check if the dates entered make sense: I.E. From < To
            if(from < to && from < now){
                // succeeded again, make sure the difference isn't too large (in years) so we don't crash the servers...
                if((to.getFullYear() - from.getFullYear()) < 10){ // less than 10 years difference
                    // build custom url query strings for use  in category links
                    custom_from_qstring = String(from).replaceAll(" ", "%20");
                    custom_from_qstring.replaceAll(":", "%3A");
                    custom_to_qstring = String(to).replaceAll(" ", "%20");
                    custom_to_qstring.replaceAll(":", "%3A")
                    // okay the dates make sense...so let's ajax it
                    data = {"range": this.dataset["range"], "type": "ajax", "start": from, "end": to}
                    current_range = data["range"];
                    /*return $.ajax("/reports/", {
                        type: 'GET',
                        dataType: 'json',
                        data: data,
                        error: function(jqXHR, textStatus, errorThrown) {
                            alert("Ajax failed: " + textStatus);
                            return void 0;
                        },
                        success: function(data, textStatus, jqXHR) {
                            window.Foo.STORAGE = data;
                            update_charts();
                            update_lhs();
                            update_rhs();
                            bind_li_date_ranges();
                            bind_custom_range();
                            return void 0;
                        }
                   })*/
                }
                else{
                    alert('Range too large: Please ensure the dates are less than 10 years apart.')
                    // turn the clickables back on if error
                    bind_li_date_ranges();
                    bind_custom_range();
                    return void 0;
                }
            }
            else{
                // check if our From date is more of a problem.
                if(from > now){
                    alert('Dates conflict: Please ensure the "From" date is before today.')
                }
                else{
                    alert('Dates conflict: Please ensure the "To" date is after the "From" date.')
                }

                // turn the clickables back on if error
                bind_li_date_ranges();
                bind_custom_range();
                return void 0;
            }
        }
        else{
            // make it something...let the user know EXACTLY which input...
            if(from == "Invalid Date" && to != "Invalid Date"){
                alert('Invalid Date format entered in "From", please use mm/dd/yyyy or pick a date from the Date Picker');
            }
            else if (from != "Invalid Date" && to == "Invalid Date"){
                alert('Invalid Date format entered in "To", please use mm/dd/yyyy or pick a date from the Date Picker');
            }
            else{
                alert('Invalid Date format entered in both "From" and "To", please use mm/dd/yyyy or pick a date from the Date Picker');
            }
            // turn the clickables back on if error
            bind_li_date_ranges();
            bind_custom_range();
            return void 0;
        }
    })
}

function bind_print(){
    $("#print_button").off();
    $("#print_button").on("click", function(){
        window.print();
    })
}

$("document").ready( function(){
    data = {"range": "ytd", "type": "ajax"};
    current_range = data["range"];
    /*return $.ajax("/reports/", {
        type: 'GET',
        dataType: 'json',
        data: data,
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Ajax failed: " + textStatus);
            return void 0;
        },
        success: function(data, textStatus, jqXHR) {
          window.Foo.STORAGE = data;
          update_charts();
          update_lhs();
          update_rhs();
          bind_li_date_ranges();
          bind_custom_range();
          bind_print();
          // setup datepickers
          $("#from_input").datepicker();
          $("#to_input").datepicker();
          // clear inputs on success
          $("#from_input").val('');
          $("#to_input").val('');
          return void 0;
        }
   });*/
})

/* Initialize Empty Charts */
const totals_chart = new Chart(totals_chart_ctx, {
    type: 'bar',
    data:{
        labels: [],
        datasets: [{
            label: "Total Tickets",
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        },
        legend: {
            display: false
        },
        maintainAspectRatio: false,
    }
});

const categories_chart = new Chart(categories_chart_ctx, {
    type: 'line',
    data:{
        labels: [],
        datasets: []
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            },
            x: {
                offset: true
            }
        },
        legend: {
            display: true
        },
        maintainAspectRatio: false,
    }
});


/*
What we need for each "area" - all based on timeframe, default 1 year (YTD)
**************LHS**************
Categories - Category Name, New Tickets, Total Active, Completed, Overdue, ID (probably, fine to send it in)
**************RHS**************
Oldest 50 - Ticket # (not ID), Category Name, Last Edit Date, Created Date, Age, Neighborhood
Total Tickets Received - spanned Months (labels), Summed totals for all categories for each month
Tickets by Category - spanned Months (labels), Category Name, Active tickets per Category (for now, might be completed or something else)
Activity - Employee Name, # Notes created by Employee, # Actions done by employee

**************Common Data**************
Category Names, totals (any should be obtainable from LHS Categories with proper logic)

**************JSON v0.1**************
{
    "categories": [
        {
            "name": "string",
            "new_tickets": int,
            "active_tickets": [int_month_1, int_month_2, ..., int_month_n], <-- to be summed before display, used in "Tickets by Cat"
            "completed_tickets": int,
            "overdue_tickets": int,
            "id": int
        },
        {
            ...
        }
    ],
    "oldest_tickets": [
        {
            "ticket_number": int,
            "category_name": "string",
            "edit_date": "string", <-- maybe?
            "created_date": "string", <-- maybe?
            "age": int,
            "neighborhood": "string"
        },
        {
            ...
        }
    ],
    "activity": [
        {
            "name": "string",
            "notes_created": int, <-- edited included?
            "actions": int
        },
        {
            ...
        }
    ],
    "chart_labels": ["month_1-yr", "month_2-yr", ..., "month_n-yr"]
}
*/
