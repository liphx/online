function mygroup(){
    $.get("../back-end/list_group.php",
    function(data,status){
         var j=data;
         var panel=$("#group_display");
         if(j==undefined){
            var p=$("<p>你没有群聊，快去加入吧</p>");
            panel.append(p);
            console.log(j);

         }
    },
    "json"                      
 );

}

$(document).ready(function(){
    mygroup();
}




