<?
    header('Content-Type:application/json; charset=utf-8');
    $group_id = $_POST["group_id"];
    $message=$_POST["message"];
    session_start();
    $name=$_SESSION['username'];
    date_default_timezone_set('PRC'); 
    $date= date("Y/m/d");
    $time= date("H:i:s");
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    
    mysql_query("insert into group_message(id,name,time,message,date) values('$group_id','$name','$time','$message','$date')"); 
?>
