function formatDate(now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}


function get_infor() {
    //获取用户信息
    post_information(sessionStorage.userName, sessionStorage.session_id,
        function (data, status) {
            console.log(data.information)
            $("#panel1 p:eq(0)").text(data.information.name);
            $("#panel1 p:eq(1)").text(data.information.email);
        });
}

function update() {
    post_apply_friend(sessionStorage.userName, sessionStorage.session_id, function (data, status) {
        var j = data["request"];
        var fa = $("#friend-apply");
        fa.empty();
        for (var i in j) {
            var name = j[i];
            (function (name) {
                var l = $("<p></p>");
                fa.append(l);
                l.css("display", "block");
                l.text(name);
                var b1 = $("<button onclick=deal_friend(\"" + name + "\",true)>同意</button>");
                b1.click(function () {
                    deal_friend(name, true);

                });
                fa.append(b1);
                b1.css("display", "block");
                var b2 = $("<button onclick=deal_friend(\"" + name + "\",false)>拒绝</button>");
                fa.append(b2);
                b2.css("display", "block");
            })(name);
        }
    });
}

function deal_friend(friend_name, agree) {
    post_deal_friend(sessionStorage.userName, sessionStorage.session_id,
        friend_name, agree, function (data, status) {
            update();
        }
    );
}

function show_bottom() {
    var height = document.getElementById("display").scrollHeight;
    $("#display").scrollTop(height);
}

function show(name) {
    $(".panel").css("display", "none");
    $("#panel5").css("display", "block");//聊天界面
    $("#panel5 p:eq(0)").text(name);
    get_message(name, 0);
}

function get_fri() {
    //获取好友列表
    post_get_friends(sessionStorage.userName, sessionStorage.session_id,
        function (data, status) {
            var j = data["friends"];
            var fl = $("#friend-list");
            fl.empty();
            for (var i = 0; i < j.length; i++) {
                var name = j[i];
                sessionStorage.friend_name = name;
                var b = $("<button onclick=show(\'" + name + "\')></button>");

                fl.append(b);
                b.css("display", "block");
                b.text(name);
            }
        }
    );

}

$(document).ready(function () {
    $("#my-information").click(function () {
        $(".panel").css("display", "none");
        $("#panel1").css("display", "block");
        get_infor();
    });

    $("#alter-password").click(function () {
        $(".panel").css("display", "none");
        $("#panel2").css("display", "block");
    });

    $("#alter-information").click(function () {
        $(".panel").css("display", "none");
        $("#panel3").css("display", "block");
    });

    $("#add-friend").click(function () {
        $(".panel").css("display", "none");
        $("#panel4").css("display", "block");
        update();
    });

    $("#panel5-button").click(function () {
        var message = $("#reply-text").val();
        var name2 = $("#panel5 p:eq(0)").text();
        if (message == "") {
            alert("消息不能为空");
            return false;
        }
        else {
            post_send_message(sessionStorage.userName, sessionStorage.session_id,
                name2, message, function (data, status) { });

            var text = $("#reply-text")
            text.after(text.clone().val(""));
            text.remove();

            var p = $("<p></p>");
            var p_time = $("<p></p>");
            p_time.attr("class", "time pright");
            p.attr("class", "pright");

            $("#display").append(p_time);
            $("#display").append(p);
            var newDate = new Date();
            p_time.text(formatDate(newDate));
            p.text(message);
            show_bottom();

            return false;
        }
    });

    $("#upload").click(function () {
        var friend_name = $("#panel5 p:eq(0)").text();
        const files = document.getElementById('file').files;
        for (let i = 0, numFiles = files.length; i < numFiles; i++) {
            const file = files[i];
            var formData = new FormData();
            formData.append("name", sessionStorage.userName);
            formData.append("session_id", sessionStorage.session_id);
            formData.append("friend_name", friend_name);
            formData.append("files", file);

            $.ajax({
                url: "/api/upload_file",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (data, status) {
                    if (!data.status) {
                        alert("文件 " + file.name + " 发送失败");
                    } else {
                        var url = data.url;
                        var s = url.split('/');
                        var filename = s[s.length - 1];

                        var p = $("<p></p>");
                        var p_time = $("<p></p>");
                        p_time.attr("class", "time pright");
                        p.attr("class", "pright");

                        $("#display").append(p_time);
                        $("#display").append(p);
                        var newDate = new Date();
                        p_time.text(formatDate(newDate));
                        p.text("发送文件 ");
                        var a = $("<a></a>");
                        a.attr("href", url);
                        a.text(filename);
                        p.append(a);
                        show_bottom();
                    }
                }
            });

            // var reader = new FileReader();
            // reader.onload = function(evt) {
            //     buffer = evt.target.result; // ArrayBuffer
            // };

            // reader.readAsArrayBuffer(file);
        }

        return false;
    });

    $("#panel2-button").click(function () {
        var old = $("#old").val();
        var new1 = $("#new1").val();
        var new2 = $("#new2").val();
        if (new1 == "" || new2 == "" || old == "") {
            alert("请填写密码");
            return false;
        }
        else if (new1 !== new2) {
            alert("两次新密码不一致");
            return false;
        }
        else {
            post_alter_password(sessionStorage.userName, sessionStorage.session_id,
                old, new1, function (data, status) {
                    if (data.status) {
                        alert("修改成功");
                    }
                    else {
                        alert("原密码输入错误");
                    }
            });

            return false;
        }
    });

    $("#panel3-button").click(function () {
        var email = $("#email").val();

        if (email == "") {
            alert("请填写表单");
            return false;
        }
        else {
            post_alter_information(sessionStorage.userName, sessionStorage.session_id,
                email, function (data, status) {
                    if (data.status) {
                        alert("修改成功");
                    }
            });
            return false;
        }
    });

    $("#panel4-button").click(function () {
        //查询并申请添加好友
        var name = $("#panel4-name").val();
        if (name == "") {
            alert("请输入对方账号");
            return false;
        }
        else if (name == sessionStorage.userName) {
            alert("不能添加自己为好友");
            return false;
        }
        else {
            post_add_friend(sessionStorage.userName, sessionStorage.session_id,
                name, function (data, status) {
                    if (data.status) {
                        alert("已发送申请");
                    }
                    else {
                        alert("账号不存在");
                    }
            });
            return false;
        }
    });

    $("#infor_button").click(function () {
        $("#function button").css("display", "none");
        $("#friend-list").css("display", "none");
        $(".infor").css("display", "block");

    });

    $("#fri_button").click(function () {
        $("#function button").css("display", "none");
        $(".fri").css("display", "block");
        get_fri();

    });

    $("#gro_button").click(function () {
        window.open("group.html", '_blank').location;

    });

});

function get_message(name, how) {
    post_get_message(sessionStorage.userName, sessionStorage.session_id,
        name, how, function (data, status) {
            var result = data["message"];
            result.sort(function(a, b) {
                return a.time > b.time;
            });

            console.log(result);
            if (how == 0) {
                $("#display").empty();
            }
            
            for (var i in result) {
                var name1 = result[i]["name1"];
                var name2 = result[i]["name2"];
                var send_time = result[i]["time"];
                var message_type = result[i]["type"];

                var p_time = $("<p></p>");
                var p = $("<p></p>");
                if (name == name1) {
                    p_time.attr("class", "time pleft");
                    p.attr("class", "pleft");
                } else {
                    p_time.attr("class", "time pright");
                    p.attr("class", "pright");
                }
                $("#display").append(p_time);
                $("#display").append(p);
                var newDate = new Date();
                newDate.setTime(send_time * 1000);
                p_time.text(formatDate(newDate));

                if (message_type == "message") {
                    var message = result[i]["message"];
                    p.text(message);
                } else if (message_type == "file") {
                    var url = result[i]["message"];
                    var s = url.split('/');
                    var filename = s[s.length - 1];
                    if (name == name1) {
                        p.text('收到文件 ');
                    } else {
                        p.text('发送文件 ');
                    }
                    var a = $("<a></a>");
                    a.attr("href", url);
                    a.text(filename);
                    p.append(a);
                }
                show_bottom();
            }
            if (name == sessionStorage.friend_name) {
                setTimeout(get_message(name, 1), 1000);
            }
        }
        
    );
}
