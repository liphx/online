$(document).ready(function(){
    $("#panel5-button").click(function(){
       var message=$("#reply-text").val();
       var name2 = $("#panel5 p:eq(0)").text();
       if(message==""){
         alert("消息不能为空");
         return false;
       }
       else{ 
        $.post("/api/send_message",
        {
          friend_name:name2,
          name:sessionStorage.userName,
          session_id:sessionStorage.session_id,
          message:message,
          },
          function(data,status){
          },
          "json"                      
       );
       
       var text = $("#reply-text") 
       text.after(text.clone().val("")); 
       text.remove(); 
       get_message(name2);

       var p=$("<p></p>");
       p.attr("class","pright");
       $("#display").append(p);  
       p.text(message);
      
       return false;
     }
    });


 
}); 