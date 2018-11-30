<?
    header('Content-Type:application/json; charset=utf-8');
    $status=true;
    $email = $_POST["email"];
    session_start();
    $username=$_SESSION['username'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    mysql_query("update user set email='$email' where name='$username' "); 
    $json=json_encode( array("status"=>$status) );
    echo $json;   
?>
