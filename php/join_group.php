<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $username=$_SESSION['username'];
    $id=$_POST['group_id'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $status;
    $result=mysql_query("select * from groups where id='$id'");  
    $row=mysql_fetch_assoc($result);         
    if($row==null){
        $status=2;//群号为空
    }
    else{
        $result2=mysql_query("select * from group_member where id='$id' and name='$username'"); 
        $row2=mysql_fetch_assoc($result2);         
        if($row2){
            $status=3;//已加入该群
        }
        else{
            $status=1;
            mysql_query("insert into group_apply(id,name) values('$id','$username') "); 
        }
    }
    $json=json_encode( array("status"=>$status) );
    echo $json;
    
       
?>