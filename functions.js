function click(elementId, fn) {
    var element = document.getElementById(elementId);

    if (element) {
        element.addEventListener("click", fn);
    }
}

function redirect(path) {
    window.location = path;
    return false;
}

function loginWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // The signed-in user info.
      var user = result.user;

      // Create user
      createUser(user.uid, user.displayName, user.email, user.photoURL);
    }).catch(function(error) {
      console.log(error.message);
    });
}

function logInUser() {
    // Log in with Google
    // using Firebase
    loginWithGoogle();
}

function createUser(uid, uname, uemail, photoURL) {
    // Get a reference to the database service
    var database = firebase.database();
    var usersRef = database.ref("users");

    var user = {
        id: uid,
        name: uname,
        email: uemail,
        imageUrl: photoURL
    };

    usersRef.child(uid).set(user).then(function() {
        redirect("chat.html");
    });
}

function ifUserIsLoggedIn(fn) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.currentUser = {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            imageUrl: user.photoURL
        };

        fn();
      } else {
        // No user is signed in.
        // Redirect to home page
        redirect('index.html');
      }
    });
}

function getElement(id) {
    return document.getElementById(id);
}

function updateUserData() {
    var usernameElement = getElement("username");
    var userImageElement = getElement("user-image");

    usernameElement.textContent = window.currentUser.name;
    userImageElement.src = window.currentUser.imageUrl;
}

function loadUsers(fn) {
    var database = firebase.database();
    var usersRef = database.ref("users");

    usersRef.on('value', function(snapshot) {
        var users = snapshot.val();

        fn(users);
    });

}

function renderUser(user) {
    var uid = user.id;
    var chat_id = getChatId(window.currentUser.id, uid);
    var name = user.name;
    var imageUrl = user.photoURL;

    if (!imageUrl) {
        imageUrl = "default.png";
    }

    var html = '<div id="' + chat_id + '" class="member"><img src="'+ imageUrl  +'">';
    html += '<span id="member-name">' + name + '</span>';
    html+= '</div>';

    return html;
}

function getChatId(id1, id2) {
    if (id1 > id2) {
        return id1 + "" + id2;
    }

    return id2 + "" + id1;
}

function onClickMultiple(className, func) {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains(className)) {
            func(event.target);
        }
    });
}

function loadMessages(chat_id, fn) {
    var database = firebase.database();
    var chatsRef = database.ref("chats");

    chatsRef.child(chat_id).on('value', function(snapshot) {
        var messages = snapshot.val();

        fn(messages);
    });
}

function renderMessage(message) {
    var text = message.text;
    var msgClass = "message";

    if (message.sender_id == window.currentUser.id) {
        msgClass = "message by-user";
    }

    var html = '<div class="'+ msgClass +'">' + text + '</div>';

    return html;
}

function sendMessage(chat_id, text) {
    var message = {
        text: text,
        sender_id: window.currentUser.id
    };

    var database = firebase.database();
    var chatsRef = database.ref("chats");
    var chat = chatsRef.child(chat_id);
    var newMessageId = chatsRef.push().key;

    chat.child(newMessageId).set(message);
}

function removeClassMultiple(elementClass, classNameToRemove) {
    var elements = document.getElementsByClassName(elementClass);

    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove(classNameToRemove);
    }

}

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

function logoutUser() {
    // Sign out user
    firebase.auth().signOut().then(function() {
        // User signed out
        // redirect to home page.
        redirect('index.html');
    }, function(error) {
        console.log(error);
    });
}
