<?
    header('Content-Type:application/json; charset=utf-8');
    $status=false;
    $old = $_POST["old"];
    $new = $_POST["new"];
    $Pass = md5($old);
    $newPass = md5($new);
    session_start();
    $username=$_SESSION['username'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select * from user where name='$username' and password='$Pass' "); 
    $row=mysql_fetch_assoc($result);         
    if($row){
       $status=true;
       mysql_query("update user set password='$newPass' where name='$username' "); 
    }
    $json=json_encode( array("status"=>$status) );
    echo $json;   
?>
