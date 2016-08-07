/**
 * Created by Dave on 3/12/2016.
 */
$(document).ready(function () {
    ///////////////////////////////
    // Global Variables & Objects
    ///////////////////////////////
    var queryArray = [];
    var RsIndexArray = [];
    var selectedReportType = '';
    var firstQsItem = true;
    var firstRsItem = true;
    var boolFormValidation = true;

    ///////////////////////////////
    // Initializations
    ///////////////////////////////

    //Sort table
    $( "#sortable" ).sortable({
        placeholder: "ui-state-highlight"
    });
    $( "#sortable" ).disableSelection();

    //Bootstrap Tooltips
    $("[data-toggle=tooltip]").tooltip();


    ///////////////////////////////
    // Event Handlers
    ///////////////////////////////

    //Build Query button click event handler
    $("#compute").click(
        function () {
            //build ordered array for sorted report spec list
            buildRsIndexArray();

            //Validate the form
            ValidateFields();

            //Generate query if no errors were found
            if (boolFormValidation == true){
                BuildQuery();
                $('#alertcontainer').html("<div class='alert alert-success alert-dismissible' role='alert'>" +
                    "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>" +
                    "&times;</span></button><strong>Success!</strong> The mminfo command was generated successfully.</div>");
            }
        }
    );

    //Shows advanced options only when advanced report is selected
    $('input:radio[name="reporttype"]').change(
        function(){
            if ($(this).is(':checked') && $(this).val() == 'advanced') {
                $('#rsoptions').slideDown();
            } else{
                $('#rsoptions').slideUp();
            }
        });




    ///////////////////////////////
    // Functions
    ///////////////////////////////
    function firstRsFieldCheck() { //Checks if the first report spec item
        if (firstRsItem == false) {
            queryArray.push(', ');
        } else {
            queryArray.push(' -r "');
            firstRsItem = false;
        }
    }

    function firstQsFieldCheck() { //Checks if the first report spec item
        if (firstQsItem == false) {
            queryArray.push(', ');
        } else {
            queryArray.push(' -q "');
            firstQsItem = false;
        }
    }

    function buildRsIndexArray(){
        RsIndexArray = [];
        $('.ui-state-default').each(function(index){
            RsIndexArray.push($(this).attr('id'));
        });
    }

    function BuildQuery() {
        queryArray = []; //empty array
        firstQsItem = true; //reset var
        firstRsItem = true; //reset var

        queryArray.push('mminfo');

        //select basic or media report (-avot)
        selectedReportType = $('input[name=reporttype]:checked').val();
        if (selectedReportType == 'basicss') {
            queryArray.push(" -avot");
        } else if (selectedReportType == 'media'){
            queryArray.push(" -m");
        }

        //queryspec
        if ($('#qs_client_chk').prop('checked')) {
            firstQsFieldCheck();
            queryArray.push("client=",$('#qs_client_txt').val());
        }
        if ($('#qs_group_chk').prop('checked')) {
            firstQsFieldCheck();
            queryArray.push("group=",$('#qs_group_txt').val());
        }
        if ($('#qs_ssid_chk').prop('checked')) {
            firstQsFieldCheck();
            queryArray.push("ssid=", $('#qs_ssid_txt').val());
        }
        if ($('#qs_level_chk').prop('checked')) {
            firstQsFieldCheck();
            queryArray.push("level=",$('#qs_level_txt').val());
        }
        if ($('#qs_volume_chk').prop('checked')) {
            firstQsFieldCheck();
            queryArray.push("volume=", $('#qs_volume_txt').val());
        }
        if ($('#qs_pool_chk').prop('checked')) {
            firstQsFieldCheck();
            queryArray.push("pool=",$('#qs_pool_txt').val());
        }
        if (firstQsItem == false){
            queryArray.push('"');
        }


        //reportspec
        if (selectedReportType == 'advanced') {
            var RsIndexLength = RsIndexArray.length;
            for (var j = 0; j < RsIndexLength; j++) {
                switch (RsIndexArray[j]) {
                    case 'rs_ssid_li':
                        if ($('#rs_ssid_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("ssid");
                        }
                        break;
                    case 'rs_cloneid_li':
                        if ($('#rs_cloneid_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("cloneid");
                        }
                        break;
                    case 'rs_volume_li':
                        if ($('#rs_volume_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("volume");
                        }
                        break;

                    case 'rs_pool_li':
                        if ($('#rs_pool_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("pool");
                        }
                        break;

                    case 'rs_sumflags_li':
                        if ($('#rs_sumflags_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("sumflags");
                        }
                        break;
                    case 'rs_savetime_li':
                        if ($('#rs_savetime_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("savetime");
                        }
                        break;
                    case 'rs_ssbrowse_li':
                        if ($('#rs_ssbrowse_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("ssbrowse");
                        }
                        break;
                    case 'rs_ssretent_li':
                        if ($('#rs_ssretent_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("ssretent");
                        }
                        break;
                    case 'rs_mediafile_li':
                        if ($('#rs_mediafile_chk').prop('checked')) {
                            firstRsFieldCheck();
                            queryArray.push("mediafile");
                        }
                        break;
                }
            }
            //Add ending quote to reportspec part of query
            if (firstRsItem == false){
                queryArray.push('"');
            }
        }

        //Prepare query text for output
        var outputText = '';
        var arrayLength = queryArray.length;
        for (var i = 0; i < arrayLength; i++) {
            //contents of queryArray into outputText
            outputText = outputText.concat(queryArray[i]);
        }
        $('#output').text(outputText);
        $('#output-container').show();
    }

    function ValidateFields (){
        //Find all checked queryspec items and ensure the textbox is not empty
        $('input:checkbox[id^="qs_"]:checked').each(function(){
            //Finds checkboxes, but outputs the textbox
            var qsTxt = $(this).attr('id').replace('chk','txt');
            //Is the text box empty?
            if ($('#'+ qsTxt).val() == ''){
                //Yes it is
                $('#alertcontainer').html("<div class='alert alert-danger alert-dismissible' role='alert'>" +
                    "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>" +
                    "&times;</span></button><strong>Invalid!</strong> Fields checked in Step 1 can't be empty. Please correct the form and try again.</div>");

                //Hide the command ouput area
                $('#output-container').slideUp();

                //Flag validation as failed
                boolFormValidation = false;
            } else{
                boolFormValidation = true;
            }
        })

        //Check for Advanced report selected but no child options checked
        var rsSelected = false;
        var selectedReportType2 = $('input[name=reporttype]:checked').val();
        if (selectedReportType2 == 'advanced'){
            $('input:checkbox[id^="rs_"]:checked').each(function(){
                rsSelected = true;
                //Breaks from function, rsSelected only needs to be set to true once
                return false;
            })
            //if a reportspec element was checked, rsSelected should be true
            if (rsSelected == false){
                //Fire alert
                alert("You selected advanced report, but chose no options.");
            }
        }

        //Check for just basic report selected & warn of large query
    }
});
