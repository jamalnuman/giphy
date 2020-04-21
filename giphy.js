$(document).ready(function() { //this is the "JQuery" equivalent of document.addEventListener("DOMContentLoaded", function()) in Vanilla JS
  $("#listen").on("click", function(e) { 
    e.preventDefault(); //if the page refreshes,the webpage will lose the information that was typed into the search box.  
    const searchValue = $("#search").val().trim();
    if (searchValue === "") { //without this, a button would be created by the pressing the 'enter' button even if there 
    //was not any info in the search box
      return;
    }
    $("#search").val(" "); //after the 'enter' button is pressed, the search box field is cleared. 
    const buttonsDiv = $("#div2")[0].childNodes; //here we are targeting the childnodes. this is where all the values from the search box are stored. we then use the childNodes, which is an array-like structure, to loop over and create our buttons with the appropriate classes and attributes. 
    addButtons(); 

    function addButtons() {
      for (let i = 0; i < buttonsDiv.length; i++) { 
        if (buttonsDiv[i].id === searchValue) {
          return;
        }
      }
      const $button = $("<button>") 
        .addClass("btn btn-success")
        .addClass("dynamic")
        .attr("id", `${searchValue}`);
      $button.text(`${searchValue}`);
      $button.on("click", clickItem); 
      $divToPaste = $("#div2").append($button); 
    }
  });

  function clickItem(event) {
    const buttonValue = event.target.id;
    console.log(buttonValue) 
    event.preventDefault();
    $("#div3").empty(); //everytime the button is pressed, the div the holds the giphys is cleared. 
    getGiphy(buttonValue);
  }

  function getGiphy(item) {
    queryURL = "https://api.giphy.com/v1/gifs/search?q=" + item + "&api_key=qwFFFNV5GdtdNLgyl23TZvqrCFMPbqGj&limit=10";
    $.ajax({
      url: queryURL,
      method: "get"
    }).then(function(response) {
      console.log(response.data)
      for (let i = 0; i < response.data.length; i++) { 
        const rating = response.data[i].rating;
        const imageId = response.data[i].id;
        const imageStill = response.data[i].images.fixed_height_small_still.url;
        const imageAnimate = response.data[i].images.fixed_height_small.url;
        const $img = $("<img>")
          .addClass("gif")
          .attr("src", imageStill)
          .attr("id", imageId);
        $img
          .attr("data-still", imageStill)
          .attr("data-animate", imageAnimate)
          .attr("data-state", "still");
        $("#div3").prepend(`Rating: ${rating.toUpperCase()}`);
        $("#div3").prepend($img);
        $(`#${imageId}`).on("click", function() { //I tried targeting the (.gif) class of the images, but that only allowed this function to work on the odd numbered gifs. this problem was solved by using the gif's imageId. this problem was possibly due to an issue in JS under the hood.  
          const state = $(this).attr("data-state");
          const data_animate = $(this).attr("data-animate");
          const data_still = $(this).attr("data-still");
          if (state === "still") {
            $(this).attr("src", data_animate);
            $(this).attr("data-state", "animate");
          }
          if (state === "animate") {
            $(this).attr("src", data_still);
            $(this).attr("data-state", "still");
          }
        });
      }
    });
  }
});
