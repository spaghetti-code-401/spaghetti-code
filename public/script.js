//  here we have access to roomId and socket.io

// socket will connect to our root path
const socket = io('/');

// undefined --> will let the server generate an id
// const myPeer = new Peer(undefined, {
//   host: '/',
//   port: '3001'
// }) 
const myPeer = new Peer() 
// const myPeer = new Peer(undefined, {
//   key: 'peerjs',
//   host: 'https://spaghetti-code.herokuapp.com',
//   port: 443,
//   path: '/',
//   secure: true,
// })

// get video
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
// to mute our sound for ourselves, not for other people
myVideo.muted = true

// keep track of callers
const peers = {}

// connect webcam to video element
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => { // the stream is out video and audio
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    // sends the stream to the first user
    call.answer(stream)

    // receive stream from first user
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close()
  }
})

// open -> run the following code as soon as the connection to the peer server is started
// to start peer server in terminal -> peerjs --port 3001
myPeer.on('open', id => {
  // send an event to our server
  socket.emit('join-room', ROOM_ID, id);
})

function addVideoStream(video, stream) {
  // attaching webcam to vid element
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

function connectToNewUser(userId, stream) {
  // calling the user with that id and sending them the stream
  const call = myPeer.call(userId, stream)

  // receiving others' stream
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    // appending their video to our screen
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call;
}