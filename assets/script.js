$(document).ready(function () {
  var cityHistoryArray = [];
  var storeCities = localStorage.getItem("cities");
  var APIKey = "485a30f7b8cebea0111006986b00bf18";
  
  if (storeCities) {
    cityHistoryArray = JSON.parse(storeCities);
  }
  console.log(cityHistoryArray);
  console.log(cityHistoryArray.length);
  
  cityHistory();

  weatherGet(cityHistoryArray[cityHistoryArray.length-1])

  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var city = $("#cityInput").val().toLowerCase().trim();

    weatherGet(city);
  });

  $(".cityList").on("click", ".btmCity", function (event) {
    event.preventDefault();
    city = $(this).text();

    weatherGet(city);
  });


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
      var currentDay = response.dt;
      console.log(response)
      $("#currentWeather").empty()

      var card = $("<div>").addClass("card text-white bg-dark");
      var cardBody = $("<div>").addClass("card-body currentWeather");
      var cardTitle = $("<div>")
        .addClass("card-title")
        .text(moment.unix(currentDay).format("MMM Do"));

      var cityDiv = $("<div>")
        .addClass("card-text")
        .text("City: " + city);
      var iconDiv = $(`<img src=" https://openweathermap.org/img/wn/${response.weather[0].icon}.png"></img>`);
      var tempDiv = $("<div>")
        .addClass("card-text")
        .text("Temperature: " + Math.floor(response.main.temp) + "°F");
      var humDiv = $("<div>")
        .addClass("card-text")
        .text("Humidity: " + Math.floor(response.main.humidity) + "%");
      var windSpeed = $("<div>").text(
        "Wind speed: " + response.wind.speed + " MPH"
      );

      $("#currentWeather")
       .append(
          card.append(
            cardBody
              .append(cardTitle)
              .append(cityDiv, iconDiv, tempDiv, humDiv, windSpeed)
          )
        );

      forcastGet(response.coord.lat, response.coord.lon);
      uvGet(response.coord.lat, response.coord.lon);
      cityHistory(city);
    });
  }
  function forcastGet(lat, lon) {
    var queryURLF = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=${APIKey}`;

    $.ajax({
      url: queryURLF,
      method: "GET",
    }).then(function (responseF) {
      $("#forecast").empty();

      for (var i = 1; i < 6; i++) {
        var currentDay = responseF.daily[i];

        var card = $("<div>").addClass("card text-white bg-dark col-sm-8 col-md-6 col-lg-2");
        var cardBody = $("<div>").addClass("card-body");
        var cardTitle = $("<div>")
          .addClass("card-title")
          .text(moment.unix(currentDay.dt).format("MMM Do"));
        var iconDiv = $(`<img src=" https://openweathermap.org/img/wn/${currentDay.weather[0].icon}.png"></img>`);

        var tempDiv = $("<div>")
          .addClass("card-text")
          .text("Temp: " + Math.floor(currentDay.temp.day) + "°F");
        var humDiv = $("<div>")
          .addClass("card-text")
          .text("Humidity: " + Math.floor(currentDay.humidity) + "%");
        var uviC = $("<div>").text("UVI: ");
        var newSpan = $("<span>").addClass("dangerr").text(currentDay.uvi);
        $("#forecast").append(
          card.append(
            cardBody
              .append(cardTitle)
              .append(iconDiv, tempDiv, humDiv, uviC.append(newSpan))
          )
        );

        if (parseInt(currentDay.uvi) > 5) {
          $(".dangerr").attr("style", "background-color : red");
        } else {
          $(".dangerr").attr("style", "background-color : green");
        }
      }
    });
  }

  function uvGet(lat, lon) {
    var queryURLU = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    $.ajax({
      url: queryURLU,
      method: "GET",
    }).then(function (responseU) {
      var uviC = $("<div>").text("UVI ");
      var newSpan = $("<span>").addClass("dangerr").text(responseU.value);

      $(".currentWeather").append(uviC.append(newSpan));

      if (parseInt(responseU.value) > 5) {
        newSpan.attr("style", "background-color : red");
      } else {
        newSpan.attr("style", "background-color : green");
      }
    });
  }

  function cityHistory(city) {
    $("#cityInput").val("");
    console.log(cityHistoryArray);
    console.log(cityHistoryArray.indexOf(city));
    if (city && cityHistoryArray.indexOf(city) === -1) {
      cityHistoryArray.push(city);
    }
    localStorage.setItem("cities", JSON.stringify(cityHistoryArray));

    $(".input-group").empty();
    cityHistoryArray.forEach(function (city) {
      var newDiv = $("<button>")
        .addClass("btmCity")
        .attr("id", city)
        .text(city);
      $(".input-group").append(newDiv);
    });
  }
});
