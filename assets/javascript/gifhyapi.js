var topics = [
  "fail",
  "deal with it",
  "nope",
  "yes!",
  "wtf",
  "want",
  "leave",
  "popcorn",
  "oh snap",
  "agree",
  "excellent",
  "reactions"
];

var gifLimit = 10;

function buildQueryURL(gifCategory, limit) {
  //https://api.giphy.com/v1/gifs/search?api_key=5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO&q=cats
  const API_KEY = "5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO";

  // base queryURL
  var queryURL = "https://api.giphy.com/v1/gifs/search?";

  // Begin building an object to contain our API call's query parameters
  // Set the API key
  var queryParams = { api_key: "5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO" };

  // Grab the datavalue from the button clicked
  queryParams.q = gifCategory;

  // get the limit
  queryParams.limit = limit;

  // Logging the URL so we have access to it for troubleshooting
  console.log("---------------\nURL: " + queryURL + "\n---------------");
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}

function buildLayout() {
  //TODO: dynamically create a table
}

// generate topic buttons based on elements in the topics array
function generateButtons() {
  $(".buttonContainer").empty();
  for (var i = 0; i < topics.length; i++) {
    var button = $("<button>");
    button.addClass("btn btn-secondary topic");
    button.attr("data-category", topics[i]);
    button.text(topics[i]);
    $(".buttonContainer").append(button);
  }
}

$(document).ready(function() {
  //javascript, jQuery
  generateButtons();

  $(document).on("click", ".topic", function() {
    var searchTerm = $(this).attr("data-category");
    gifLimit = 10;
    $(this).addClass("active");
    console.log(searchTerm);
    var queryURL = buildQueryURL(searchTerm,gifLimit);
    //   "https://api.giphy.com/v1/gifs/search?api_key=5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO&q=cats";

    $.ajax({
      url: queryURL,
      method: "GET"
    })

      //
      .then(function(response) {
        console.log(response);
//TODO - make this a seperate function
        // empty previous gifs
        $(".gifContainer").empty();
        $(".addmore").empty();

        $(".jumbotron").addClass("bg-white shadow p-3 mb-5  rounded");

        for (var i = 0; i < response.data.length; i++) {
          // create div
          var gifDiv = $("<div>");
          var gifRating = $("<p>");
          var gifTitle = $("<p>");

          var dataRating = response.data[i].rating;
          if (dataRating) {
            gifRating.text("Rating: " + dataRating);
          }

          var dataTitle = response.data[i].title;
          if (dataTitle) {
            gifTitle.text("Title: " + dataTitle);
          }
          gifRating.addClass("small");
          gifTitle.addClass("small mb-0");

          // build image tag
          var gifImage = $("<img>");
          var gifStill = response.data[i].images.fixed_height_still.url;
          var gifAnimated = response.data[i].images.fixed_height.url;

          if (gifStill) {
            gifImage.addClass("gif");
            gifImage.attr("src", gifStill);
            gifImage.attr("data-still", gifStill);
            gifImage.attr("data-animate", gifAnimated);
            gifImage.attr("data-state", "still");
            gifDiv.addClass("float-left mr-3"); // bootstrap float
            gifDiv.append(gifImage);
            gifDiv.append(gifTitle);
            gifDiv.append(gifRating);

            $(".gifContainer").prepend(gifDiv);
          }

          //   gifDiv.css("max-width", response.data[i].images.fixed_height.width);
        }

        var addDiv = $("<div>");
        addDiv.addClass("float-right");
        var addMore = $("<button>");
        addMore.addClass("btn btn-large btn-secondary btnAdd");
        addMore.text(" + ");
        addMore.attr("data-category", searchTerm)
        addDiv.append(addMore);
        $(".addmore").append(addMore);
      });
  });

  // function to animate/pause gifs on click
  $(document).on("click", ".gif", function() {
    var state = $(this).attr("data-state");
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  });

  $(document).on("click", ".btnAdd", function() {
      gifLimit +=10;
      var searchTerm = $(this).attr("data-category");

    });

  $("#addCategory").on("click", function() {
    event.preventDefault();

    //get value from input
    var newCategory = $("#categoryInput")
      .val()
      .trim();
    if (newCategory) {
      console.log(newCategory);
      $("#categoryInput").val("");
      topics.push(newCategory);
      generateButtons();
    }
  });
});
