<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $username=$_SESSION['username'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select name,email from user where name='$username'"); 
    $detail=mysql_fetch_row($result); 
    $json=json_encode( $detail );
    echo $json;
    
       
?>