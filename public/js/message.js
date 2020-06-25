$("#addmessage").click(function () {
    submitmessage();
    return false;
});

function submitmessage() {
    console.log('button was clicked');
    console.log(document.getElementById('uname').value);
    console.log(document.getElementById('umessage').value);
    console.log(document.getElementById('uemail').value);
    

    let feedback = {
        name: document.getElementById('uname').value,
        message: document.getElementById('umessage').value,
        email:document.getElementById('uemail').value,
        read:"false"
     
    };
    if (checkEmptyString(feedback.name)) {
        alert('User name is required');
        return;
    }
    if (checkEmptyString(feedback.email)) {
        alert('pls enter your email id');
        return;
    }
    if (checkEmptyString(feedback.message)) {
        alert('pls enter some message');
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/message",
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
        data: feedback
    });

};

function checkEmptyString(val) {
    return (val == undefined || val == null || val.trim().length == 0);
}
