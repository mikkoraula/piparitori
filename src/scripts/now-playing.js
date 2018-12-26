var mainContainer = document.getElementById('now-playing-box'),
	loginContainer = document.getElementById('spotify-login-container'),
	loginButton = document.getElementById('js-btn-login'),
	logoutButton = document.getElementById('js-btn-logout'),
	//playPauseButton = document.getElementById('js-btn-play-pause'),
	//previousButton = document.getElementById('js-btn-previous'),
	//nextButton = document.getElementById('js-btn-next'),
	background = document.getElementById('js-background'),
	data = null,
  //analysisObject = {},
  currentSectionIndex = 0,
  isPlaying = false,
  currentTrack = null;

const playListLink = 'https://open.spotify.com/playlist/4NKsSnlLwvwkh6RRucs5bd';
const playListUri = 'spotify:user:117447786:playlist:4NKsSnlLwvwkh6RRucs5bd';
const server = 'http://192.168.43.130:5000';

var spotifyPlayer = new SpotifyPlayer({
  exchangeHost: server
});

var nowPlayingTemplate = function (data) {
  return `
    <div id="now-playing-box">
      <img class="now-playing__img" src="${data.item.album.images[0].url}">
      <div class="now-playing__text">
        <div class="now-playing__name">${data.item.name}</div>
        <div class="now-playing__artist">${data.item.artists[0].name}</div>
        <div class="now-playing__status">${msecondsToString(data.progress_ms)} - ${msecondsToString(data.item.duration_ms)}</div>
      </div>
    </div>
    <div class="background" style="background-image:url(${data.item.album.images[0].url})"></div>
  `;
};

spotifyPlayer.on('update', response => {
  if (window.location.href.toString().startsWith(server + '/gallery') || window.location.href.toString() === server + '/')
    return;
  //console.log(window.location.href.toString());
  data = response;
  // track has changed since last update, fetch analysis object
  if (data.item && data.item.name !== currentTrack) {
    console.log("track changed ");
    trackChanged(data.item, data.progress_ms);
  } 
  // track has not changed, but song is about to move to new section
  //else if (analysisObject.sections[currentSectionIndex].start + analysisObject.sections[currentSectionIndex].duration + 1 < data.progress_ms / 1000) {
    //console.log("sync lights");
    //syncLights(data.progress_ms)
  //}
  isPlaying = response.is_playing;
  mainContainer.innerHTML = nowPlayingTemplate(response);
  //playPauseButton.innerHTML = isPlaying ? "Pause" : "Play";
  currentTrack = data.item ? data.item.name : null;
});

spotifyPlayer.on('login', user => {
  if (user === null) {
    loginContainer.style.display = 'block';
    mainContainer.style.display = 'none';
  } else {
    loginContainer.style.display = 'none';
    mainContainer.style.display = 'block';
  }
});

loginButton.addEventListener('click', () => {
    spotifyPlayer.login();
});

logoutButton.addEventListener('click', () => {
    spotifyPlayer.logout();
});

var msecondsToString = function(millliseconds) {
  var seconds = millliseconds / 1000;
  var m = Math.floor(seconds / 60);
  var s = Math.floor(seconds - m * 60);
  return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
}

var syncLights = function(progress_ms, analysisObject) {
  var timeStamp = new Date().getTime();
  var sendObject = {};
  var nextBeatIndex = 0;
  for (var i = 0; i < analysisObject.beats.length; i++) {
    //console.log("start ", analysisObject.beats[i].start, " < ", progress_ms / 1000);			    
    //console.log(i);
    if (analysisObject.beats[i].start >= progress_ms / 1000) {
      nextBeatIndex = i;
      break;
    }
  }
  var diff = analysisObject.beats[i].start * 1000 - progress_ms;
  sendObject.tempo = analysisObject.track.tempo;
  // timestamp when analysis started
  sendObject.analysis_time_stamp = timeStamp;
  // progress in milliseconds when analysis was started
  sendObject.analysis_progress_ms = progress_ms;
  // milliseconds till next beat since the analysis was started
  sendObject.analysis_next_beat_ms = diff;
  fetch(server + '/synchLights/', {
    method: 'POST',
    body: JSON.stringify({
      analysis_object: sendObject
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
}

var trackChanged = function(newTrack, progress_ms) {
  // catch the current time stamp and link it to the song progress
  var timeStamp = new Date().getTime();
  currentSectionIndex = 0;
  console.log("track changed to ", newTrack.name, ", fetching analysis...");
  spotifyPlayer.fetchAnalysis(newTrack.href).then(result => {
    var analysisObject = result;
    console.log("response in spotify.html :O ", analysisObject);
    //var i = 0;
    for (var j = 0; j < analysisObject.sections.length; j++) {
    //while (analysisObject.sections[i].start + analysisObject.sections[i].duration < progress_ms / 1000)
      if (analysisObject.sections[j].start >= progress_ms) {
        currentSectionIndex = j;
      	break;
      }
    }
    //currentSectionIndex = i;

    syncLights(progress_ms, analysisObject);
  });
}

spotifyPlayer.init();
