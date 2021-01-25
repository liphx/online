$(document).ready(function(){
    $("#panel3-button").click(function(){
       var email=$("#email").val();
      
       if(email==""){
         alert("请填写表单");
         return false;
       }
       else{
        $.ajax({
            url: "/api/alter_information", 
            type:"PUT",
            data: {
              "email":email
            },     
            dataType: "json",          
            success: function(data,status){
              if(data.status){
                alert("修改成功");
             }
            }
        }); 
     /*   $.post("/api/alter_information",
          {                          
             email:email
          },
          function(data,status){
             if(data.status){
                alert("修改成功");
             }
             else{
                
             }
          },
          "json"                      
       );*/
       return false;
     }
    });


 
});