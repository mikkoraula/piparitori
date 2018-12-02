function initStatisticsRefresh() {
    $("#tables-parent").css('display', 'flex');
    setData();
    setInterval(setData, 500);
}


function setData() {
    $.ajax({
        type: 'GET',
        url: '/refresh/',
        dataType: 'json',                              
        contentType: 'application/json; charset=utf-8'
    })
    .done(function(result) {
        
        var lives = 0;
        var maxLives = 0;
        var deathRNG = 0;
        var deathProbability = 0;
        var maxLivesRNG = 0;
        var maxLivesProbability = 0;
        var speed = 0;
        var minSpeed = 0;
        var maxSpeed = 0;
        var speedChangeRNG = 0;
        var speedChangeProbability = 0;
        var speedChangeDirection = 0;


        
        $('#td-rotations').text(result.rotations);
    
        $('#td-intensity').text(result.intensity);
        //lives = value;
        $('#td-value-lives').text(result.lives);
        //setColor($('#td-lives'), -lives, -1);
        //maxLives = value;
        $('#td-value-maxLives').text(result.maxLives);
        setColor($('#td-lives'), -result.lives, -1);
        //deathRNG = value.toFixed(2);
        $('#td-value-deathRNG').text(parseInt(result.deathRNG * 100));
        //setColor($('#td-deathRNG'), deathRNG, deathProbability);
        //deathProbability = value;
        $('#td-value-deathProbability').text(result.deathProbability * 100);
        setColor($('#td-deathRNG'), result.deathRNG, result.deathProbability);
        //maxLivesRNG = value.toFixed(2);
        $('#td-value-maxLivesRNG').text(parseInt(result.maxLivesRNG * 100));
        //setColor($('#td-maxLivesRNG'), maxLivesRNG, maxLivesProbability);
        //maxLivesProbability = value;
        $('#td-value-maxLivesProbability').text(result.maxLivesProbability * 100);
        setColor($('#td-maxLivesRNG'), result.maxLivesRNG, result.maxLivesProbability);
        
        //speed = value;
        $('#td-speed').text(result.speed);
        //minSpeed = value;
        //maxSpeed = value;
        //speedChangeRNG = value.toFixed(2);
        $('#td-value-speedChangeRNG').text(parseInt(result.speedChangeRNG * 100));
        //setColor($('#td-speedChangeRNG'), speedChangeRNG, speedChangeProbability);
        //speedChangeProbability = value;
        $('#td-value-speedChangeProbability').text(result.speedChangeProbability * 100);
        setColor($('#td-speedChangeRNG'), result.speedChangeRNG, result.speedChangeProbability);
        //speedChangeDirection = value;
        $('#td-speedChange').text(result.speedChangeDirection);
        // if -1 show negative color, if 1 show positive color
        setColor($('#td-speedChange'), -result.speedChangeDirection, 0);

        /*
        $.each( result, function( key, value ) {
            $("#tables-parent").css('display', 'flex');
            
            if (key == 'rotations') {
                $('#td-rotations').text(value);
            } else if (key == 'intensity') {
                $('#td-intensity').text(value);
            }
            
            else if (key == 'lives') {
                lives = value;
                $('#td-value-lives').text(lives);
                setColor($('#td-lives'), -lives, -1);
            } else if (key == 'maxLives') {
                maxLives = value;
                $('#td-value-maxLives').text(maxLives);
                setColor($('#td-lives'), -lives, -1);
            } else if (key == 'deathRNG') {
                deathRNG = value.toFixed(2);
                $('#td-value-deathRNG').text(deathRNG);
                setColor($('#td-deathRNG'), deathRNG, deathProbability);
            } else if (key == 'deathProbability') {
                deathProbability = value;
                $('#td-value-deathProbability').text(deathProbability);
                setColor($('#td-deathRNG'), deathRNG, deathProbability);
            } else if (key == 'maxLivesRNG') {
                maxLivesRNG = value.toFixed(2);
                $('#td-value-maxLivesRNG').text(maxLivesRNG);
                setColor($('#td-maxLivesRNG'), maxLivesRNG, maxLivesProbability);
            } else if (key == 'maxLivesProbability') {
                maxLivesProbability = value;
                $('#td-value-maxLivesProbability').text(maxLivesProbability);
                setColor($('#td-maxLivesRNG'), maxLivesRNG, maxLivesProbability);
            }
            
            else if (key == 'speed') {
                speed = value;
                $('#td-speed').text(speed);
            } else if (key == 'minSpeed') {
                minSpeed = value;
            } else if (key == 'maxSpeed') {
                maxSpeed = value;
            } else if (key == 'speedChangeRNG') {
                speedChangeRNG = value.toFixed(2);
                $('#td-value-speedChangeRNG').text(speedChangeRNG);
                setColor($('#td-speedChangeRNG'), speedChangeRNG, speedChangeProbability);
            } else if (key == 'speedChangeProbability') {
                speedChangeProbability = value;
                $('#td-value-speedChangeProbability').text(speedChangeProbability);
                setColor($('#td-speedChangeRNG'), speedChangeRNG, speedChangeProbability);
            } else if (key == 'speedChangeDirection') {
                speedChangeDirection = value;
                $('#td-speedChange').text(speedChangeDirection);
                // if -1 show negative color, if 1 show positive color
                setColor($('#td-speedChange'), -speedChangeDirection, 0);
            }
            

            // create old table
            var table = $("#statsTable");
            table.empty();
            table.append("<tr><th>" + key + "</th><td>" + value + "</td></tr>"); 
        });
        */

        
        //$("#isMotorRunning").text('Motor is running: ' + result.isMotorRunning);
        //$("#rotations").text('Rotations ' + result.rotations + '/' + result.totalRotations);
        //$("#speed").text('Current speed: ' + result.speed);
    })
    .fail(function(xhr, status, error) {
        console.log(error);
    })
    .always(function(data){
        console.log(data);
    });
}

function setColor(element, firstValue, secondValue) {
    if (firstValue < secondValue) {
        element.removeClass('td-negative').addClass('td-positive');
    } else {
        element.removeClass('td-positive').addClass('td-negative');
    }
}
