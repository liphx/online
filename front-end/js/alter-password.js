$(document).ready(function(){
    $("#panel2-button").click(function(){
       var old=$("#old").val();
       var new1=$("#new1").val();
       var new2=$("#new2").val();
       if(new1=="" || new2=="" || old==""){
         alert("请填写密码");
         return false;
       }
       else if(new1!==new2){
         alert("两次新密码不一致");
         return false;
       }
       else{ 
        $.post("../back-end/alter_password.php",
          {                          
             old:old,
             new:new1
          },
          function(data,status){
             if(data.status){
                alert("修改成功");
             }
             else{
                alert("原密码输入错误");
             }
          },
          "json"                      
       );
       return false;
     }
    });


 
});