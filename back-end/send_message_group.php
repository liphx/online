<?
    header('Content-Type:application/json; charset=utf-8');
    $name = $_POST["name"];
    $message=$_POST["message"];
    session_start();
    $groupid=$_SESSION['groupid'];
    date_default_timezone_set('PRC'); 
    $date= date("Y/m/d");
    $time= date("H:i:s");
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    
    mysql_query("insert into group_message(id,name,date,time,message) values('$groupid','$name','$date','$time','$message')"); 
?>
