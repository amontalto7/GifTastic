//TODO:
// 1) Change color on selected button - while resetting all other buttons
// 2) Figure out where TAGS are stored in the object
// 3) Layout issues

const API_KEY = "5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO";

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
var searchTerm = "";

// Checks to see if favorites exists in localStorage and is an array currently
// If not, set a local favorites variable to an empty array
// Otherwise favorites is our current list of IDs
var favorites = JSON.parse(localStorage.getItem("favorites"));
if (!Array.isArray(favorites)) {
  favorites = [];
}

function buildQueryURL(gifCategory, limit) {
  //https://api.giphy.com/v1/gifs/search?api_key=5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO&q=cats

  // base queryURL
  var queryURL = "https://api.giphy.com/v1/gifs/search?";

  // Begin building an object to contain our API call's query parameters
  // Set the API key
  var queryParams = { api_key: API_KEY };

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

// Function to empty out the content
function clear() {
  $(".gifContainer").empty();
  $(".addmore").empty();
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} GiphyData - object containing giphy api data
 */
function updatePage(GiphyData) {
  console.log(GiphyData);

  // if there is already content and you've clicked the + button, it will simply add more to the page instead of starting from 0
  for (var i = gifLimit - 10; i < GiphyData.data.length; i++) {
    var gifStill = GiphyData.data[i].images.fixed_height_still.url;
    if (gifStill) {
      // console.log(gifStill);

      // create div
      var gifDiv = $("<div>");
      var gifRating = $("<p>");
      var gifTitle = $("<p>");

      var dataRating = GiphyData.data[i].rating;
      if (dataRating) {
        gifRating.text("Rating: " + dataRating.toUpperCase());
      }

      var dataTitle = GiphyData.data[i].title;
      if (dataTitle) {
        gifTitle.text("Title: " + dataTitle);
      }
      gifRating.addClass("small ");
      gifTitle.addClass("small mb-0");

      // build image tag

      var gifImage = $("<img>");

      var gifAnimated = GiphyData.data[i].images.fixed_height.url;
      var width = GiphyData.data[i].images.fixed_height.width;
      var id = GiphyData.data[i].id;

      var dlIcon = $("<i>");
      // var dl = $("<a href='" + gifAnimated + "' download>");  // not working as expected
      // dl.addClass("dl");
      // dl.append(dlIcon);
      dlIcon.addClass("fas fa-download dl");
      dlIcon.attr("data-url", gifAnimated);

      var fav = $("<i>");
      fav.attr("data-id", id);
      // check to see if gif is already in favorites
      var index = favorites.indexOf(id);
      if (index > -1) {
        // if it is, display full heart
        fav.addClass("fas fa-heart");
        fav.attr("data-state", "full");
      } else {
        // otherwise, display empty heart
        fav.addClass("far fa-heart");
        fav.attr("data-state", "empty");
      }

      // make sure URL is returned in the data
      gifImage.addClass("gif");
      gifImage.attr("src", gifStill);
      gifImage.attr("data-still", gifStill);
      gifImage.attr("data-animate", gifAnimated);
      gifImage.attr("data-state", "still");
      var table = $("<table>");
      var row = $("<tr>");
      var cell1 = $("<td>").addClass("cell1");
      var cell2 = $("<td>").addClass("cell2");
      table.width(width);
      table.append(row).append(cell1, cell2);
      cell1.append(gifTitle, gifRating);
      cell2.append(fav, dlIcon);

      gifDiv.addClass("float-left mr-3"); // bootstrap float
      gifDiv.append(gifImage);
      gifDiv.append(table);
      $(".gifContainer").append(gifDiv);
    }
  }

  var addDiv = $("<div>");
  addDiv.addClass("float-right");
  var addMore = $("<button>");
  addMore.addClass("btn btn-large btn-secondary btnAdd");
  addMore.text(" + ");
  addMore.attr("data-category", searchTerm);
  addDiv.append(addMore);
  $(".addmore").append(addMore);
}

//the following two functions are an attempt to get direct download to work.
// code via https://stackoverflow.com/questions/49474775/chrome-65-blocks-cross-origin-a-download-client-side-workaround-to-force-down
function forceDownload(blob, filename) {
  var a = document.createElement("a");
  a.download = filename;
  a.href = blob;
  a.click();
}

// Current blob size limit is around 500MB for browsers
function downloadResource(url, filename) {
  if (!filename)
    filename = url
      .split("\\")
      .pop()
      .split("/")
      .pop();
  fetch(url, {
    headers: new Headers({
      Origin: location.origin
    }),
    mode: "cors"
  })
    .then(response => response.blob())
    .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    })
    .catch(e => console.error(e));
}

$(document).ready(function() {
  //javascript, jQuery
  generateButtons();

  $(document).on("click", ".topic", function() {
    searchTerm = $(this).attr("data-category");
    gifLimit = 10;
    $(this).addClass("active");
    // console.log(searchTerm);
    clear();
    var queryURL = buildQueryURL(searchTerm, gifLimit);
    //   "https://api.giphy.com/v1/gifs/search?api_key=5luyhCx489UHXt7GXRw4Z3kAw9RZbPTO&q=cats";

    $.ajax({
      url: queryURL,
      headers: {
        Accept: "image/*"
      },
      method: "GET"
    }).then(updatePage);
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

  function addFavorite(gifId) {
    favorites.push(gifId);
    // console.log(favorites);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function removeFavorite(gifId) {
    var index = favorites.indexOf(gifId);
    if (index > -1) {
      favorites.splice(index, 1);
    }
    // console.log(favorites);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  // function to handle clicking on Favorite icon
  $(document).on("click", ".fa-heart", function() {
    if ($(this).attr("data-state") === "empty") {
      $(this).removeClass("far");
      $(this).addClass("fas");
      $(this).attr("data-state", "full");
      addFavorite($(this).attr("data-id"));
    } else {
      $(this).removeClass("fas");
      $(this).addClass("far");
      $(this).attr("data-state", "empty");
      removeFavorite($(this).attr("data-id"));
    }
  });

  // function to handle clicking on download icon
  $(document).on("click", ".fa-download", function() {
    var dlURL = $(this).attr("data-url");
    downloadResource(dlURL);
  });

  //When clicking the + button, it adds 10 to the limit and re-does the AJAX call, then re-populates everything.
  //TODO: Figure out a way to keep original content, and simply add more to the bottom
  $(document).on("click", ".btnAdd", function() {
    $(".addmore").empty();
    gifLimit += 10;
    // var searchTerm = $(this).attr("data-category");
    var queryURL = buildQueryURL(searchTerm, gifLimit);

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage);
  });

  $("#addCategory").on("click", function() {
    event.preventDefault();

    //get value from input
    var newCategory = $("#categoryInput")
      .val()
      .trim();
    if (newCategory) {
      //   console.log(newCategory);
      $("#categoryInput").val("");
      topics.push(newCategory);
      generateButtons();
    }
  });

  $("#favorites").on("click", function() {
    clear();

    if (favorites.length > 0) {   // only run the ajax call if there are items in favorites array
      favorites = favorites.filter(Boolean); // filter any null values out of array
      var favParams = favorites.join();
      var favURL =
        "https://api.giphy.com/v1/gifs?api_key=" +
        API_KEY +
        "&ids=" +
        favParams;
      console.log(favURL);

      $.ajax({
        url: favURL,
        method: "GET"
      }).then(updatePage);
    }
  });
});
