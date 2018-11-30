function get_infor(){
    var j;
    $.post("../back-end/information.php",
       function(data,status){
           j=data;

           $("#panel1 p:eq(0)").text(j[0]);
           $("#panel1 p:eq(1)").text(j[1]);
       },
       "json"                      
    );
    return j;
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
        
    

});