
function show_bottom(){
    var height=document.getElementById("display").scrollHeight;
    $("#display").scrollTop(height); 
}

function get_message(name){
    $.post("/api/get_message",
    {
        friend_name:name,
        name:sessionStorage.userName,
        session_id:sessionStorage.session_id
    },
    function(data,status){
        var result=data["message"];
        console.log(result);
        //$("#display").empty();
        for(var i in result){
            var p=$("<p></p>");
            if(result[i]["name1"]==name){
                p.attr("class","pleft");
            }
            else{
                p.attr("class","pright");
            }
            $("#display").append(p);  
            p.text(result[i]["message"]);  
            show_bottom();       
        }    
    },
    "json"                      
 );
}

function showchat(){
    if(sessionStorage.username2){
        get_message(sessionStorage.username2);
    }
    setTimeout(showchat, 1500);
}

showchat();

function show(name){
    $(".panel").css("display","none");
    $("#panel5").css("display","block");//聊天界面
    $("#panel5 p:eq(0)").text(name);
    get_message(name); 
    sessionStorage.username2=name;   
}

function get_fri(){
    //获取好友列表
    var j;
    $.post("/api/get_friends",
    {
        name:sessionStorage.userName,
        session_id:sessionStorage.session_id
    },
       function(data,status){
           j=data["friends"];
           var fl = $("#friend-list");
           fl.empty();
           for(var i=0;i<j.length;i++){
               var name = j[i];
               var b = $("<button onclick=show(\'"+name+"\')></button>");
             
               fl.append(b);
               b.css("display","block");
               b.text(name);
           }

       },
       "json"                      
    );

}

$(document).ready(function(){
    $("#infor_button").click(function(){
        $("#function button").css("display","none");
        $("#friend-list").css("display","none");
        $(".infor").css("display","block");
        
    });

    $("#fri_button").click(function(){
        $("#function button").css("display","none");
        $(".fri").css("display","block");
        get_fri();
        
    });

    $("#gro_button").click(function(){
        window.open("group.html", '_blank').location;
        
    });         


});