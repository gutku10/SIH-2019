$(document).ready(function () {
    if (localStorage.getItem('userType') != 'admin') {
        $('#city').attr('readonly','readonly');
    }
    else {
        $("#city").removeAttr('readonly');
    }
});

$("#update").click(function () {
    //alert("done")
    submitRequest();
    return false;
})

function submitRequest() {
    var g = document.getElementById('number');
    var e = document.getElementById('brightness');
    var f = document.getElementById('timeslot');

    let updateDetail = {
        city: document.getElementById('city').value,
        address: document.getElementById('address').value,
        streetlightno: g.options[g.selectedIndex].value,
        brightness: e.options[e.selectedIndex].value,
        timeslot: f.options[f.selectedIndex].value
    };

    $.ajax({
        type: "POST",
        url: "/updateForm",
        dataType: "json",
        success: function (msg) {
            // return false;
            if (msg.length > 0 && msg[0].status == true) {
                alert(msg[0].message);
                location.href = '/updateForm';
            } else {
                alert(msg[0].message);
                // alert("Invalid User !");
                return false;
            }
        },
        data: updateDetail
    });
    return false;
}
