function get_infor(){
    //获取用户信息
    var j;
    $.get("/api/information",
       function(data,status){
           j=data;

           $("#panel1 p:eq(0)").text(j[0]);
           $("#panel1 p:eq(1)").text(j[1]);
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