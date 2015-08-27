 var divSelectAlbum = document.getElementById('selectAlbum');
 var divResult = document.getElementById('result');
 var photoPositions;

 <!-- fb snippet loading sdk etc. -->
 (function (d, s, id) {
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {
         return;
     }
     js = d.createElement(s);
     js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));



 window.fbAsyncInit = function () {
     FB.init({
         appId: '396737807177348',
         <!-- Modules like share button -->
         xfbml: false,
         version: 'v2.2'
     });

     <!-- Get all names of all albums of current user -->
     <!-- @param JSONObject jsonObject = json with all album data -->
     <!-- @param String key -->
     <!-- @return String[] result = albumNames -->
     function getDataFromJson(jsonObject, key1, key2, key3) {
         var result = new Array();
         for (i = 0; i < jsonObject.data.length; i++) {
             if (key2 != null) {
                 console.log("key is set");
                 try {
                     result.push(jsonObject.data[i][key1][key2][key3]);
                 } catch (e
                     if e instanceof TypeError) {
                     if (i < jsonObject.data.length) {
                         continue;
                     }
                     console.log('no loc');
                 }
             } else {
                 result.push(jsonObject.data[i][key1]);
             }
         }
         return result;
     }

     function getPhotosOfAlbum(albumId) {
         FB.api('/' + albumId + '/photos?limit=250', 'get',
             function (response) {
                 console.log(albumId);
                 var photoLatitude = getDataFromJson(response, 'place', 'location', 'latitude');
                 var photoLongitude = getDataFromJson(response, 'place', 'location', 'longitude');
                 photoPositions = new Array();

                 for (i = 0; i < photoLatitude.length; i++) {
                     photoPositions[0] = photoLatitude;
                     photoPositions[1] = photoLongitude;
                     console.log('Position: ' + photoPositions[0][i] + ':' + photoPositions[1][i]);
                 }

                 addMarkers(photoPositions);
             });
     }

     function getAlbums() {
         FB.api('/me/albums', 'get', function (response) {
             var albumListNames = getDataFromJson(response, 'name');
             var albumListIds = getDataFromJson(response, 'id');
             var albumList = document.getElementById("albumList");

             for (i = 0; i < albumListNames.length; i++) {
                 var listItem = document.createElement("li");
                 var listItemValue = document.createTextNode(albumListNames[i]);
                 listItem.setAttribute("id", albumListIds[i]);

                 <!-- closure - otherwise every item would trigger the same event -->
                 (function (i) {
                     listItem.addEventListener('click', function () {
                         getPhotosOfAlbum(albumListIds[i]);
                     });
                 })(i);

                 listItem.appendChild(listItemValue);
                 albumList.appendChild(listItem);
             }
         });
     };

     <!--check if logged in, else show login form ***** Important scope update needs relogin -->
     FB.getLoginStatus(function (response) {
         if (response.status === 'connected') {
             //token = response.authResponse.accessToken;
             console.log('Logged in.');
             getAlbums();
         } else {
             console.log('Not logged in');
             FB.login(function () {}, {
                 scope: 'user_photos'
             });
         }
     });
 };