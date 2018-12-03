<?
    
    $agree = $_POST["agree"];
    $name1 = $_POST["name"];
    session_start();
    $name2=$_SESSION['username'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    mysql_query("insert into friend(name1,name2) values('$name1','$name2')");
    mysql_query("insert into friend(name1,name2) values('$name2','$name1')");
    
    mysql_query("delete from apply where name1='$name1' and name2='$name2' " );
    
    
?>
