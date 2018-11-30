<?
    header('Content-Type:application/json; charset=utf-8');
    $status=false;
    $userName = $_POST["username"];
    $pass = $_POST["password"];
    $Pass = md5($pass);
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select * from user where name='$userName' and password='$Pass' "); 
    $row=mysql_fetch_assoc($result);         
    if($row){
       $status=true;
    }
    $json=json_encode( array("status"=>$status) );
    if($status){//写入session
        session_start();
        $_SESSION['username']=$userName;          
    }
    echo $json;   
?>
