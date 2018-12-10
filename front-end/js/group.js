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
                 var b=$("<button onclick=group_message(\""+group_id+"\",\""+group_name+"\")></button>");
              //   console.log("<button onclick=group_message(\""+group_id+"\",\""+group_name+"\")></button>");
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
    $("#title p:eq(0)").text(group_name+"--"+username);
    $.post("../back-end/get_message_group.php",
    {
        group_id:group_id
    },
    function(data,status){
        var result=data;
        console.log(result);
        
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
});




