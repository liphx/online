function mygroup(){
    $.get("../back-end/list_group.php",
    function(data,status){
        
         var j=data;
         console.log(j);
         var panel=$("#group_display");
         panel.empty();
         if(j==undefined){
            var p=$("<p>你没有群聊，快去加入吧</p>");
            panel.append(p);
            

         }
    },
    "json"                      
 );

}

$(document).ready(function(){
    mygroup();
});




