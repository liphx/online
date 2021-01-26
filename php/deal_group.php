<?
    
    $agree = $_POST["agree"];
    $name = $_POST["name"];
    $id=$_POST["group_id"];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    if($agree==="true"){
        mysql_query("insert into group_member(id,name) values('$id','$name')");
    } 
    mysql_query("delete from group_apply where id='$id' and name='$name' " ); 
?>
