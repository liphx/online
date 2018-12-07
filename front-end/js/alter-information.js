$(document).ready(function(){
    $("#panel3-button").click(function(){
       var email=$("#email").val();
      
       if(email==""){
         alert("请填写表单");
         return false;
       }
       else{ 
        $.post("../back-end/alter_information.php",
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
       );
       return false;
     }
    });


 
});