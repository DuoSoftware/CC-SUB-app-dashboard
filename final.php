<?php
$apptoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ew0KCQkJIndpZCI6ImNmYzJhOWU1LTk3NGMtNGU0NC1hZmVhLTlkNjE5MDNjN2FjNiIsDQoJCQkicmlkIjoiODdkMTUzOGUtZWVjYS00NGM4LTgyZDctZDgyYTg0OWI3ZWU5IiwNCgkJCSJzY3AiOiAiRGF0YXNldC5SZWFkIFdvcmtzcGFjZS5SZXBvcnQuQ3JlYXRlIiwNCgkJCSJ0eXBlIjoiZW1iZWQiLA0KCQkJIndjbiI6ImNsb3VkY2hhcmdlcG93ZXJiaSIsDQoJCQkiaXNzIjoiUG93ZXJCSVNESyIsDQoJCQkidmVyIjoiMC4yLjAiLA0KCQkJImF1ZCI6Imh0dHBzOi8vYW5hbHlzaXMud2luZG93cy5uZXQvcG93ZXJiaS9hcGkiLA0KCQkJIm5iZiI6IjE0OTA1OTQ0ODciLA0KCQkJImV4cCI6IjE0OTA1OTgwODcifQ.__YWk-uSuwzMC3gOSEtP0n2NfhuWRYI_hlHTuaxlryM";
//?reportId=7b863a3a-e1e4-41dc-9be5-0a67d71d9495
?>



<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Test page</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
 <style>
  #reportContainer {
    width: 100%;
    height: 450px;
    background-color: white;
    padding: 0px;
    clear: both;
}
</style>
<body>
	<button id="btnView">View Report !</button>
	<script src="https://code.jquery.com/jquery-3.2.0.min.js"></script>
	<script src="scripts/powerbi.js"></script>
		<div id="reportContainer">test</div>
<script>

//Read embed application token from textbox
var txtAccessToken = "<?=$apptoken?>";
 
// Read embed URL from textbox
var txtEmbedUrl = 'https://embedded.powerbi.com/appTokenReportEmbed?reportId=87d1538e-eeca-44c8-82d7-d82a849b7ee9';
 
// Read report Id from textbox
var txtEmbedReportId = '87d1538e-eeca-44c8-82d7-d82a849b7ee9';
 
// Get models. models contains enums that can be used.
var models = window['powerbi-client'].models;
 
// We give All permissions to demonstrate switching between View and Edit mode and saving report.
var permissions = models.Permissions.All;
 
// Embed configuration used to describe the what and how to embed.
// This object is used when calling powerbi.embed.
// This also includes settings and options such as filters.
// You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
  var config= {
    type: 'report',
    accessToken: txtAccessToken,
    embedUrl: txtEmbedUrl,
    id: txtEmbedReportId,
    permissions: permissions,
    settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true
    }
};

/* var config= {
    type: 'report',
    accessToken: txtAccessToken,
    embedUrl: txtEmbedUrl,
    id: txtEmbedReportId,
    permissions: models.Permissions.All ,
    viewMode: models.ViewMode.Edit,
    settings: {
    	filterPaneEnabled: true,
        navContentPaneEnabled: true,
        useCustomSaveAsDialog: true
    }
}; 
  */
/* var config = {
	    accessToken: txtAccessToken,
	    embedUrl: txtEmbedUrl,
	    datasetId: txtEmbedDatasetId,
	}; */
// Get a reference to the embedded report HTML element
var reportContainer = $('#reportContainer')[0];
 
// Embed the report and display it within the div container.
var report = powerbi.embed(reportContainer, config);
report.fullscreen();  
report.getPages()
.then(function (pages) {
    pages.forEach(function(page) {
        var log = page.name + " - " + page.displayName;
        Log.logText(log);
    });
})
.catch(function (error) {
    Log.log(error);
});

//var report = powerbi.createReport(reportContainer, embedCreateConfiguration);
 
// Report.off removes a given event handler if it exists.
report.off("loaded");
 
// Report.on will add an event handler which prints to Log window.
report.on("loaded", function() {
    Log.logText("Loaded");
});
 
report.on("error", function(event) {
    Log.log(event.detail);
     
    report.off("error");
});
 
report.off("saved");
report.on("saved", function(event) {
    Log.log(event.detail);
    if(event.detail.saveAs) {
        Log.logText('In order to interact with the new report, create a new token and load the new report');
     }
 });
</script>
</body>
</html>