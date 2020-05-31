
function init () {
    ////////////////////////////////////////////////////////////////////////////
    //////////////////////    MAIN PAGE CONTENT HIDING    //////////////////////
    ////////////////////////////////////////////////////////////////////////////
    // initially sets the togglable sections as hidden
    $("#forToggling").toggle();

    // allows user to hide directions for the uber tracker
    // which is useful for mobile users
    function toggleDirections() {
        $("#directions").toggle();
    }

    // allows user to hide everything between the header and the tracker
    // tidying up the space for mobile users
    function toggleWords()
    {
        $("#forToggling").toggle();
    }

    // binds toggle functions to headers
    $("#howToUse").click(toggleDirections);
    $("#trackerToggle").click(toggleWords);
    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////////    SYNC INPUTS    ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    var range =$("#blueChargeVal").get(0);
    var field = $("#blueCharge").get(0);
    var rangeTwo = $("#redChargeVal").get(0);
    var fieldTwo = $("#redCharge").get(0);

    // these bindings tie the range value to numeric inputs
    // so if one changes the other changes the corresponding amount
    range.addEventListener('input', function (e) {
        field.value = e.target.value;
    });
    field.addEventListener('input', function (e) {
        range.value = e.target.value;
    });
    rangeTwo.addEventListener('input', function (e) {
        fieldTwo.value = e.target.value;
    });
    fieldTwo.addEventListener('input', function (e) {
        rangeTwo.value = e.target.value;
    });

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////    RESET BUTTON    ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////


    // these allow for a quick set to 0 button for either team
    // for both the numeric input AND corresponding range slider
    function resetRed() {
        $("#redChargeVal").val(0);
        $("#redCharge").val(0);
    }

    function resetBlue() {
        $("#blueChargeVal").val(0);
        $("#blueCharge").val(0);
    }

    $("#blueReset").click(resetBlue);
    $("#redReset").click(resetRed);

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////    ADVANTAGE PERCENT OUTPUT    //////////////////////
    ////////////////////////////////////////////////////////////////////////////

    // gives a succinct value for how much difference there is between
    // the two teams in uber advantage

    var allInput =$(".watchForChange").get(0);

    function updateDifference() {
        var formattedPercent;
        var temp = $("#blueCharge").val() - $("#redCharge").val();
        temp = Math.abs(temp);
        formattedPercent = temp +"%";
        $("#advantagePercent").text(formattedPercent);
    }

    $(".watchForChange").change(updateDifference);
    $(".currentPercent").change(updateDifference);
    $("input").click(updateDifference);
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////    ERROR OUTPUT    ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    // this error output is included here, for some reason if
    // numeric min and max ranges are ignored. Overall this code is mostly
    // useless as the range input CANNOT exceed range, and the number field
    // treats exceeded values as the closest valid value, which temporarily
    // appears out of range, but will snap back within range if the value is
    // altered in any way

    var allInputsValid = true;
    $("#error").hide();

    function validateInputs()
    {
        $("#error").text("");

        allInputsValid = true;
        if($("#blueCharge").val()<0 || $("#blueCharge").val()>100)
        {
            $("#error").append("UBER VALUE MUST BE BETWEEN 0 AND 100");
            allInputsValid = false;
            $("#error").show();
        }
        if($("#redCharge").val()<0 || $("#redCharge").val()>100)
        {
            if(allInputsValid)
            {
                $("#error").append("<br>");
            }
            $("#error").append("UBER VALUE MUST BE BETWEEN 0 AND 100");
            allInputsValid = false;
            $("#error").show();
        }
        if($("#wowPls").val()<0)
        {
            if(allInputsValid)
            {
                $("#error").append("<br>");
            }
            $("#error").append("MINUTES MAY NOT BE NEGATIVE");
            allInputsValid = false;
            $("#error").show();
        }
        if($("#wowPlsTwo").val()<0 || $("#wowPlsTwo").val()>60)
        {
            if(allInputsValid)
            {
                $("#error").append("<br>");
            }
            $("#error").append("SECONDS MUST BE BETWEEN 0 AND 60");
            allInputsValid = false;
            $("#error").show();
        }
        if(allInputsValid)
        {
            $("#error").hide();
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ///////////////////////////    POINTER INDICATOR   /////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    // these functions provide additional visual input to which team has
    // the uber advantage
    function setArrows() {
        var temp = $("#blueCharge").val() - $("#redCharge").val();
        if(temp == 0)
        {
            // if both charges are equal, no one has advantage
            // neither arrow should light up
            $("#upArrow").attr("src","indicatorUp.png");
            $("#downArrow").attr("src","indicatorDown.png");
        }
        else if(temp > 0)
        {
            // if blue charge is greater than red charge
            // up arrow should light up
            $("#upArrow").attr("src","advantageUp.png");
            $("#downArrow").attr("src","indicatorDown.png");
        }
        else if(temp < 0)
        {
            // if blue charge is less than red charge
            // down arrow should light up
            $("#upArrow").attr("src","indicatorUp.png");
            $("#downArrow").attr("src","advantageDown.png");
        }
    }

    $("input").click(setArrows);

    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////    KRITZ   ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    // this function gives a visual indicator if an uber reaches 75%
    // which is relevant in the game given that the enemy medic
    // theoretically might be using a faster charging medigun
    function kritzLight() {
        if($("#blueCharge").val() >= 75)
        {
            $("#kritzBlue").css("color", "cyan");
            $("#kritzBlue").css("border-color", "cyan");
        }
        else
        {
            $("#kritzBlue").css("color", "rgba(169, 169, 169, 0.73)");
            $("#kritzBlue").css("border-color", "rgba(169, 169, 169, 0.73)");
        }

        if($("#redCharge").val() >= 75)
        {
            $("#kritzRed").css("color", "cyan");
            $("#kritzRed").css("border-color", "cyan");
        }
        else
        {
            $("#kritzRed").css("color", "rgba(169, 169, 169, 0.73)");
            $("#kritzRed").css("border-color", "rgba(169, 169, 169, 0.73)");
        }
    }

    $("input").click(kritzLight);

    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////    TIMER   ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    // this section includes functions that control not only the visual indicator
    // of the timer, but the rate at which uber builds

    const SECONDS_PER_MINUTE = 60;
    var numSeconds = 0;
    var timerRunning = false;
    var timerInterval;
    var singleInterval = 1;
    var uberInterval = 1;

    // this function toggles the visual value on the button itself
    // and controls whether that button starts or stops the timer
    function toggleTimer()
    {
        validateInputs();
        if(allInputsValid)
        {
            if(timerRunning)
            {
                stopClock();
                $("#timerStop").val("START");
                timerRunning = false;
            }
            else
            {
                startClock();
                $("#timerStop").val("PAUSE");
                timerRunning = true;
            }
        }
    }

    // this function handles the bulk of the timer mechanics
    // of what happens every time the interval increases
    function updateClock()
    {
        var clockOutput;
        var minutes;
        var seconds;
        var temp;
        minutes = Math.floor(numSeconds / SECONDS_PER_MINUTE);
        seconds = numSeconds % SECONDS_PER_MINUTE;

        // this conditional controls whether the output of
        // the number of seconds includes an extra 0
        if(seconds <10)
        {
            seconds = "0" + seconds;
        }

        // these lines of code set the input value/output of the timer itself
        $("#wowPls").val(minutes);
        $("#wowPlsTwo").val(seconds);

        // these lines of code uptick control variables
        // since our intervals run multiple times per second,
        // things need to be controlled so they only operate at the right time
        singleInterval++;
        uberInterval++;

        // every 10 iterations is one second, so the
        // displayed seconds only changes every 10 iterations
        if(singleInterval==10){
            numSeconds--;
            singleInterval=0;
            // if the seconds reach 0, the timer should stop
            if (numSeconds == 0)
            {
                toggleTimer();
            }
        }

        // it takes 40 seconds for an ubercharge to go from 0% to 100%
        // which is slightly slower than the rate that the interval upticks
        if(uberInterval == 4)
        {
            // the ubercharge is only increased if the current % is below 100
            temp = parseFloat($("#blueCharge").val());
            if(temp < 100)
            {
                temp++;
                $("#blueCharge").val(temp);
                $("#blueChargeVal").val(temp);
            }

            temp = parseFloat($("#redCharge").val());
            if(temp < 100)
            {
                temp++;
                $("#redCharge").val(temp);
                $("#redChargeVal").val(temp);
            }
            uberInterval = 0;

            // the difference, the kritz indicator, and the arrow indicators
            // can only logically change when the uber changes
            updateDifference();
            kritzLight();
            setArrows();
        }
    }

    function startClock()
    {
        numSeconds = $("#wowPls").val() * 60;
        numSeconds += parseInt($("#wowPlsTwo").val());
        timerInterval = setInterval(updateClock, 100);
    }

    // this function stops the timer
    function stopClock()
    {
        if (numSeconds == 0)
        {
            // because the interval is less than a second
            // when the timer runs out, the display can get caught with
            // a second still left, so this line sets it to 0
            $("#wowPlsTwo").val("00");
        }
        if (timerInterval)
        {
            clearInterval(timerInterval);
        }
    }

    $("#timerStop").click(toggleTimer);
}

$(init);