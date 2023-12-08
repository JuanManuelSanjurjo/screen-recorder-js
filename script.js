let stream = null,
    audioMic = null,
    mixedStream = null,
    chunks = [],
    recorder = null,
    startBtn = null,
    stopBtn = null,
    recDiv = null,
    downloadBtn = null,
    recordedVideo = null;


console.log(navigator.languages)

navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
  });

async function setUpStream(){
    try{
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        })
        audioMic =  await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        })

        setupVideoFeedback()

    }catch(e){
        console.error(e)
    }
}

function setupVideoFeedback(){
    if(stream){
        const video = document.querySelector(".feedbackVideo")
        video.srcObject = stream
        video.muted = true; // Desactiva el audio del video
        video.play()
    }else{
        console.warn("No stream")
    }
}

async function startRecording(){
    await setUpStream();

    if (stream && audioMic){ // mixing of mic audio and video
        mixedStream = new MediaStream([...stream.getTracks(), ...audioMic.getTracks()])
        recorder = new MediaRecorder(mixedStream)
        recorder.ondataavailable = handleDataAvailable
        recorder.onstop = handleStop
        recorder.start(200)

        startBtn.disabled = true
        stopBtn.disabled = false
        recDiv.style.visibility = "visible"


        console.log("recording started")
    }else{
        console.log("cant record stream")
    }
}

function stopRecording(){
    recorder.stop()
    startBtn.disabled = false
    stopBtn.disabled = true
    recDiv.style.visibility = "hidden"


    console.log("recording stopped")
}
function handleDataAvailable(e){
    chunks.push(e.data)   // el array se llena de cachos del stream (recorder)
}
function handleStop(e){
    const blob = new Blob( chunks, {   // merges the chunks of video
        type: "video/mp4"
    })
    chunks = []

    downloadBtn.href = URL.createObjectURL(blob)
    downloadBtn.download = new Date().toString().split(" ").filter( (e,i) => i> 0 && i<5).join(" ")
    downloadBtn.disabled = false

    recordedVideo.src = URL.createObjectURL(blob)
    recordedVideo.load()
    recordedVideo.onloadeddata = () => {
        recordedVideo.play()
        const recordingDiv = document.querySelector(".recordedVideoContainer")
        recordingDiv.style.visibility = "visible"
        recordingDiv.scrollIntoView({behavior: "smooth"})
    }

    stream.getTracks().forEach( track => track.stop())
    audioMic.getTracks().forEach( track => track.stop())
    // audioStream.getTracks.forEach( track => track.stop())

    console.log("Recording is done")
}


window.addEventListener("load", () => {
    startBtn = document.querySelector(".startBtn")
    stopBtn = document.querySelector(".stopBtn")
    downloadBtn = document.querySelector(".downloadBtn")
    recordedVideo = document.querySelector(".recordedVideo")
    recDiv = document.querySelector('.rec');


    startBtn.addEventListener("click", startRecording)
    stopBtn.addEventListener("click", stopRecording)

});

