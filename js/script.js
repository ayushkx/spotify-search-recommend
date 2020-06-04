{
    var refresh_token = "AQDeMRqSfvEVCt3nXhCA2QGRAitD1BA80_C6Ux8DtUpKHWnCpmqpW9an_bOKSw1GqNA-mK4SNIZyo-4FOCiQyEV1orVBO_h7hiv2H7OgTFeRNqf6sUUD0NF-089J7dopIPo";
    // var access_token = localStorage.getItem("token");
    client_id = "71977005b969429484d342d60ab7b350";
    client_secret = "c196408efb0b4d1784e6d9294c3e08d2";

    document.getElementById("searchBtn").addEventListener("click", getList)
    document.getElementById("searchBar").addEventListener("keyup", handleKey)
    var currentDate = new Date();

    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();

    var dateString = year + "-" + (month + 1) + "-" + date + "T";
    var timestamp = currentDate.getHours() + "%3A" + currentDate.getMinutes() + "%3A" + currentDate.getSeconds();
    var time = dateString + timestamp;
    console.log(time)
}

function handleKey(e) {
    if (e.which === 13)
        getList();
}

function getList() {

    console.log("insdide getList")

    var input = document.querySelector("input").value;

    if (input.length > 0) {

        // refreshToken();

        // console.log("AccesToken after refreshToken", access_token)

        $.ajax({
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            url: "https://api.spotify.com/v1/search?q=" + input + "&type=track&limit=50",
            method: "GET",
            success: function (data, status, xhr) {
                console.log(data);

                if (data.tracks.items.length > 0) {
                    display(data);
                }
                else
                    document.getElementsByClassName("content-body")[0].innerHTML = '<div class="d-flex justify-content-center align-items-center" id="main"><h1 class="mr-3 pr-3 align-top border-right inline-block align-content-center">404</h1><div class="inline-block align-middle"><h2 class="font-weight-normal lead" id="desc">No track/album found, try again!</h2></div></div>';
            },
            error: function (xhr, status, err) {
                console.log("error", access_token);
                alert("Some error occurred, try again after sometime!")

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

        var $newstr = $('<div class="col-6 col-md-4 mb-2 mt-2"><div class="card rounded"><div class="card-image"><img class="img-fluid" src="' + data.tracks.items[i].album.images[0].url + '" alt="Alternate Text" /></div><div class="card-image-overlay m-auto"><span class="card-detail-badge" style="display: table; margin: 4px auto;">' + data.tracks.items[i].artists[0].name + '</span><span class="card-detail-badge" style="display: table; margin: 4px auto;">' + data.tracks.items[i].album.release_date + '</span></div><div class="card-body text-center"><a class="" href="' + data.tracks.items[i].external_urls.spotify + '" style="text-decoration: none;"><i class="fa fa-play-circle "></i> ' + data.tracks.items[i].name + '</a></div></div></div>');



        $(".content").append($newstr);
    }

}

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
                console.log(data.access_token, " -> new token");
                localStorage.setItem("token", data.access_token);
                // document.getElementsByClassName("content-parent")[0].innerHTML = '  <div class="card"><div class="card-body">Results will appear here! Search now, token refreshed!<br><hr>         <div><button class="btn btn-primary hide" id="refresh">Refresh Token!</button></div></div></div>';


            },
            error: function (xhr, status, err) {
                console.log("error");
            },
        });

    }
}

function home() {

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
            console.log(data.access_token, " -> new token");
            localStorage.setItem("token", data.access_token);
            displayAlbum();
            displayPlaylist();
            // document.getElementsByClassName("content-parent")[0].innerHTML = '  <div class="card"><div class="card-body">Results will appear here! Search now, token refreshed!<br><hr>         <div><button class="btn btn-primary hide" id="refresh">Refresh Token!</button></div></div></div>';
        },
        error: function (xhr, status, err) {
            console.log("error");
        },
    });
    document.getElementsByClassName("content-parent")[0].innerHTML = '<div class="row"> <div class="col-xs-12 " style="width: 100%;"  > <nav> <div class="nav nav-tabs nav-justified nav-fill" id="nav-tab" role="tablist"> <a class="nav-item nav-link active" id="latest-album-tab" data-toggle="tab" href="#latest-album" role="tab" aria-controls="latest-album" aria-selected="true">Latest Albums!</a> <a class="nav-item nav-link" id="featured-playlist-tab" data-toggle="tab" href="#featured-playlist" role="tab" aria-controls="featured-playlist" aria-selected="false">Featured Playlists!</a> </div> </nav> <div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent"> <div class="tab-pane fade show active" id="latest-album" role="tabpanel" aria-labelledby="latest-album-tab"> </div> <div class="tab-pane fade" id="featured-playlist" role="tabpanel" aria-labelledby="featured-playlist-tab"> </div> </div> </div> </div>';

}

function displayPlaylist() {

    $.ajax({
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        url: "https://api.spotify.com/v1/browse/featured-playlists?country=IN&timestamp=" + time + "&limit=50",
        method: "GET",
        success: function (data, status, xhr) {
            console.log(data);

            if (data.playlists.items.length > 0) {
                document.getElementById("featured-playlist").innerHTML = ' <div class="row content playlists" id="ads"></div>';


                for (var i = 0; i < data.playlists.items.length; i++) {


                    var $newstr = $('<div class="col-6 col-md-4 mb-2 mt-2"><div class="card rounded"><div class="card-image"><img class="img-fluid" src="' + data.playlists.items[i].images[0].url + '" alt="Alternate Text" /></div><div class="card-image-overlay m-auto"><span class="card-detail-badge" style="display: table; margin: 4px auto;">' + data.playlists.items[i].tracks.total + ' tracks</span></div><div class="card-body text-center"><a class="" href="' + data.playlists.items[i].external_urls.spotify + '" style="text-decoration: none;" target="_blank"><i class="fa fa-play-circle "></i> ' + data.playlists.items[i].name + '</a></div></div></div>');



                    $(".playlists").append($newstr);
                }

            }
            else
                document.getElementById("featured-playlist").innerHTML = ' <div class="row content albums" id="ads"><div class="container">No content, try again later!</div></div>';
        },
        error: function (xhr, status, err) {
            // console.log("error", access_token);
            alert("Some error occurred, try again after sometime!")

        },
    })



}

function displayAlbum() {
    $.ajax({
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        url: "https://api.spotify.com/v1/browse/new-releases?country=IN&offset=0&limit=30",
        method: "GET",
        success: function (data, status, xhr) {
            console.log(data);

            if (data.albums.items.length > 0) {

                document.getElementById("latest-album").innerHTML = ' <div class="row content albums" id="ads"></div>';


                for (var i = 0; i < data.albums.items.length; i++) {


                    var $newstr = $('<div class="col-6 col-md-4 mb-2 mt-2"><div class="card rounded"><div class="card-image"><img class="img-fluid" src="' + data.albums.items[i].images[0].url + '" alt="Alternate Text" /></div><div class="card-image-overlay m-auto"><span class="card-detail-badge" style="display: table; margin: 4px auto;">' + data.albums.items[i].artists[0].name + '</span><span class="card-detail-badge" style="display: table; margin: 4px auto;">' + data.albums.items[i].release_date + '</span></div><div class="card-body text-center" ><a class="" href="' + data.albums.items[i].external_urls.spotify + '" style="text-decoration: none;" target="_blank"><i class="fa fa-play-circle "></i> ' + data.albums.items[i].name + '</a></div></div></div>');



                    $(".albums").append($newstr);
                }

            }
            else
                document.getElementById("latest-album").innerHTML = ' <div class="row content albums" id="ads"><div class="container">No content, try again later!</div></div>';

        },
        error: function (xhr, status, err) {
            // console.log("error", access_token);
            alert("Some error occurred, try again after sometime!")

        },
    })
}