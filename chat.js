ifUserIsLoggedIn(function() {
    // Update the user data
    updateUserData();

    // Load Users
    loadUsers(function(users) {
        var usersList = "";

        for (var uid in users) {
            var user = users[uid];

            // If the user is not the current user
            // only then add it to the list.
            if (window.currentUser.id != uid) {
                usersList += renderUser(user);
            }

        }

        getElement("members").innerHTML = usersList;
    });

    // Select chat
    // Load Messages
    onClickMultiple("member", function(element) {
        // Get the chat id
        var chat_id = element.id;
        // Change the name of the user we're chatting with
        var memberName = element.querySelector("#member-name").textContent;
        getElement("chat-info").textContent = memberName;
        // Show the chat info
        getElement("chat-info").style.display = "block";

        // Remove active class from all elements
        // with the member class
        removeClassMultiple("member", "active");
        // Add `active` class to the current element
        element.classList.add("active");
        // Show the chat form
        getElement("chat-form").style.display = "block";

        // Load the messages for the selected chat
        loadMessages(chat_id, function(messages) {
            var messagesList = "";

            for (var uid in messages) {
                var message = messages[uid];
                messagesList += renderMessage(message);
            }

            // Insert the messages inside the messages element
            getElement("messages").innerHTML = messagesList;
            // Scroll to the latest message (bottom)
            scrollToBottom(getElement('messages'));
        });

        getElement("chat-id").value = chat_id;
    });


    // Send button is clicked
    // send message to the current chat
    click("send-button", function() {
        var textBox = getElement("message-text");
        var text = textBox.value;
        var chat_id = getElement("chat-id").value;

        // Message is empty
        if (text.length < 1) {
            alert("Message is required!");
            // Halt further execution
            return false;
        }

        sendMessage(chat_id, text, function() {
            // Message sent
            // Make textbox value blank
            textBox.value = "";
        });
    });

    // Logout Button is clicked
    // log user out
    click("logout-button", function() {
        logoutUser();
    });

});
