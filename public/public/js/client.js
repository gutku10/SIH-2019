const button = document.getElementById('login');
button.addEventListener('click', function(e) {
  console.log('button was clicked');
    let admindetails = {
        id: document.getElementById('userid').value,
        password: document.getElementById('userpassword').value,
        
    };


    $.ajax({
        type: "POST",
        url: "/login",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href='/control';
            } else {
                alert("Invalid User !");
            }
        },
        data: admindetails
    });
});

function checkEmptyString(val)
{
    return (val == undefined || val == null || val.trim().length == 0);
}
