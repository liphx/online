<?
    header('Content-Type:application/json; charset=utf-8');
    parse_str(file_get_contents('php://input'), $data);
    $group_id = $data["group_id"];
    session_start();
    $name=$_SESSION['username'];

    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    
    $result=mysql_query("select * from group_member where id='$group_id' and name='$name' and owner=1");
    $owner=mysql_fetch_assoc($result);


    $status=-1;
    if(owner){
        mysql_query("delete from group_member where id='$group_id'");
        mysql_query("delete from groups where id='$group_id'");
        $status=0;
    }
    else{
         $result=mysql_query("select * from group_member where id='$group_id' and name='$name' and owner=0");
         $owner=mysql_fetch_assoc($result);
         if(owner){
            mysql_query("delete from group_member where id='$group_id' and name='$name'");
            $status=1;
         }
    }
    $json=json_encode( array("status"=>$status) );
    echo $json;
?>
