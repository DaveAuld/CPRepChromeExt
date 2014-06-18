/**************************
    CPRepWatcher Options JS
***************************/

// -------------------------------------------------
// Page Ready
// -------------------------------------------------
$(document).ready(function() {

    $('#saveOptions').click(function () { save_options_optionspage() });

    // initialise the elements
    $("button", ".save").button();
    $("#tabs").tabs();

    //Load the options
    restore_options();
});

// -------------------------------------------------
// Saves options to localStorage.
// From standalone options page.
// -------------------------------------------------
function save_options_optionspage() {

    //Get the current saved memberID
    var currentID = localStorage["memberID"];
    var newID = textMemberID.value;

    if (!(currentID == newID)) {
        //memberID has changed
        //Save the new memberID
        localStorage["memberID"] = newID;

        // Update status to let user know options were saved.
        if (localStorage["memberID"] == newID) {
            save_status.innerHTML = "MemberID: " + localStorage["memberID"] + " saved to local storage.";
            setTimeout(function () { save_status.innerHTML = ""; }, 1000);

            //Clear Saved Data
            var newRep = new Array();
            for (i = 0; i < 9; i++) {
                newRep[i] = "0";
            }
            //Update the stored Rep Data to 0 values
            setNewRepDetail(newRep);
        }
        else
        { save_status.innerHTML = "Error saving MemberID to localStorage."; }
    }
    else {
        save_status.innerHTML = "MemberID: has not changed.";
        setTimeout(function () { save_status.innerHTML = ""; }, 1000);
    }
}

// -------------------------------------------------
// Restores memberId textbox state to saved value from localStorage.
// -------------------------------------------------
function restore_options() 
{
    var memberID = localStorage["memberID"];
    if (!memberID ) {
        return;
    }
    var textbox = document.getElementById("textMemberID");
    textbox.value = memberID.toString();
}

