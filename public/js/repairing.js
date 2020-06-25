$("#addsearch").click(function () {
    submitRequest();
    return false;
});

function submitRequest() {
    console.log('button was clicked');
    console.log(document.getElementById('usercontact').value);
    console.log(document.getElementById('useremail').value);
    console.log(document.getElementById('pac-input').value);

    let repairing = {
        usercontact: document.getElementById('usercontact').value,
        userEmail: document.getElementById('useremail').value,
        search: document.getElementById('pac-input').value,
    };
    if (checkEmptyString(repairing.usercontact)) {
        alert('User name is required');
        return;
    }
    if (checkEmptyString(repairing.userEmail)) {
        alert('User Email is required');
        return;
    }
    if (checkEmptyString(repairing.search)) {
        alert('User Search is required');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                if (msg[0].status == true) {
                    alert(msg[0].message);
                    location.href = '/';
                } else {
                    alert(msg[0].message);
                    return false;
                }
            }
            else {
                alert('Error Occurred');
                return false;
            }
        },
        data: repairing
    });

};

function checkEmptyString(val) {
    return (val == undefined || val == null || val.trim().length == 0);
}
