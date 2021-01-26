<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $username=$_SESSION['username'];
    $id=$_POST['group_id'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $status=0;
    $result=mysql_query("select owner from group_member where id='$id' and name='$username' and owner=1 ");  
    $row=mysql_fetch_assoc($result);         
    if($row){
       $status=1;
    }
    
    $json=json_encode( array("status"=>$status) );
    echo $json;
    
       
?>