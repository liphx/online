function deal_friend(name,agree){
    $.post("/api/deal_friend",
    {
        "name":sessionStorage.userName,
        "session_id":sessionStorage.session_id,
        "friend_name":name,
        "agree":agree
    },
    function(data,status){
          update();   
    },
    "json"                      
 );
  
}


$(document).ready(function(){

    function update(){
        $.post("/api/apply_friend",
        {
            "name":sessionStorage.userName,
            "session_id":sessionStorage.session_id
        },
        function(data,status){
            var j=data["request"];
            var fa = $("#friend-apply");
            fa.empty();
            for(var i in j){
                var name=j[i];
                (function(name)
                {
                    var l = $("<p></p>");
                    fa.append(l);
                    l.css("display","block");
                    l.text(name);
                    var b1 = $("<button onclick=deal_friend(\""+name+"\",\"true\")>同意</button>");
                    b1.click(function(){
                        deal_friend(name,"true");
   
                    });
                    fa.append(b1);
                    b1.css("display","block");
                    var b2 = $("<button onclick=deal_friend(\""+name+"\",\"false\")>拒绝</button>");
                    fa.append(b2);
                    b2.css("display","block");  
                })(name);
                             
                
            }
        },
        "json"                      
     );
        setTimeout(update, 15000);
    }

    update();

    $("#panel4-button").click(function(){
        //查询并申请添加好友
        var name=$("#panel4-name").val();
        if(name==""){
            alert("请输入对方账号");
            return false;
        }
        else if(name==sessionStorage.userName){
            alert("不能添加自己为好友");
            return false;
        }
        else{$.post("/api/add_friend",
            {                          
                name:sessionStorage.userName,
                session_id:sessionStorage.session_id,
                friend_name:name
            },
            function(data,status){
               if(data.status){
                  alert("已发送申请");
               }
               else{
                  alert("账号不存在");
               }
            },
            "json"                      
         );
         return false;
       }
      });
  
  
   
  });