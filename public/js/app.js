// Click function for "save" button
$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/saved/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});

// Click function for "delete" (from saved) button
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/delete/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});

// Click function for "scrape" button
$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scraped",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});

// Click function for clearing all articles

// Click function for "note" button
$(".save-note").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles" + thisId,
        data: {
          text: $("#noteText" + thisId).val()
        }
      }).done(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          $("#noteText" + thisId).val("");
          $(".modalNote").modal("hide");
          window.location = "/saved"
    });

});