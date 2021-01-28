// 封装发送json请求

function post_register(name, passwd, email, func) {
    $.post("/api/register",
        JSON.stringify({
            "name": name,
            "passwd": passwd,
            "email": email
        }),
        func, "json"
    );
}

function post_login(name, passwd, func) {
    $.post("/api/login",
        JSON.stringify({
            "name": name,
            "passwd": passwd
        }),
        func, "json"
    );
}

function post_islogin(name, session_id, func) {
    $.post("/api/islogin",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
        }),
        func, "json"
    );
}

function post_information(name, session_id, func) {
    $.post("/api/information",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
        }),
        func, "json"
    );
}

function post_alter_password(name, session_id, old_passwd, new_passwd, func) {
    $.post("/api/alter_password",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
            "old_passwd": old_passwd,
            "new_passwd": new_passwd,
        }),
        func, "json"
    );
}

function post_alter_information(name, session_id, email, func) {
    $.post("/api/alter_information",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
            "email": email,
        }),
        func, "json"
    );
}

function post_get_friends(name, session_id, func) {
    $.post("/api/get_friends",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
        }),
        func, "json"
    );
}

function post_get_message(name, session_id, friend_name, func) {
    $.ajax({
        url: "/api/get_message",
        type: "POST",
        data: JSON.stringify({
            "name": name,
            "session_id": session_id,
            "friend_name": friend_name,
        }),
        //timeout: 10000,
        dataType: "json",
        success: func
    });
}

function post_send_message(name, session_id, friend_name, message, func) {
    $.post("/api/send_message",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
            "friend_name": friend_name,
            "message": message,
        }),
        func, "json"
    );
}

function post_add_friend(name, session_id, friend_name, func) {
    $.post("/api/add_friend",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
            "friend_name": friend_name,
        }),
        func, "json"
    );
}

function post_apply_friend(name, session_id, func) {
    $.post("/api/apply_friend",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
        }),
        func, "json"
    );
}

function post_deal_friend(name, session_id, friend_name, agree, func) {
    $.post("/api/deal_friend",
        JSON.stringify({
            "name": name,
            "session_id": session_id,
            "friend_name": friend_name,
            "agree": agree,
        }),
        func, "json"
    );
}
