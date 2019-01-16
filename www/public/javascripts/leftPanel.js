$(document).ready(function () {

    $.ajax({
        method: 'GET',
        url: '/notice',
        aysnc: true
    }).done(function (response) {

            $("#noticeboard div").remove();
            console.log(response);

            $('#noticeboard').append("<div id='noticeboardi' class='notice' ><span> notice by "+response.username+
                "</span><h6>"+response.headline+"</h6><p>"+response.note+"</p></div>");
        }
    );

});


