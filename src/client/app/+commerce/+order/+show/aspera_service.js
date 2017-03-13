//******************************************************
//Global variables
//******************************************************
//nodeInterpreter is location of server side web application
//It is used for all AJAX calls
// var nodeInterpreter = "/getAsperaInfo";

//******************************************************
//Functions for handling Node requests
//******************************************************

//Makes AJAX call sending location of file to download
//Receives transferSpec (JSON) from server and passes to handler
function downloadFile(caller, path) {
    jQuery.ajax({
        type: 'POST',
        url: "/getAsperaInfo",
        data: {download: path}
    })
            .done(function (data) {
                if (data === null) {
                  alert("Aspera encountered an error. Please download via HTTPS.")
                }
                handleDownload(caller, data)
            })
            .fail(function (jqXHR, textStatus) {
                failure(textStatus);
            });
}


//******************************************************
//These functions are our handlers.  They take the returned data from the AJAX call and process it
//******************************************************

function initConnect(id, callback, caller, spec) {
  var asperaWeb = {};
  var CONNECT_INSTALLER = 'https://d3gcli72yxqn2z.cloudfront.net/connect/v4';
  var asperaWeb = new AW4.Connect({
    sdkLocation: CONNECT_INSTALLER,
    minVersion: '3.6.0',
    id: "aspera_web_transfers-" + id
  });
  var asperaInstaller = new AW4.ConnectInstaller({
    sdkLocation: CONNECT_INSTALLER
  });
  var statusEventListener = function (eventType, data) {
    var status = AW4.Connect.STATUS;
    if (eventType === AW4.Connect.EVENT.STATUS) {
      if (data === status.INITIALIZING) {
        asperaInstaller.showLaunching();
      }
      if (data === status.FAILED) {
        asperaInstaller.showDownload();
      }
      if (data === status.OUTDATED) {
        asperaInstaller.showUpdate();
      }
      if (data === status.RUNNING) {
        asperaInstaller.connected();
        callback(caller, spec, asperaWeb, id);
      }
    }
  };
  asperaWeb.addEventListener(AW4.Connect.EVENT.STATUS, statusEventListener);
  asperaWeb.initSession('nodeConnect-' + id);
}

//Handler for downloads.  'caller' is reference to HTML element who made the call (for updating progress) and 'spec' is the
//transferSpec returned from server.
//Starts Connect Client and starts transfer

function handleDownload(caller, spec) {
  var random = Math.floor((Math.random() * 10000) + 1);
  initConnect(random, handleDownloadCallback, caller, spec);
}

var handleDownloadCallback = function (caller, spec, asperaWeb, random) {
    //random is a random number used for creating multiple instances of downloads/uploads
    fileControls = {};
    var uready = false;

    //Progress bar handler
    fileControls.handleTransferEvents = function (event, returnObj) {
        var obj = returnObj.transfers[0];
        if(!obj)
        {
          obj = {};
        }
        //Wait for initiating status to avoid reading past events, 'uready' lets us know when we start
        if (obj.status == 'initiating' ||  obj.previous_status == 'initiating')
        {
            uready = true;
        }
        if (uready)
        {
			//Received failed, add red background to td and print error message.  Operation is done.
            if (obj.status == 'failed')
            {
                jQuery(caller).closest("td").children(".progressMessage").text('The Download Failed: ' + obj.error_desc + ' (' + obj.error_code + ')');
                jQuery(caller).closest("td").attr("style", "background-color: #f2dede;");
                failure(obj.error_desc + ' (' + obj.error_code + ')');
                uready = false;
            }

			//Received completed, add green background to td and print Complete message.  Operation is done.
            else if (obj.status == 'completed')
            {
                jQuery(caller).closest("td").children(".progressMessage").text("Download Complete");
                jQuery(caller).closest("td").attr("style", "background-color: #dff0d8;");
                uready = false;
                asperaWeb.removeEventListener('transfer');
            }
			//Transfer in progress, use gradient effect to show background moving (like loading bar).  Need to include gradient for all browsers.
            else
            {
                switch (event) {
                    case 'transfer':
                    	if (!isNaN(obj.percentage))
                    	{
                        	jQuery(caller).closest("td").children(".progressMessage").text("Downloading (" + Math.floor(obj.percentage * 100) + "%)");
                        	jQuery(caller).closest("td").attr("style", "background: -moz-linear-gradient(left, rgba(223,240,216,1) " + Math.floor(obj.percentage * 100) + "%, rgba(223,240,216,0) " + (Math.floor(obj.percentage * 100) + 1) + "%, rgba(255,255,255,0) " + (Math.floor(obj.percentage * 100) + 2) + "%); background: -webkit-gradient(linear, left top, right top, color-stop(" + Math.floor(obj.percentage * 100) + "%,rgba(223,240,216,1)), color-stop(" + (Math.floor(obj.percentage * 100) + 1) + "%,rgba(223,240,216,0)), color-stop(" + (Math.floor(obj.percentage * 100) + 2) + "%,rgba(255,255,255,0))); background: -webkit-linear-gradient(left, rgba(223,240,216,1) " + Math.floor(obj.percentage * 100) + "%,rgba(223,240,216,0) " + (Math.floor(obj.percentage * 100) + 1) + "%,rgba(255,255,255,0) " + (Math.floor(obj.percentage * 100) + 2) + "%); background: -o-linear-gradient(left, rgba(223,240,216,1) " + Math.floor(obj.percentage * 100) + "%,rgba(223,240,216,0) " + (Math.floor(obj.percentage * 100) + 1) + "%,rgba(255,255,255,0) " + (Math.floor(obj.percentage * 100) + 2) + "%); background: -ms-linear-gradient(left, rgba(223,240,216,1) " + Math.floor(obj.percentage * 100) + "%,rgba(223,240,216,0) " + (Math.floor(obj.percentage * 100) + 1) + "%,rgba(255,255,255,0) " + (Math.floor(obj.percentage * 100) + 2) + "%); background: linear-gradient(to right, rgba(223,240,216,1) " + Math.floor(obj.percentage * 100) + "%,rgba(223,240,216,0) " + (Math.floor(obj.percentage * 100) + 1) + "%,rgba(255,255,255,0) " + (Math.floor(obj.percentage * 100) + 2) + "%)");
                        }
                        break;
                }
            }
        }
    };
    asperaWeb.addEventListener('transfer', fileControls.handleTransferEvents);

    //Block Connect Dialog from appearing, since we are showing progress on web app
    connectSettings = {
        "allow_dialogs": "no"
    };

    //Start Download using Connect
    var transferSpec = spec.transfer_specs[0].transfer_spec;
    transferSpec['target_rate_kbps'] = 100000;
    //Add token authentication tag to JSON since is it not returned with transferSpec.
    transferSpec.authentication = "token";
    asperaWeb.startTransfer(transferSpec, connectSettings);
}


//******************************************************
//Below are functions for the front end (Helper functions and GUI functions)
//Some functions are optional depending on need, however, if you remove them you need to remove any calls to them
//******************************************************

//Global error handling.  Use this whenever an error occurs. (Optional)
function failure(message) {
	//For this example we print errors in footer, however, you may want to log them in Console
    jQuery("#log-data").text("An error occurred: " + message);
}

//Take the raw date from Node and make it a cleaner format (Optional)
//This version prints with US English (language and structure), you may need to change for your needs
//This function also takes the local time offset of the client and converts to local
function cleanDate(date) {
    var cleanDate = "";
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var parts = date.split("T");
    var dateParts = parts[0].split("-");
    var timeParts = (parts[1].split("Z")[0]).split(":");
    //Create Date object in UTC to allow for proper timezone based on user
    var jsDate = new Date(Date.UTC(dateParts[0], parseInt(dateParts[1])-1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]));
    var amPm = "AM";
    var hour = jsDate.getHours();
    if (hour >= 12)
    {
        amPm = "PM";
        hour = hour - 12;
    }
    if(hour == "00")
    {
    	hour = "12"
    }
    //Final Structure of entire date
    cleanDate = months[jsDate.getMonth()] + " " + jsDate.getDate() + ", " + jsDate.getFullYear() + " " + hour + ":" + jsDate.getMinutes() + ":" + jsDate.getSeconds() + " " + amPm;
    return cleanDate;
}

//Take the raw size from Node (bytes) and make it a cleaner format (Optional)
function cleanSize(size) {
    if (size == 0)
    {
        return "";
    }
    var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    var base = Math.floor(Math.log(size) / Math.log(1000));
    return (size / Math.pow(1000, base)).toFixed(2) + ' ' + units[base];
}

//******************************************************
//Below are functions for the front end Sorting and Searching
//If you do not want to use Sorting or Searching you can delete this section
//******************************************************

//Compares either alt data or item text for sorting columns (Optional)
function compare(index) {
        return function (a, b) {
        if ((a.cells.item(index).hasAttribute("alt")) && (b.cells.item(index).hasAttribute("alt")))
        {
            var valA = a.cells.item(index).getAttribute("alt");
            var valB = b.cells.item(index).getAttribute("alt");
        }
        else
        {
                    	var valA = jQuery(a).children('td').eq(index).html();
            var valB = jQuery(b).children('td').eq(index).html()
        }
                return jQuery.isNumeric(valA) && jQuery.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
        }
}

//Search names of items.  If item does not match search it is hidden.  This triggers after every keystroke (including backspace) (Optional)
//If you change structure or class names you will need to change them here
function searchListings()
{
    var searchString = jQuery("#search-term").val().toLowerCase();
    jQuery("td.name-col").parent("tr").show();
    jQuery("td.name-col").each(function () {
        if (!((jQuery(this).text().toLowerCase()).indexOf(searchString) > -1))
        {
            jQuery(this).parent("tr").hide();
        }
    });
    if (jQuery("#fileListTable tbody").children(".dirListingRow:visible").length == 0)
    {
        //We need to print a message to tell user no results (not just list nothing)
        if (!(jQuery("#searchError").length))
        {
            jQuery("#fileListTable").append("<tr id='searchError'><td colspan='5'>Your search returned no results</td></tr>");
        }
    }
    else
    {
        //We now have results, remove error
        jQuery("#searchError").remove();
    }
}

//Clear the search box by emptying it and performing search again (which will show all) (Optional if not using Search)
function clearSearch() {
    jQuery("#search-term").val("");
    searchListings();
    jQuery("#clearSearch").fadeOut("slow");
}
