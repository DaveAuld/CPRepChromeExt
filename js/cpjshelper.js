
/*************************
    Local Storage Data
**************************/
// -------------------------------------------------
// Retrieve the memberID
// -------------------------------------------------
function getMemberID() {
    var memberID = localStorage["memberID"];
    if (!memberID)
    { memberID = "0"; }
    return memberID.toString();
}

// -------------------------------------------------
// Retrieve the stored Reputation Data
// -------------------------------------------------
function getPrevRepDetail() {
    var prevRep = new Array();
    prevRep[0] = localStorage["prevRepTotal"];
    prevRep[1] = localStorage["prevRepAuthor"];
    prevRep[2] = localStorage["prevRepAuthority"];
    prevRep[3] = localStorage["prevRepDebator"];
    prevRep[4] = localStorage["prevRepEditor"];
    prevRep[5] = localStorage["prevRepEnquirer"];
    prevRep[6] = localStorage["prevRepOrganiser"];
    prevRep[7] = localStorage["prevRepParticipant"];
    prevRep[8] = localStorage["prevRepDate"];

    return prevRep;
}

// -------------------------------------------------
// Save the current Reputation to local storage
// -------------------------------------------------
function setNewRepDetail(repDetail) {
    var newRep = repDetail;
    localStorage["prevRepTotal"] = newRep[0]; 
    localStorage["prevRepAuthor"] = newRep[1];
    localStorage["prevRepAuthority"] = newRep[2];
    localStorage["prevRepDebator"] = newRep[3]; 
    localStorage["prevRepEditor"] = newRep[4];
    localStorage["prevRepEnquirer"] = newRep[5];
    localStorage["prevRepOrganiser"] = newRep[6];
    localStorage["prevRepParticipant"] = newRep[7];
    localStorage["prevRepDate"] = newRep[8]; 
}



/*************************
   CP Content Addresses
**************************/
// -------------------------------------------------
// Get the address of the Reputation Graph on CP
// -------------------------------------------------
function getCPRepGraph() {
    var repAddress = "http://www.codeproject.com/script/Reputation/ReputationGraph.aspx?mid=" + getMemberID();
    return repAddress;
}

// -------------------------------------------------
// Get the address of the member profile page
// -------------------------------------------------
function getCPMemberProfile() {
    var profileAddress = "http://www.codeproject.com/script/Membership/View.aspx?mid=" + getMemberID();
    return profileAddress;
}

// -------------------------------------------------
// Navigate to Members Profile on CodeProject
// -------------------------------------------------
function navProfile() {
    _gaq.push(['_trackEvent', 'ButtonNavMemberProfile', 'clicked']);
    window.open(getCPMemberProfile());
}

// -------------------------------------------------
// Navigate to CodeProject
// -------------------------------------------------
function navCodeProject() {
    _gaq.push(['_trackEvent', 'ButtonNavCodeProject', 'clicked']);
    window.open("http://www.codeproject.com/");
}

// -------------------------------------------------
// Detach the Extension into a Window
// -------------------------------------------------
function extDetach() {
    _gaq.push(['_trackEvent', 'ButtonDetachExt', 'clicked']);
    window.open("cprepwatch.html");
}


/*************************
     CP Profile Data
**************************/
// -------------------------------------------------
// Used to calculate the changes between previous load and current load and set td content
// -------------------------------------------------
  function calcRepChange(oldRep, newRep) 
  {
      //Hold the diff
      var change = 0;

      for (x = 0; x < 8; x++) 
      {
          //Deal with the thousand sep e.g. 7,500  = 7500
          var newVal = newRep[x];newVal = removeThousandSep(newVal); 
          var oldVal = oldRep[x];oldVal = removeThousandSep(oldVal); 

          //change = parseInt(newRep[x]) - parseInt(oldRep[x]);
          change = parseInt(newVal) - parseInt(oldVal);

          if (change == 0)
          { setChangeHTML(x, "NONE", 0); }
          else
          {
              if (change > 0)
              { setChangeHTML(x, "UP", change); }
              else
              { setChangeHTML(x, "DOWN", change * -1); }
              
          }
      }
  }

  // -------------------------------------------------
  // Write the html for the rep point change and valve
  // -------------------------------------------------
    function setChangeHTML(category, changeType, changeVal ) {

        changeVal = insertThousandSep(changeVal);

        var html ="";
        if (changeType == "UP") { html = "<img src='images/up_green.png' alt='Up'>&nbsp;" + changeVal.toString(); }
        if (changeType == "DOWN") {html = "<img src='images/down_red.png' alt='Down'>&nbsp;" + changeVal.toString();}
        if (changeType == "NONE") {html = "<img src='images/no_change.png' alt='No Change'>&nbsp;" + changeVal.toString();}

        var tag = "#repChange" + x.toString();

        $(tag).html(html);
    }

/*************************
 String Number Formatting
**************************/
    // -------------------------------------------------
    // Remove thousand seps e.g. 7,500 = 7500
    // -------------------------------------------------
    function removeThousandSep(input) {
        input = String(input);
        return input.replace(/,/g, '');
    }

    // -------------------------------------------------
    // Add thousand seps e.g. 7000 = 7,000
    // -------------------------------------------------
    function insertThousandSep(input) {
        input = String(input);
        var RegEX = /^(.*\s)?([-+\u00A3\u20AC]?\d+)(\d{3}\b)/
        return input == (input = input.replace(RegEX, "$1$2,$3")) ? input : insertThousandSep(input)
    }