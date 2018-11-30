function get_fri(){
    var j;
    $.post("../back-end/friends.php",
       function(data,status){
           j=data;
           var fl = $("#friend-list");
           fl.empty();
           for(i=0;i<j.length;i++){
               var b = $("<button></button>");
               fl.append(b);
               b.css("display","block");
               b.text(j[i]);
               b.click(function(){
                   //聊天panel

               } );         
               
           }

           
       },
       "json"                      
    );

}

$(document).ready(function(){
    $("#infor_button").click(function(){
        $("#function button").css("display","none");
        $("#friend-list").css("display","none");
        $(".infor").css("display","block");
        
    });

    $("#fri_button").click(function(){
        $("#function button").css("display","none");
        $(".fri").css("display","block");
        get_fri();
        
    });

    $("#gro_button").click(function(){
        $("#function button").css("display","none");
        $("#friend-list").css("display","none");
        $(".gro").css("display","block");
        
    });         


});