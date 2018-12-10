$(document).ready(function(){
    $("#panel5-button").click(function(){
       var message=$("#reply-text").val();
       var name2 = $("#panel5 p:eq(0)").text();
       if(message==""){
         alert("消息不能为空");
         return false;
       }
       else{ 
        $.post("../back-end/send_message.php",
          {                          
             message:message,
             name2:name2
          },
          function(data,status){
            
          },
          "json"                      
       );
       var text = $("#reply-text") 
       text.after(text.clone().val("")); 
       text.remove(); 
       get_message(name2); 
       return false;
     }
    });


 
}); 