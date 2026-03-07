document.getElementById('login-btn').addEventListener('click', function(){
    // get user input
    const username = document.getElementById('username');
    const user = username.value;
    console.log(user);
    
    // get the password
    const password = document.getElementById('password');
    const pass = password.value;
    console.log(pass);
    
    //condition
    if(user == 'admin' && pass == 'admin123')
    {
        alert('signin Successful');
        window.location.href = "home.html";//home page ee dukai dibe
    }
    else{
        alert('signin failed');
    }
});