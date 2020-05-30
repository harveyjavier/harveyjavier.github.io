var firebaseConfig = {
  apiKey: "AIzaSyA18HIOJNJCiZ4yvFW63vdfqNrOcImCBJM",
  authDomain: "harveyjavier-github-io.firebaseapp.com",
  databaseURL: "https://harveyjavier-github-io.firebaseio.com",
  projectId: "harveyjavier-github-io",
  storageBucket: "harveyjavier-github-io.appspot.com",
  messagingSenderId: "993049186892",
  appId: "1:993049186892:web:4756c6d2762d8dbf2cdae9",
  measurementId: "G-2ZJSLJ71VJ"
};
var defaultProject = firebase.initializeApp(firebaseConfig);
var defaultDatabase = firebase.database();
var defaultFirestore = firebase.firestore();

var isOtherWebContentFetched = false;
var isHighlightsFetched = false;
var isServicesFetched = false;
var isCertificationsFetched = false;
var isProjectsFetched = false;
var isToolsFetched = false;
var isIssuersFetched = false;
var isCommentsFetched = false;
var isLoaded = false;
var about, email, address;
var highlights;
var services;
var certifications;
var projects;
var tools;
var issuers;
var comments;

setInterval(function () {
  if (isOtherWebContentFetched && isHighlightsFetched && isServicesFetched && isCertificationsFetched && isProjectsFetched && isToolsFetched && isIssuersFetched && isCommentsFetched && !isLoaded) {
    $("#about-text").append(about);
    $("#address-text").append(address);
    $("#email-text").append(email);

    highlights.forEach(function(h) {
      $("#highlights-list").append("<li>"+h.content+"</li>");
    });

    var chunkedServices = chunkify(services, 3);
    chunkedServices.forEach(function(cs) {
      $("#services-div").append("<div class='row'>");
      cs.forEach(function(s) {
        var serviceElements = "";
        serviceElements +=  "<div class='col-sm-4'>"+
                              "<i class='fa "+s.icon+" logo-small'></i>"+
                              "<h4>"+s.name+"</h4>"+
                              "<p>"+s.description+"</p><br/><br/>"+
                            "</div>";
        $("#services-div").append(serviceElements);
      });
      
      $("#services-div").append("</div>");
    });

    var chunkedCertifications = chunkify(certifications, 4);
    chunkedCertifications.forEach(function(c) {
      $("#certifications-div").append("<div class='row'>");
      c.forEach(function(c_) {
        var issuer = getIssuer(c_.issuer);
        var certificationElements = "";
        certificationElements +=  "<div class='col-sm-3'>"+
                              "<img src='"+issuer.image+"' width='70'><br/><br/>"+
                              "<p><strong>"+c_.name+"</strong></p>"+
                              "<p>"+c_.issued_at+"</p>"+
                              "<a class='harvz-no-text-decoration' href='"+c_.url+"' target='_blank'>View credential</a><br/><br/>"+
                            "</div>";
        $("#certifications-div").append(certificationElements);
      });
      
      $("#certifications-div").append("</div>");
    });

    var chunkedProjects = chunkify(projects, 3);
    chunkedProjects.forEach(function(cp) {
      $("#projects-div").append("<div class='row text-center'>");
      cp.forEach(function(p) {
        var projectElements = "";
        var projectURL = p.url === null ? "" : "<p><a class='harvz-no-text-decoration' href='"+p.url+"' target='_blank'>View project</a></p>";
        projectElements +=  "<div class='col-sm-4'>"+
                              "<div class='thumbnail harvz-bg-white'>"+
                                "<img class='portfolio-image harvz-undraggable harvz-clickable harvz-hover-opacity-0-7' src='"+p.image+"' alt='"+p.name+"' width='400'>"+
                                "<p><strong>"+p.name+"</strong> ("+p.year.toString()+")</p>"+
                                "<p>"+p.description+"</p>"+
                                "<span>Programming Languages / Tools: </span>";

        p.tools.forEach(function(t) {
          var tool = getTool(t);
          projectElements +=    "<span class='harvz-tools-span harvz-clickable "+tool.class_name+"' data-toggle='tooltip' title='"+tool.name+"'><img class='harvz-width-20px harvz-margin-top-5px' alt='"+tool.name+"' src='"+tool.image+"'></span>";
        });
                              
        projectElements +=      "<p>Client: "+p.client+"</p>"+
                                projectURL+
                              "</div>"+
                            "<div>";
        $("#projects-div").append(projectElements);
      });
      $("#projects-div").append("</div>");
    });

    comments.forEach(function(c, i) {
      var cIndicator = "<li data-target='#harvzCarousel' data-slide-to='"+i+"'";
      cIndicator += i === 0 ? "class='active'" : "";
      cIndicator += "></li>";
      $(".carousel-indicators").append(cIndicator);

      var cInner = "<div class=";
      cInner +=   i === 0 ? "'item active'><h4>" : "'item'><h4>";
      c.comments.forEach(function(c_) {
        cInner +=     c_+"<br/><br/>";
      });
      cInner +=     "<span>- "+
                      "<a href='"+c.linkedin+"' target='_blank' class='harvz-clickable harvz-no-text-decoration'>"+
                        c.name+
                      "</a>"+
                      ", "+c.position+", "+c.company+
                    "</span></h4>"+
                  "</div>";
      $(".carousel-inner").append(cInner);
    });

    isLoaded = true;
    $("#harvz-loader").fadeOut(function(){ $(this).remove(); });
    $("#harvz-main-content").removeClass("harvz-invisible");
  }
}, 1000);

getOtherWebContent();
getHighlights();
getServices();
getCertifications();
getProjects();
getTools();
getIssuers();
getComments();

async function getOtherWebContent() {
  var owcRef = await defaultDatabase.ref();
  owcRef.once("value").then(snapshot => {
    about = snapshot.val().about;
    email = snapshot.val().email;
    address = snapshot.val().address;
    isOtherWebContentFetched = true;
  });
}

async function getHighlights() {
  var highlightsCollection = await defaultFirestore.collection("career_highlights");
  highlightsCollection.get().then((querySnapshot) => {
    var tempDoc = querySnapshot.docs.map((doc) => {
      var dd = doc.data();
      dd.id = doc.id;
      return dd;
    });
    highlights = tempDoc;
    highlights.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)
    isHighlightsFetched = true;
  });
}

async function getServices() {
  var servicesCollection = await defaultFirestore.collection("services");
  servicesCollection.get().then((querySnapshot) => {
    var tempDoc = querySnapshot.docs.map((doc) => {
      var dd = doc.data();
      dd.id = doc.id;
      return dd;
    });
    services = tempDoc;
    services.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)
    isServicesFetched = true;
  });
}

async function getCertifications() {
  var certificationsCollection = await defaultFirestore.collection("certifications");
  certificationsCollection.get().then((querySnapshot) => {
    var tempDoc = querySnapshot.docs.map((doc) => {
      var dd = doc.data();
      dd.id = doc.id;
      return dd;
    });
    certifications = tempDoc;
    certifications.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
    isCertificationsFetched = true;
  });
}

async function getProjects() {
  var projectsCollection = await defaultFirestore.collection("projects");
  projectsCollection.get().then((querySnapshot) => {
    var tempDoc = querySnapshot.docs.map((doc) => {
      var dd = doc.data();
      dd.id = doc.id;
      return dd;
    });
    projects = tempDoc;
    projects.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)
    isProjectsFetched = true;
  });
}

async function getTools() {
  var toolsCollection = await defaultFirestore.collection("tools");
  toolsCollection.get().then((querySnapshot) => {
    var tempDoc = querySnapshot.docs.map((doc) => {
      var dd = doc.data();
      dd.id = doc.id;
      return dd;
    });
    tools = tempDoc;
    isToolsFetched = true;
  });
}

async function getIssuers() {
  var issuersCollection = await defaultFirestore.collection("issuers");
  issuersCollection.get().then((querySnapshot) => {
    var tempDoc = querySnapshot.docs.map((doc) => {
      var dd = doc.data();
      dd.id = doc.id;
      return dd;
    });
    issuers = tempDoc;
    isIssuersFetched = true;
  });
}

async function getComments() {
  var commentsCollection = await defaultFirestore.collection("comments");
  commentsCollection.get().then((querySnapshot) => {
    var tempDoc = querySnapshot.docs.map((doc) => {
      var dd = doc.data();
      dd.id = doc.id;
      return dd;
    });
    comments = tempDoc;
    comments.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)
    isCommentsFetched = true;
  });
}

function chunkify(myArray, chunk_size){
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  
  for (index = 0; index < arrayLength; index += chunk_size) {
      myChunk = myArray.slice(index, index+chunk_size);
      tempArray.push(myChunk);
  }

  return tempArray;
}

function getTool(id) {
  var tool;
  tools.forEach(function(t) {
    if (t.id === id)
      tool = t;
  });
  return tool
}

function getIssuer(id) {
  var issuer;
  issuers.forEach(function(i) {
    if (i.id === id)
      issuer = i;
  });
  return issuer
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

  $(document).tooltip({
    selector: '[data-toggle="tooltip"]'
  });

  function layer0(){
    $(".layer0").animate({marginTop: "+=11px"}, "slow", function(){
      $(".layer0").animate({marginTop: "-=11px"}, "slow", layer0);
    });
  }
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
  layer0();
  layer1();
  layer2();
  layer3();

  $(".harvz-about-img").hover(function(){
      $(this).removeClass("harvz-border-solid-10px-fff");
      $(this).addClass("harvz-border-solid-10px-00B2EE");
      $(".harvz-cv-btn").fadeIn("fast");
    }, function(){
      $(this).addClass("harvz-border-solid-10px-fff");
      $(this).removeClass("harvz-border-solid-10px-00B2EE");
      $(".harvz-cv-btn").fadeOut("fast");
  });

  $(document).on("click", ".portfolio-image", function(){
    //$("#harvz-image-modal").fadeIn();
    $(".modal").modal("toggle");
    $(".modal-content").attr("src", $(this).attr("src"));
  });

  $(".modal").click(function() {
    $(".modal").modal("toggle");
  });
  
  $(document).bind().on("click", ".harvz-tools-span", function(){
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
    if($(this).hasClass("unity")){ window.open("https://unity.com/", "_blank"); }
    if($(this).hasClass("csharp")){ window.open("https://www.w3schools.com/cs/", "_blank"); }
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