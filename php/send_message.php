<?
    header('Content-Type:application/json; charset=utf-8');
    $name2 = $_POST["name2"];
    $message=$_POST["message"];
    session_start();
    $name1=$_SESSION['username'];
    date_default_timezone_set('PRC'); 
    $date= date("Y/m/d");
    $time= date("H:i:s");
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    
    mysql_query("insert into message(name1,name2,message,date,time) values('$name1','$name2','$message','$date','$time')"); 
?>
