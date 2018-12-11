function mygroup(){
    $.get("../back-end/list_group.php",
    function(data,status){
        
         var j=data;
         var panel=$("#group_display");
         panel.empty();
         if(j==undefined){
            var p=$("<p>你没有群聊，快去加入吧</p>");
            panel.append(p);
         }
         else{
             for(var i=0;i<j.length;i++){
                 var group_id=j[i][0];
                 var group_name=j[i][1];
                 var b=$("<button onclick=show_message_group(\""+group_id+"\",\""+group_name+"\")></button>");
                 panel.append(b);
                 b.css("display","block");
                 b.text(j[i][1]);

             }
 
         }
    },
    "json"                      
 );

}

function show_bottom(){
    var height=document.getElementById("message_display").scrollHeight;
    $("#message_display").scrollTop(height); 
}

function group_message(group_id,group_name){
    sessionStorage.group_id=group_id;
    sessionStorage.group_name=group_name;
    var username=sessionStorage.username;
    $("#title p:eq(0)").text(group_name+"("+group_id+")--"+username);
    $.post("../back-end/get_message_group.php",
    {
        group_id:group_id
    },
    function(data,status){
        var result=data;
        
        var panel=$("#message_display");
        panel.empty();
        for(var i in result){
            var p=$("<p></p>");
            if(result[i][3]===username){
                p.attr("class","pright");
            }
            else{
                p.attr("class","pleft");
            }
            p.text(result[i][0]+" "+result[i][1]+" "+result[i][2]+" "+result[i][3]);  
            panel.append(p);  
            show_bottom();

        }    
    },
        "json"                      
     );

}
function show_message_group(group_id,group_name){
    $("#joinGroup").css("display","none");
    $("#setGroup").css("display","none");
    $("#message").css("display","block");
    group_message(group_id,group_name);
}

function send_message_group(group_id,group_name,username){
        var message=$("#send-text").val();
        if(message==""){
          alert("消息不能为空");
          return false;
        }
        else{ 
         $.post("../back-end/send_message_group.php",
           {                          
              message:message,
              group_id:group_id
           },
           "json"                      
        );
        var text = $("#send-text") 
        text.after(text.clone().val("")); 
        text.remove(); 
        group_message(group_id,group_name);
        return false;
      }
     
}
function show_message(){
    if(sessionStorage.group_id){
        group_message(sessionStorage.group_id,sessionStorage.group_name);
    }
    setTimeout(show_message,1000);
}

show_message();

$(document).ready(function(){
    mygroup();
    $("#send").click(function(){
        var group_id=sessionStorage.group_id;
        var group_name=sessionStorage.group_name;
        var username=sessionStorage.username;
        send_message_group(group_id,group_name,username);
    });
    $("#join").click(function(){
        $("#message").css("display","none");
        $("#setGroup").css("display","none");
        $("#joinGroup").css("display","block");
    });

    $("#join-button").click(function(){
        var group_id=$("#groupId").val();
        var text = $("#groupId") 
        text.after(text.clone().val("")); 
        text.remove();
        if(group_id==""){
            alert("请输入群号");
            return false;
        }
        else{$.post("../back-end/join_group.php",
            {                          
               group_id:group_id
            },
            function(data,status){
               if(data.status===1){
                  alert("已发送申请");
               }
               else if(data.status===2){
                  alert("群号不存在");
               }
               else if(data.status===3){
                alert("你已经加入该群");
               }
            },
            "json"                      
         );
         return false;
       }
      });


      $("#create-button").click(function(){
        var group_name=$("#groupName").val();
        var text = $("#groupName") 
        text.after(text.clone().val("")); 
        text.remove();
        if(group_name==""){
            alert("请输入群名");
            return false;
        }
        else{$.post("../back-end/create_group.php",
            {                          
               group_name:group_name
            },
            function(data,status){
               alert("创建成功，群号为:"+data.id);
            },
            "json"                      
         );
         return false;
       }
      }); 
       
      $("#setting").click(function(){
        var group_id=sessionStorage.group_id;
        var username=sessionStorage.username;
        var group_name=sessionStorage.group_name;
        function get_apply(group_id){
            $("#manage").empty();
            $.post("../back-end/apply_group.php",
            {                          
               group_id:group_id
            },
            function(data,status){
                var j=data;
                var ma = $("#manage");
                for(var i in j){
                    var name=j[i];
                    (function(name)
                    {
                        var l = $("<p></p>");
                        ma.append(l);
                        l.css("display","block");
                        l.text(name);
                        var b1 = $("<button>同意</button>");  
                        b1.click(function(){
                            $.post("../back-end/deal_group.php",
                            {                          
                               name:name,
                               group_id:group_id,
                               agree:"true"
                            },
                            function(data,status){
                                get_apply(group_id);
                            });
       
                        });            
                        ma.append(b1);
                        b1.css("display","block");
                        var b2 = $("<button>拒绝</button>");
                        b2.click(function(){
                            $.post("../back-end/deal_group.php",
                            {                          
                               name:name,
                               group_id:group_id,
                               agree:"false"
                            },
                            function(data,status){
                                get_apply(group_id);
                            });
       
                        });
                        ma.append(b2);
                        b2.css("display","block");  
                    })(name);                            
                    
                }
            },
            "json"                      
            );

        }
        $("#message").css("display","none");
        $("#setGroup").css("display","none");
        $("#setGroup").css("display","block");
        $("#setGroup label:eq(0)").text(group_name+"("+group_id+")");
        var isOwner=0;
        $.post("../back-end/isOwner.php",
        {                          
           group_id:group_id
        },
        function(data,status){
           if(data.status===1){
            isOwner=1;
            $("#setGroup p:eq(0)").text("群主");
            $("#manage").empty();
            get_apply(group_id);
           }
           else{
            isOwner=0;
            $("#setGroup p:eq(0)").text("成员");
            $("#manage").empty();
            var p=$("<p>你没有管理权限</p>");
            $("#manage").append(p);
           }
        },
        "json"                      
        );

      });

});




