$(document).ready(function () {
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var city = $("#cityInput").val().trim();
    console.log(city);
    weatherGet(city);
  });
  var APIKey = "485a30f7b8cebea0111006986b00bf18";

  function weatherGet(city) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      forcastGet(response.coord.lat, response.coord.lon);
      uvGet(response.coord.lat, response.coord.lon);

    });
  }
  function forcastGet(lat, lon) {
    var queryURLF = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=${APIKey}`;

    $.ajax({
      url: queryURLF,
      method: "GET",
    }).then(function (responseF) {
      console.log(responseF);

      for (var i = 1; i < 6; i++) {
        console.log(responseF.daily[i]);
        var currentDay = responseF.daily[i];

        var card = $("<div>").addClass("card col-2");
        var cardBody = $("<div>").addClass("card-body");
        var cardTitle = $("<div>")
          .addClass("card-title")
          .text(moment.unix(currentDay.dt).format("dddd"));

        $("#forecast").append(card.append(cardBody.append(cardTitle)));
      }
    });
  }

  function uvGet(lat, lon) {
    var queryURLU = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    $.ajax({
      url: queryURLU,
      method: "GET",
    }).then(function (responseU) {
      console.log(responseU);
    });
  }
});
