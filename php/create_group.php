<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $username=$_SESSION['username'];
    $group_name=$_POST['group_name'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);

    $query=mysql_query( "insert into groups(name) values('$group_name')" );
    
    $result=mysql_query( "select MAX(id) from groups" );
    $detail=mysql_fetch_row($result); 
    if($detail){
        $id=$detail[0];
    }

    $query=mysql_query( "insert into group_member(id,name,owner) values('$id','$username',1)" );
    $json=json_encode( array("id"=>$id) );
    echo $json;   
?>