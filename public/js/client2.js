$(document).ready(function () {
    localStorage.removeItem('userType');
});

$("#login").submit(function () {
    //alert("done")
    loginSubmit();
    return false;
})

function loginSubmit() {
    var e = document.getElementById('author');

    let admindetails = {
        id: document.getElementById('userid').value,
        password: document.getElementById('userpassword').value,
        authorization: e.options[e.selectedIndex].value,
    };

    $.ajax({
        type: "POST",
        url: "/login",
        dataType: "json",
        success: function (msg) {
            // return false;
            if (!(msg == undefined || msg == null || msg.length == 0)) {
                localStorage.setItem('userType', msg[0].authorization);
                localStorage.setItem('userCity', msg[0].city);
                if (msg[0].authorization == "admin") {
                    location.href = '/madmin';
                }
                else if (msg[0].authorization == "member") {
                    location.href = '/mmember'
                }
                else {
                    alert("Invalid User !");
                    return false;
                }
            }
            else {
                alert("Invalid User !");
                return false;
            }
        },
        data: admindetails
    });
    return false;
}


function checkEmptyString(val) {
    return (val == undefined || val == null || val.trim().length == 0);
}
