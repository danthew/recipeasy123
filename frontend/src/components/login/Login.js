import React, { useState } from 'react';


function Login() {

    var loginEmail;
    var loginPassword;
    const [message,setMessage] = useState('');

    const app_name = 'recipeasy1234'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const doLogin = async event => {
        event.preventDefault();
        var obj = {email:loginEmail.value,password:loginPassword.value};
        var js = JSON.stringify(obj);
        try {
            const response = await fetch(buildPath('api/login'), { 
                method:'POST',
                body:js,
                headers:{'Content-Type': 'application/json' }
            });
            console.log(js);
            var res = JSON.parse(await response.text());
            if( res.id <= 0 ) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/home';
            }
        }
    catch(e) {
        alert(e.toString());
        return;
    }
};

    return (
        <div id="loginDiv">
            <div className="loginText">
                <form onSubmit={doLogin}>
                    <div id="input_text">
                        <input type="text" id="loginName" placeholder="Username" ref={(c) => loginEmail = c} /><br />
				    </div>
                    {/* <ShowablePassword/> */}
                    <div id="input_text">
                        <input type="password" name="Password" toggleMask="true" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} /><br />
                    </div>
                    <input type="submit" id="loginButton" className="buttons" value="Login" onClick={doLogin}/>
                    </form>
                <span id="loginResult">{message}</span>
            </div>
        </div>
    );
}

export default Login;
