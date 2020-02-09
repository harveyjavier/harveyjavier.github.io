var map;
var markers = [];

function initMap(){
  var styledMapType = new google.maps.StyledMapType(
    [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ],
    {name: "Styled Map"}
  );

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    scaleControl: false,
    streetViewControl: false,
    center: { lat:13.139122, lng:123.732329 },
    clickableIcons: false,
    mapTypeControl: false,
  });
  map.mapTypes.set("styled_map", styledMapType);
  map.setMapTypeId("styled_map");
}

function markerBounce (marker) {
  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function addMarker(map, location) {
  location = new google.maps.LatLng(location.lat, location.lng);

  var icon = {
    url: "assets/images/marker.png",
    scaledSize: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0,0)
  };

  var marker = new google.maps.Marker({
    position: location,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: icon,
  });
  marker.icon = { url:"assets/images/marker.png", scaledSize:new google.maps.Size(50, 50) };
  markers.push(marker);

  markerBounce(marker);
  setTimeout(markerBounce(marker), 1500);
}

function hashScroll(t, e){
  if (t.hash !== "") {
    e.preventDefault();
    var hash = t.hash;
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 900, function(){
      window.location.hash = hash;
    });
  }
}

$(document).ready(function(){
  $("#map-script").attr("async");
  $("#map-script").attr("defer");
  $("#map-script").attr("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyCOID-HopBt5NlfrER3z0cjQ6FHjSVssBM&callback=initMap");
  setTimeout(function(){
    addMarker(map, { lat:parseFloat(13.139122), lng:123.732329 });
    google.maps.event.addListener(map, 'zoom_changed', function() {
      $.each(markers, function(index, marker){
        markers[i].setIcon(markers[i].icon);
      });
    });
  }, 1000);

  $(".navbar a, footer a[href='#harvz']").on('click', function(event) {
    hashScroll(this, event);
  });
  
  $(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });

  $('[data-toggle="tooltip"]').tooltip();

  function layer1(){
    $(".layer1").animate({marginTop: "+=10px"}, "slow", function(){
      $(".layer1").animate({marginTop: "-=10px"}, "slow", layer1);
    });
  }
  function layer2(){
    $(".layer2").animate({marginTop: "+=8px"}, "slow", function(){
      $(".layer2").animate({marginTop: "-=8px"}, "slow", layer2);
    });
  }
  function layer3(){
    $(".layer3").animate({marginTop: "+=5px"}, "slow", function(){
      $(".layer3").animate({marginTop: "-=5px"}, "slow", layer3);
    });
  }
  layer1();
  layer2();
  layer3();

  $(".harvz-about-img").hover(function(){
      $(this).removeClass("harvz-border-solid-10px-fff");
      $(this).addClass("harvz-border-solid-10px-00B2EE");
      $(".harvz-social-media-icon").fadeIn("fast");
    }, function(){
      $(this).addClass("harvz-border-solid-10px-fff");
      $(this).removeClass("harvz-border-solid-10px-00B2EE");
      $(".harvz-social-media-icon").fadeOut("fast");
  });

  $(".harvz-social-media-icon").on("click", function(){
    if($(this).hasClass("facebook")){ window.open("https://www.facebook.com/harvzjavier/", "_blank"); }
    if($(this).hasClass("linkedin")){ window.open("https://www.linkedin.com/in/harvz/", "_blank"); }
    if($(this).hasClass("github")){ window.open("https://github.com/harveyjavier/", "_blank"); }
    if($(this).hasClass("gitlab")){ window.open("https://gitlab.com/harveyjavier/", "_blank"); }
    if($(this).hasClass("youracclaim")){ window.open("https://www.youracclaim.com/users/harvz/badges/", "_blank"); }
  });

  $(".harvz-tools-span").on("click", function(){
    if($(this).hasClass("php")){ window.open("https://www.php.net/", "_blank"); }
    if($(this).hasClass("mysql")){ window.open("https://www.mysql.com/", "_blank"); }
    if($(this).hasClass("javascript")){ window.open("https://developer.mozilla.org/en-US/docs/Web/JavaScript", "_blank"); }
    if($(this).hasClass("css")){ window.open("https://developer.mozilla.org/en-US/docs/Web/CSS", "_blank"); }
    if($(this).hasClass("html")){ window.open("https://www.w3schools.com/html/html_intro.asp", "_blank"); }
    if($(this).hasClass("coronasdk")){ window.open("https://coronalabs.com/", "_blank"); }
    if($(this).hasClass("lua")){ window.open("https://www.lua.org/", "_blank"); }
    if($(this).hasClass("nodejs")){ window.open("https://nodejs.org/en/", "_blank"); }
    if($(this).hasClass("reactnative")){ window.open("https://facebook.github.io/react-native/", "_blank"); }
    if($(this).hasClass("firebase")){ window.open("https://firebase.google.com/", "_blank"); }
    if($(this).hasClass("web3js")){ window.open("https://web3js.readthedocs.io/en/v1.2.4/", "_blank"); }
    if($(this).hasClass("ethereum")){ window.open("https://ethereum.org/", "_blank"); }
    if($(this).hasClass("flutter")){ window.open("https://flutter.dev/", "_blank"); }
    if($(this).hasClass("dart")){ window.open("https://dart.dev/", "_blank"); }
  });

  $("#send-btn").on("click", function(){
    if(!$(this).hasClass("disabled")){
      var err = 0;

      if($("#email-txt").val() == ""){
        $("#email-txt").css("border-color", "#00B2EE");
        setTimeout(function(){ $("#email-txt").css("border-color", "#ccc"); }, 1500);
        err++;
      }
      else
        $("#email-txt").css("border-color", "#ccc");

      if($("#subject-txt").val() == ""){
        $("#subject-txt").css("border-color", "#00B2EE");
        setTimeout(function(){ $("#subject-txt").css("border-color", "#ccc"); }, 1500);
        err++;
      }
      else
        $("#subject-txt").css("border-color", "#ccc");
        
      if($("#body-txt").val() == ""){
        $("#body-txt").css("border-color", "#00B2EE");
        setTimeout(function(){ $("#body-txt").css("border-color", "#ccc"); }, 1500);
        err++;
      }
      else
        $("#body-txt").css("border-color", "#ccc");

      if(err == 0){
        window.open("mailto:harveyjavier17@gmail.com?subject=" + $("#subject-txt").val() + "&body="+$("#body-txt").val(), "_self");
      }
    }
  });
});