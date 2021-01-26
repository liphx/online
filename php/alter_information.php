<?
    header('Content-Type:application/json; charset=utf-8');
    $status=true;
    parse_str(file_get_contents('php://input'), $data);
    $email=$data['email'];  
    session_start();
    $username=$_SESSION['username'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    mysql_query("update user set email='$email' where name='$username' "); 
    $json=json_encode( array("status"=>$status) );
    echo $json;   
?>
