# Under Construction

## Important Note:
### The data for the report is hard coded into reports.js. How and where you get your data from is up to you if you use this code. The original code used ajax in order to pull data from a server and performed the following actions on success:
```
window.Foo.STORAGE = data;
update_charts();
update_lhs();
update_rhs();
bind_li_date_ranges();
bind_custom_range();
return void 0;
```

External Requirements (already in code):

[jQuery 3.7.1 Core](https://releases.jquery.com/jquery/)

[jQuery UI 1.13.1](https://releases.jquery.com/ui/)

[jQuery UI CSS 1.13.2 - Base](https://cdnjs.com/libraries/jqueryui/1.13.2)

[Chart JS 3.9.1](https://cdnjs.com/libraries/Chart.js/3.9.1)

[jQuery UI Multidatespicker & CSS 1.6.6](https://cdnjs.com/libraries/jquery-ui-multidatespicker)

Intended purpose:

Generate a report of "tickets" (dummy data in this public form).

## Developer Notes:
- The css folder contains 3 files even though there is only one page. This is because the original project included other pages that used similar header, footer, and content formatting. These files were kept separate to retain similar functionality should more pages be added, allowing the same general layout to be used. A more custom layout can be created for each individual page as desired.
- The data entered to be displayed is relatively random, including the dates for the oldest tickets. This means there may be some nonsense data displayed (I.E. Edit date BEFORE the Created date). This is expected for this iteration of the code as some of the data, the dates specifically, are randomized with JavaScript.
- The "export" button/option has been commented out from report.html. This functionality was never fully implemented due to the Print option having "Save as PDF" on most modern systems. However, it remains in case someone wants easy access to implementing such an option with a button.
  - To make the button visible, you must uncomment it from report.html and remove or modify the entry for ```#export_button_wrapper``` in reports.css.
- The "Reporting Date Ranges" options and "Custom Date Ranges" update function will not change the data. These options were intended to query a server and pull in new data to update the various outputs on the page. Since the data is static for the purposes of this presentation, there is no change in the output when these options are used.
  - Yes, it would be possible to modify reports.js to accommodate the static data and expand said data, however the amount of work this would require exceeds the intended purpose of this project as well as deviates from the original intended functionality.
  - There is still error checking in the Custom Date Ranges option, for those that are interested in trying to break things.
