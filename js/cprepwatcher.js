/*************************
    CPRepWatcher Main JS
**************************/

// -------------------------------------------------
// Document has finished loading
// -------------------------------------------------
$(document).ready(function () {

    // Attach the button listeners
    $('#refreshPage').click(function () { buttonPageRefresh() });
    $('#detachExtension').click(function () { extDetach() });
    $('#openProfile').click(function () { navProfile() });
    $('#openCodeProject').click(function () { navCodeProject() });
    $('#saveOptionsOnExtension').click(function () { save_options() });

    //initialise the tabs + buttons
    $("#tabs").tabs({
        select: function (event, ui) {
            // Only the Rep Graph case is used at present.
            switch (ui.index)
            {
                case 1:
                    // Rep graph
                    loadRepGraph();
                    break;
            }
        }
    });

    $("button", ".save").button();
    $("button", ".buttons").button();

    //load the page
    reload_Page();
});

// -------------------------------------------------
// Saves options to localStorage.
// This is from within the exentension, not the 
// standalone options page.
// -------------------------------------------------
function save_options() {

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

            //Clear the table
            clearTable();

            //Reload the Page
            reload_Page();
        }
        else { save_status.innerHTML = "Error saving MemberID to localStorage."; }

    }
    else {
        save_status.innerHTML = "MemberID: has not changed.";
        setTimeout(function () { save_status.innerHTML = ""; }, 1000);
    }
}


// -------------------------------------------------
// Clear the table of the Previous/Current and Change data
// -------------------------------------------------
function clearTable() {
    //Clear the table of existing Previous data
    $("#prevRepTotal").html("0");
    $("#prevRepAuthor").html("0");
    $("#prevRepAuthority").html("0");
    $("#prevRepDebator").html("0");
    $("#prevRepEditor").html("0");
    $("#prevRepEnquirer").html("0");
    $("#prevRepOrganiser").html("0");
    $("#prevRepParticipant").html("0");
    $("#prevRepDate").html("&nbsp;");

    //Clear the table of existing Current data
    $("#loadRepTotal").html("0");
    $("#loadRepAuthor").html("0");
    $("#loadRepAuthority").html("0");
    $("#loadRepDebator").html("0");
    $("#loadRepEditor").html("0");
    $("#loadRepEnquirer").html("0");
    $("#loadRepOrganiser").html("0");
    $("#loadRepParticipant").html("0");
    $("#loadRepDate").html("&nbsp;");

    //Clear the table of existing Change Data
    $("#repChange0").html("<img src='images/no_change.png' alt='No Change'>&nbsp;0");
    $("#repChange1").html("<img src='images/no_change.png' alt='No Change'>&nbsp;0");
    $("#repChange2").html("<img src='images/no_change.png' alt='No Change'>&nbsp;0");
    $("#repChange3").html("<img src='images/no_change.png' alt='No Change'>&nbsp;0");
    $("#repChange4").html("<img src='images/no_change.png' alt='No Change'>&nbsp;0");
    $("#repChange5").html("<img src='images/no_change.png' alt='No Change'>&nbsp;0");
    $("#repChange6").html("<img src='images/no_change.png' alt='No Change'>&nbsp;0");
    $("#repChange7").html("<img src='images/no_change.png' alt='No Change'>&nbsp;0");

    //Clear the Member Level Status
    //Total Rep (#repStatus0) has no status, doesn't change
    $("#repStatus0").html("&nbsp;");
    $("#repStatus1").html("&nbsp;");
    $("#repStatus2").html("&nbsp;");
    $("#repStatus3").html("&nbsp;");
    $("#repStatus4").html("&nbsp;");
    $("#repStatus5").html("&nbsp;");
    $("#repStatus6").html("&nbsp;");
    $("#repStatus7").html("&nbsp;");
}

// -------------------------------------------------
// Restores memberId textbox state to saved value from localStorage.
// -------------------------------------------------
function restore_options() {
    var memberID = localStorage["memberID"];
    if (!memberID) {
        return;
    }
    var textbox = document.getElementById("textMemberID");
    textbox.value = memberID.toString();
}

// -------------------------------------------------
// Refresh Page using the manual button
// -------------------------------------------------

function buttonPageRefresh() {
    //Google Analytics Event Tracker
    _gaq.push(['_trackEvent', 'ButtonRefreshPage', 'clicked']);

    //Commence Refresh
    reload_Page();
}

// -------------------------------------------------
// Reload the page
// -------------------------------------------------
function reload_Page() {

    //Show the loading images
    $("#statusMessage").hide();
    $("#loadRepTable").show();

    setTimeout(function () {
        //Start loading the data from Codeproject profile
        $.get(getCPMemberProfile(), function (data) {
            setCPProfileData(data);
        });
    }, 1000);

    clearTable();
    getCPPage();
}

// -------------------------------------------------
// Get the Profile Page from CodeProject
// -------------------------------------------------
function getCPPage() {

    //Set Rep Page MemberID in Title
    $("#memberID").html(getMemberID());

    //Load the memberid from the localstorage
    restore_options();

    //Load the previous rep data from the localstorage
    var prevRep = getPrevRepDetail();
    if (!prevRep[0]) { prevRepTotal.innerHTML = "0"; } else { prevRepTotal.innerHTML = prevRep[0]; }
    if (!prevRep[1]) { prevRepAuthor.innerHTML = "0"; } else { prevRepAuthor.innerHTML = prevRep[1]; }
    if (!prevRep[2]) { prevRepAuthority.innerHTML = "0"; } else { prevRepAuthority.innerHTML = prevRep[2]; }
    if (!prevRep[3]) { prevRepDebator.innerHTML = "0"; } else { prevRepDebator.innerHTML = prevRep[3]; }
    if (!prevRep[4]) { prevRepEditor.innerHTML = "0"; } else { prevRepEditor.innerHTML = prevRep[4]; }
    if (!prevRep[5]) { prevRepEnquirer.innerHTML = "0"; } else { prevRepEnquirer.innerHTML = prevRep[5]; }
    if (!prevRep[6]) { prevRepOrganiser.innerHTML = "0"; } else { prevRepOrganiser.innerHTML = prevRep[6]; }
    if (!prevRep[7]) { prevRepParticipant.innerHTML = "0"; } else { prevRepParticipant.innerHTML = prevRep[7]; }
    if (!prevRep[8]) { prevRepDate.innerHTML = "0"; } else { prevRepDate.innerHTML = prevRep[8]; }
}

// -------------------------------------------------
//  Parse the CodeProject Data
// -------------------------------------------------
function setCPProfileData(rawData) {

    //Need to load a copy of this, as we will overwrite original at end
    //and will need to pass to the calcRepChange function.
    var oldRep = new Array();
    oldRep = getPrevRepDetail();

    //Holding var to temp store until complete.
    var newRep = new Array();

    //Initialise the array; caters for Categories that have no data yet.
    for (i = 0; i < 9; i++)
    { newRep[i] = "0"; }

    //Clear the table of existing data
    $("#loadRepTotal").html("0");
    $("#loadRepAuthor").html("0");
    $("#loadRepAuthority").html("0");
    $("#loadRepDebator").html("0");
    $("#loadRepEditor").html("0");
    $("#loadRepEnquirer").html("0");
    $("#loadRepOrganiser").html("0");
    $("#loadRepParticipant").html("0");
    $("#loadRepDate").html("&nbsp;");

    //Get the raw data passed into the function and store in the holding div
    var raw = rawData;
    holdingdata.innerHTML = raw;

    var theNode = document.getElementById("About");
    if (theNode) {
        holdingdata.innerHTML = "";
        holdingdata.appendChild(theNode);
    }

    //The Total Reputation Member Level is Found in
    if ($("#ctl00_MC_Prof_TotalRepBox").hasClass("nostatus")) { $("#repStatus0").html("&nbsp;"); };
    if ($("#ctl00_MC_Prof_TotalRepBox").hasClass("bronze")) { $("#repStatus0").html("Bronze"); };
    if ($("#ctl00_MC_Prof_TotalRepBox").hasClass("silver")) { $("#repStatus0").html("Silver"); };
    if ($("#ctl00_MC_Prof_TotalRepBox").hasClass("gold")) { $("#repStatus0").html("Gold"); };
    if ($("#ctl00_MC_Prof_TotalRepBox").hasClass("platinum")) { $("#repStatus0").html("Platinum"); };

    //The Total Repution is found in this node
    var thestring = $("#ctl00_MC_Prof_TotalRep");
    if (thestring) { newRep[0] = thestring.text(); } else { newRep[0] = "0"; }

    $("#loadRepTotal").html(newRep[0]);

    //Version 1.5 Change
    //Now we need to locate the Member Rep Table, this has no ID now, but only a class name
    //We can grab the tag with the correct class name

    holdingdata.innerHTML = $('table.member-rep-list').html();

    $("#holdingdata").find("tr").each(function (iTR) {

        //console.log("Table Row: " + iTR);
        $(this).find("td").each(function (iTD) {

            var MemberLevel = "";
            //Version 1.1 4th August 2010, New CSS names
            if ($(this).hasClass("nostatus")) { MemberLevel = "" };
            if ($(this).hasClass("bronze")) { MemberLevel = "Bronze" };
            if ($(this).hasClass("silver")) { MemberLevel = "Silver" };
            if ($(this).hasClass("gold")) { MemberLevel = "Gold" };
            if ($(this).hasClass("platinum")) { MemberLevel = "Platinum" };

            var thevalue = $(this).find("div.medium-text").text();
            if (!thevalue) { thevalue = ""; };

            //Version 1.6 21st March 2011, Additional second link in each category
            //iterate all the links determining a Category/Value pair

            $(this).find("a").each(function (iA) {

                var category = $(this).text();
                if (!category) { category = "No Data"; };

                category = category.toUpperCase(category);

                switch (category) {
                    case ("AUTHOR"):
                        newRep[1] = thevalue;
                        $("#loadRepAuthor").html(newRep[1]);
                        $("#repStatus1").html(MemberLevel);
                        break;

                    case ("AUTHORITY"):
                        newRep[2] = thevalue;
                        $("#loadRepAuthority").html(newRep[2]);
                        $("#repStatus2").html(MemberLevel);
                        break;

                    case ("DEBATOR"):
                        newRep[3] = thevalue;
                        $("#loadRepDebator").html(newRep[3]);
                        $("#repStatus3").html(MemberLevel);
                        break;

                    case ("EDITOR"):
                        newRep[4] = thevalue;
                        $("#loadRepEditor").html(newRep[4]);
                        $("#repStatus4").html(MemberLevel);
                        break;

                    case ("ENQUIRER"):
                        newRep[5] = thevalue;
                        $("#loadRepEnquirer").html(newRep[5]);
                        $("#repStatus5").html(MemberLevel);
                        break;

                    case ("ORGANISER"):
                        newRep[6] = thevalue;
                        $("#loadRepOrganiser").html(newRep[6]);
                        $("#repStatus6").html(MemberLevel);
                        break;

                    case ("PARTICIPANT"):
                        newRep[7] = thevalue;
                        $("#loadRepParticipant").html(newRep[7]);
                        $("#repStatus7").html(MemberLevel);
                        break;
                }
            });
        });
    });

    //Set the Date here
    var theDate = new Date()
    newRep[8] = theDate.toDateString() + " , " + theDate.toLocaleTimeString();
    $("#loadRepDate").html(newRep[8]);

    //Calc the changes
    calcRepChange(oldRep, newRep);

    //hide the loading image and text
    $("#loadRepTable").hide();
    //dump the old holding data
    $("#holdingdata").html("");

    //Save to localStorage
    setNewRepDetail(newRep);
}

// *************************************************
// Load Reputation Graph
// *************************************************
function loadRepGraph() {
    $("#preLoad").show();
    $("#repGraph").hide();

    var sourceimage = getCPRepGraph();

    var loadImage = function (uri) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            document.getElementById("repGraphImg").src
              = window.URL.createObjectURL(xhr.response);
            $("#preLoad").hide();
            $("#repGraph").show();
        }
        xhr.open('GET', uri, true);
        xhr.send();
    }

    loadImage(sourceimage);
    $("#repGraph").attr("src", sourceimage);
}
