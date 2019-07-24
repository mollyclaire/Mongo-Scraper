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

// Click function for "scrape" button

// Click function for clearing all articles

// Click function for "note" button