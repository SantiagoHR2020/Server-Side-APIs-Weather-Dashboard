$(document).ready(function () {
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var city = $("#cityInput").val().trim();
    console.log(city);
    weatherGet(city);

    $("#cityInput").val("");
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

      var currentDay = response.dt;

      var card = $("<div>").addClass("card col-4");
      var cardBody = $("<div>").addClass("card-body currentWeather");
      var cardTitle = $("<div>")
        .addClass("card-title")
        .text(moment.unix(currentDay).format("dddd"));

      var cityDiv = $("<div>").addClass("card-text").text(city);
      var tempDiv = $("<div>")
        .addClass("card-text")
        .text("Temperature: " + Math.floor(response.main.temp) + "°F");
      var humDiv = $("<div>")
        .addClass("card-text")
        .text("Humidity " + Math.floor(response.main.humidity));

      $("#currentWeather")
        .empty()
        .append(
          card.append(
            cardBody.append(cardTitle).append(cityDiv, tempDiv, humDiv)
          )
        );

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

      $("#forecast").empty();

      for (var i = 1; i < 6; i++) {
        console.log(responseF.daily[i]);
        var currentDay = responseF.daily[i];

        var card = $("<div>").addClass("card col-2");
        var cardBody = $("<div>").addClass("card-body");
        var cardTitle = $("<div>")
          .addClass("card-title")
          .text(moment.unix(currentDay.dt).format("dddd"));

        var tempDiv = $("<div>")
          .addClass("card-text")
          .text("Temperature: " + Math.floor(currentDay.temp.day) + "°F");
        var humDiv = $("<div>")
          .addClass("card-text")
          .text("Humidity " + Math.floor(currentDay.humidity));
        var uviC = $("<div>").text("UV Index " + currentDay.uvi);

        $("#forecast").append(
          card.append(cardBody.append(cardTitle).append(tempDiv, humDiv, uviC))
        );
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
      var uviC = $("<div>").text("UV Index " + responseU.value);
      $(".currentWeather").append(uviC);
    });
  }
});
