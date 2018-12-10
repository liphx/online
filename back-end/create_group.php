<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $username=$_SESSION['username'];
    $groupname=$_POST['groupname'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);

    $result=mysql_query("select * from group_list");  
    $i=1;
    while($detail=mysql_fetch_row($result)){
        $i++;
    }

    mysql_query("insert into group_list values('$i','groupname')");
    mysql_query("insert into group_chat values('$i','username')");

    $json=json_encode( $i );
    echo $json;
    
       
?>