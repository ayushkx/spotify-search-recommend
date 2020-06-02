var refresh_token = "AQDeMRqSfvEVCt3nXhCA2QGRAitD1BA80_C6Ux8DtUpKHWnCpmqpW9an_bOKSw1GqNA-mK4SNIZyo-4FOCiQyEV1orVBO_h7hiv2H7OgTFeRNqf6sUUD0NF-089J7dopIPo";
var access_token = "BQAiVUMtVoP5mmWHJPYq0x_bmHxhb2zT2aa6g0oRLrPv1ORGADD33G9XmsPpxL-3wlzqwOO_XJbSkZUU61GBl8bmWqK_gQnPOXuOj3rVnuqLWIEqVZtyn4h0uBdW3PrcPIqL5REk9FDdtbtfsDMV9-LWeArLEd8qZg0-I5ENkt3f4Xnw9Q";
client_id = "71977005b969429484d342d60ab7b350";
client_secret = "c196408efb0b4d1784e6d9294c3e08d2";

// use refrsh token to get new access token
document.getElementById("refresh").addEventListener("click", refreshToken);

function refreshToken() {
    {
        dataForAPI = {
            grant_type: 'refresh_token',
            refresh_token: refresh_token

        }
        console.log("inside refresh")

        $.ajax({
            headers: { 'Authorization': 'Basic ' + window.btoa(client_id + ':' + client_secret) },
            url: "https://accounts.spotify.com/api/token",
            data: dataForAPI,
            method: "POST",
            success: function (data, status, xhr) {
                console.log(data.access_token);
                access_token = data.access_token;
            },
            error: function (xhr, status, err) {
                console.log("error");
            },
        });

    }
}





document.getElementById("searchBtn").addEventListener("click", getList)




function getList() {


    var input = document.querySelector("input").value;

    if (input.length > 0) {
        refreshToken();
        $.ajax({
            headers: {
                Authorization: "Bearer " + access_token,
            },
            url: "https://api.spotify.com/v1/search?q=" + input + "&type=track&limit=50",
            method: "GET",
            success: function (data, status, xhr) {
                console.log(data);

                display(data);
            },
            error: function (xhr, status, err) {
                console.log("error");
                alert("Error, please refresh token!")
                document.getElementsByClassName("content-parent")[0].innerHTML = '  <div class="card"><div class="card-body">Results will appear here!<br><hr>         <div><button class="btn btn-primary hide" id="refresh">Refresh Token!</button></div></div></div>';
                document.getElementById("refresh").className = "btn btn-primary";
                refreshToken();
            },
        })
    }
    else
        alert("Please enter something!")

}










function display(data) {



    document.getElementsByClassName("content-parent")[0].innerHTML = ' <div class="row content" id="ads"></div>';


    for (var i = 0; i < data.tracks.items.length; i++) {
        console.log(data.tracks.items[0].album.images[0].url)

        var $newstr = $('<div class="col-md-4 mb-2 mt-2"><div class="card rounded"><div class="card-image"><img class="img-fluid" src="' + data.tracks.items[i].album.images[0].url + '" alt="Alternate Text" /></div><div class="card-image-overlay m-auto"><span class="card-detail-badge">' + data.tracks.items[i].artists[0].name + '</span><span class="card-detail-badge">' + data.tracks.items[i].album.release_date + '</span></div><div class="card-body text-center"><a class="" href="' + data.tracks.items[i].external_urls.spotify + '" style="text-decoration: none;"><i class="fa fa-play-circle "></i> ' + data.tracks.items[i].name + '</a></div></div></div>');



        $(".content").append($newstr);
    }

}
