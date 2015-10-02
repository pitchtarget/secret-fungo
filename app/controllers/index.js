import ajax from 'ic-ajax';
export default Ember.Controller.extend({
  images: [],
  name: null,
  onInitFiles: function() {
    var controller = this;
    Ember.run.schedule('afterRender', this, function() {
      window.addEventListener("DOMContentLoaded", function() {
        // Grab elements, create settings, etc.
        var canvas = document.getElementById("canvas"),
          context = canvas.getContext("2d"),
          video = document.getElementById("video"),
          videoObj = { "video": true },
          errBack = function(error) {
            console.log("Video capture error: ", error.code);
          };

        // Put video listeners into place
        if(navigator.getUserMedia) { // Standard
          navigator.getUserMedia(videoObj, function(stream) {
            video.src = stream;
            video.play();
          }, errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
          navigator.webkitGetUserMedia(videoObj, function(stream){
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
          }, errBack);
        }
        else if(navigator.mozGetUserMedia) { // Firefox-prefixed
          navigator.mozGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
          }, errBack);
        }
      }, false);

      document.getElementById("snap").addEventListener("click", function() {
        var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, 640, 480);
        var imagetoDisplay = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        var imageUrl = canvas.toDataURL().replace('data:image/png;base64', '');
        controller.get('images').pushObject(imageUrl);

        // controller.send('requestTag', imageUrl);
        controller.send('imageUrlUpload', imageUrl);
      });
    })
  }.on('init'),

  actions: {
    imageUrlUpload: function(image) {
      var clientId = '12de8c2e151296b';
      var auth = 'Client-ID ' + clientId;

      ajax.request({
        url: 'https://api.imgur.com/3/upload',
        type: 'POST',
        headers: {
          Authorization: auth,
          Accept: 'application/json'
        },
        data: {
          image: image,
          type: 'base64'
        }
      }).then(function(result) {
        this.send('requestTagToCloud', result.data.link);
      }.bind(this));
    },

    requestTagToCloud: function(image) {
      var controller = this;
      return ajax.request('http://localhost:4567/food-from-image?url=' + encodeURIComponent(image)).then(function(res) {
        var token = res.token;
        var req = function()  {
          return ajax.request('http://localhost:4567/food-description?token=' + token);
        }
        setTimeout(
          req().then(function(response){
            response = JSON.parse(response);
            if (response.status !== 'completed') {
              return req().then(function() {

              });
            } else {
              controller.set('name', response.name);
              controller.transitoToRoute('recipes');
            }
          })
          , 5000);
      })
    },
  //   requestTagToCloud: function(image) {
  //     var form = new FormData();
  //     var url = 'http://cloudsightapi.com/image_responses';
  //     var key = 'jFyNUdhfuM7riyzlIDHNPg';
  //     var headers = {
  //       'Accept': 'application/json',
  //       'Authorization': 'CloudSight ' + key
  //     };

  //     form.append('image_request[remote_image_url]', image);
  //     form.append('image_request[locale]', 'en-US');
  //     return $.ajax({
  //       type: 'POST',
  //       url: url,
  //       data: form,
  //       headers: headers,
  //       contentType: false,
  //       cache : false,
  //       processData: false,
  //       dataType: 'jsonp'
  //     }).then(function() {
  //       debugger;
  //     });
  //   }
  }
});
// curl -i -X POST \
// -H "Authorization: CloudSight jFyNUdhfuM7riyzlIDHNPg" \
// -F "image_request[remote_image_url]=http://i.imgur.com/K925LzR.png " \
// -F "image_request[locale]=en-US" \
// https://api.cloudsightapi.com/image_requests