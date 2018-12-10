function mygroup(){
    $.get("../back-end/list_group.php",
    function(data,status){
        
         var j=data;
         var panel=$("#group_display");
         panel.empty();
         if(j==undefined){
            var p=$("<p>你没有群聊，快去加入吧</p>");
            panel.append(p);
         }
         else{
             for(var i=0;i<j.length;i++){
                 var b=$("<button></button>");
                 panel.append(b);
                 b.css("display","block");
                 b.text(j[i][1]);

             }
 
         }
    },
    "json"                      
 );

}

$(document).ready(function(){
    mygroup();
});




