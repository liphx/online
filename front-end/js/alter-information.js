$(document).ready(function(){
    $("#panel3-button").click(function(){
       var email=$("#email").val();
      
       if(email==""){
         alert("请填写表单");
         return false;
       }
       else{
        $.ajax({
            url: "../back-end/alter_information.php", 
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
     /*   $.post("../back-end/alter_information.php",
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