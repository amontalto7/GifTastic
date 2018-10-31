function buildQueryURL(gifCategory) {
  //https://api.giphy.com/v1/gifs/search?api_key=5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO&q=cats
  const API_KEY = "5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO";

  // base queryURL
  var queryURL = "https://api.giphy.com/v1/gifs/search?";

  // Begin building an object to contain our API call's query parameters
  // Set the API key
  var queryParams = { api_key: "5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO" };

  // Grab the datavalue from the button clicked
  queryParams.q = gifCategory

  // Logging the URL so we have access to it for troubleshooting
  console.log("---------------\nURL: " + queryURL + "\n---------------");
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}

$(document).ready(function() {
  //javascript, jQuery

  $(".btn").on("click", function() {
    var searchTerm = $(this).attr("data-category");
    console.log(searchTerm);
    var queryURL = buildQueryURL(searchTerm);
    //   "https://api.giphy.com/v1/gifs/search?api_key=5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO&q=cats";



    $.ajax({
      url: queryURL,
      method: "GET"
    })

      //
      .then(function(response) {
        console.log(response);

        for (var i = 0; i < 10; i++) {
          // create div
          var gifDiv = $("<div>");
          var gifRating = $("<p>");
          gifRating.text("Rating: " + response.data[i].rating);

          var gifImage = $("<img>");
          var gifUrl = response.data[i].images.fixed_height.url;
          console.log(gifUrl);
          gifImage.attr("src", gifUrl);

            gifDiv.append(gifImage);
            gifDiv.append(gifRating);      

          $(".gifContainer").append(gifDiv);
        }
      });
  });
});
