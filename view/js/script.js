/**
 * socket script
 */

var socket = null;


//firebase initialization
 var config = {} // Firebase Config
var app = firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        renderMain();
    } else {
        renderLogin();
    }
});
var signUp = (email, pass, name) => {
    app.auth().createUserWithEmailAndPassword(email, pass).then((user) => {
        return user.user.updateProfile({ 'displayName': name }).then((user) => {
            renderMain();
        });

    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });

};

var signIn = (email, pass) => {
    app.auth().signInWithEmailAndPassword(email, pass).then((user) => {
        if (app.auth().currentUser != null) {
            renderMain();
        }
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });

};


/*

*/

/**
 * DOM script
 */

//react Main Component
class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let x = app.auth().currentUser;
        var script = document.createElement("script");
        var login = () => {
            console.log("we're here");
            var email = document.getElementById("lemail").value;
            var pass = document.getElementById("lpwd").value;
            if (validateEmail(email) && pass != null && app.auth().currentUser == null) {
                signIn(email, pass);
            } else {
                alert("Please Enter a Valid Email Address");
            }

        };
        document.getElementById("renderSignup").onclick = renderSignup;
	document.getElementById("fp").onclick = ()=>{
	var email = document.getElementById("lemail").value;
           
            if (validateEmail(email) && app.auth().currentUser == null) {
                app.auth().sendPasswordResetEmail(email).then(()=>{alert("Reset Link is sent to your email !");}).catch(error=>alert(error.message));
            } else {
                alert("Please Enter a Valid Email Address");
            }
	}
        var sjs = document.createTextNode(login + "\n" + "document.getElementById('login').onclick = login;");
        script.appendChild(sjs);
        document.body.appendChild(script);
    }

    render() {
        return (<div dir="ltr">
            <h3 class="labels">
                Login
</h3>
            <div class="form-group">
                <label for="email">Email:</label>
                <input ref="lemail" type="email" class="form-control" id="lemail" placeholder="Enter email" />
            </div>
            <div class="form-group">
                <label for="pwd">Password:</label>
                <input type="password" class="form-control" id="lpwd" placeholder="Enter password" />
            </div>
<div> <a href="#" id="fp"> Forgotten Password ? </a> </div>
            <button type="submit" class="btn btn-primary" id="login" >Login</button>
            <button type="button" class="btn btn-default" id="renderSignup">Sign Up</button>
    </div>);
    }
}

class SignUp extends React.Component {
    render() {
        return (<div dir="ltr">
            <h3 class="labels">
                Sign Up
            </h3>
            <div class="form-group">
                <label for="email">Name:</label>
                <input type="email" class="form-control" id="sname" placeholder="Enter user name" />
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" class="form-control" id="semail" placeholder="Enter email" />
            </div>
            <div class="form-group">
                <label for="pwd">Password:</label>
                <input type="password" class="form-control" id="spwd" placeholder="Enter password" />
            </div>
	<div> <a href="#" id="fp"> Forgotten Password ? </a> </div>           
<button class="btn btn-primary" id="signup" >Sign Up</button>
            <button class="btn btn-default" id="renderlogin">Login</button>

        </div>);
    }
    componentDidMount() {
        //var script = document.createElement("script");
        var signupUI = () => {
            var email = document.getElementById("semail").value;
            var pass = document.getElementById("spwd").value;
            var name = document.getElementById("sname").value;
            if (validateEmail(email) && pass != null && name != null && app.auth().currentUser == null) {
                signUp(email, pass, name);
            } else {
                alert("Please Enter a Valid Email Address");
            }

        };

        document.getElementById("renderlogin").onclick = renderLogin;
        document.getElementById('signup').onclick = signupUI;
        //var sjs = document.createTextNode(signupUI);
        //script.appendChild(sjs);
        document.body.appendChild(script);
	document.getElementById("fp").onclick = ()=>{
	var email = document.getElementById("lemail").value;
           
            if (validateEmail(email) && app.auth().currentUser == null) {
                app.auth().sendPasswordResetEmail(email).then(()=>{alert("Reset Link is sent to your email !");}).catch(error=>alert(error.message));
            } else {
                alert("Please Enter a Valid Email Address");
            }
	}
    }
}
var classify = (msgs,name)=>{
    var newm =[];
    msgs.map((msg)=>{

        if(msg.sender == name ){
            msg.type = "sent";
        }else{
            msg.type = "received";
        }
        if(msg.msg.match(/[\u0600-\u06FF]/)!= null){
            msg.lang = "ar";
        }else{
            msg.lang = "en";
        }
        newm.push( <div class="message" position={msg.type}>
            <div class="user_name">
                {msg.sender}
            </div>
            <div class="user_message" lang={msg.lang}>
                {msg.msg}
            </div>
            </div>);
        ;
    });
    return newm;

}
class Message extends React.Component {
  constructor(){
    super();
      this.state = {messages:[],username : app.auth().currentUser.displayName};
      
  }
  getInitialState(){
        return ({messages : []});
    }
    componentDidMount(){
$.get("http://localhost:4444/portnum",{
crossDomain: true,
headers: { 'Access-Control-Allow-Origin': '*' }
},(data)=>{
	var port = parseInt(data.responseText);
	console.log(port);
	if(port == undefined)
	port = 4444;

        socket = io.connect("localhost:" + port);
        socket.on("chat_messages",(msgs)=>{
            msgs = classify(msgs,this.state.username);
            this.setState({messages:this.state.messages.concat(msgs)});
            socket.on("chat_message", (msg) => { 
                if(msg.sender == this.state.username ){
                    msg.type = "sent";
                }else{
                    msg.type = "received";
                }
                if(msg.msg.match(/[\u0600-\u06FF]/)!= null){
                    msg.lang = "ar";
                }else{
                    msg.lang = "en";
                }
                this.setState({messages:this.state.messages.concat(
                    <div class="message" position={msg.type}>
                    <div class="user_name">
                        {msg.sender}
                    </div>
                    <div class="user_message" lang={msg.lang}>
                        {msg.msg}
                    </div>
                    </div>)
                });
             });

        });
    });

        
    }
    render() {
        return this.state.messages;
    }
}
class Main extends React.Component {
    constructor(){
        super();
        this.state ={user_name: app.auth().currentUser.displayName};
    }
    getInitialState(){
        return {user_name: app.auth().currentUser.displayName};
    }
    componentDidMount(){
        var sendMessage = () => {
            var message = document.getElementById("msg_txt").value;
            document.getElementById("msg_txt").value = "";
            if(message.length !=0){
                socket.emit("chat_message",{
                    sender:this.state.user_name,
                    msg:message
                });
            }
        };
        document.getElementById("msg_txt").onkeyup =  function(e) {
            var key = e.keyCode ? e.keyCode : e.which;
             
            if (key == 13) {
                sendMessage();
            }
         };
        document.getElementById("send_message").onclick = sendMessage;
        document.getElementById("signout").onclick = ()=>{
            socket.emit("leaving");
            socket.disconnect();
            app.auth().signOut();
            renderLogin();
        };
    }
    render() {
        return (
            <div class="row" id="row1">
                <div class="col-md-12 msgpn">
                    <div class="navbar msgnv">
                        <div id="chat_title">
                            JS Chat - Ahmed Rafie
       </div>
                        <div id="signout">
                            <i class="fa fa-sign-out" aria-hidden="true"></i>
                        </div>

                    </div>
                    <div id="messages" class="messages">
                        <Message />

                    </div>
                    <div id="send_box">

                        <div id="message_text">
                            <textarea type="text" id="msg_txt"></textarea>
                        </div>
                        <button class="btn btn-info" id="send_message">
                            <i class="fa fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>

        );
    }
}

var renderMain = () => {
    ReactDOM.render(
        <Main />
        ,
        document.getElementById('container')
    );
};
var renderLogin = () => {

    ReactDOM.render(
        <Login />,
        document.getElementById('container')
    )

};
var renderSignup = () => {
    ReactDOM.render(
        <SignUp />,
        document.getElementById('container')
    )

};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}