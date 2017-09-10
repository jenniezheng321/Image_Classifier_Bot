   var video, canvas, labels, socket;
    window.onload = function(){
    //for heroku builds
    var target="https://calm-depths-76040.herokuapp.com/"
    //var target='http://localhost:3000'

     // Grab elements, create settings, etc.
     socket = io.connect(target);
     video = document.getElementById('video');
     canvas = document.getElementById('canvas');
     labels = document.getElementsByTagName('label');
     var camera_works=access_video();

     if (camera_works){
       copy_to_canvas();
       socket.emit('img',canvas.toDataURL());
     }
     else {
      alert("Failed to gain access to your camera.");
     }

     socket.on("result", function (data){
      //split by new line
      //lines.length is actually 4 with one empty line
      lines=data.split(/\r?\n/);
      console.log(labels.length)
      for (let i=0; i<labels.length; i+=1) {
        labels[i].innerHTML=lines[i];
      }

      copy_to_canvas();
      socket.emit('img',canvas.toDataURL());
    });

};

   function access_video(){
    // Get access to camera
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //lower framerate
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", frameRate: { ideal: 10, max: 15 },
        width: 512, height: 512  } }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      });
      return true;
    }
    //no camera :(
    return false;
  }
  function copy_to_canvas() {
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    //note this URL changes for every new canvas draw.
    //must be sent every time
    var data = canvas.toDataURL('image/png');
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
