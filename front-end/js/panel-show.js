function get_infor(){
    //获取用户信息
    var j;
    $.post("/api/information",
        {
            name:sessionStorage.userName,
            session_id:sessionStorage.session_id
        },
       function(data,status){
           console.log(data.information)
           $("#panel1 p:eq(0)").text(data.information.name);
           $("#panel1 p:eq(1)").text(data.information.email);
       },
       "json"                      
    );
}

$(document).ready(function(){
    $("#my-information").click(function(){
        $(".panel").css("display","none");
        $("#panel1").css("display","block");
        get_infor();
        
    });
    
    $("#alter-password").click(function(){
        $(".panel").css("display","none");
        $("#panel2").css("display","block");
    });

    $("#alter-information").click(function(){
        $(".panel").css("display","none");
        $("#panel3").css("display","block");
    });

    $("#add-friend").click(function(){
        $(".panel").css("display","none");
        $("#panel4").css("display","block");
    });
        
    

});