<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $username=$_SESSION['username'];
    
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);

    $result=mysql_query("select id from group_member where name='$username'");  

    
    $i=0;
    while($detail=mysql_fetch_row($result)){
        $arr[$i][0]=$detail[0];
        $id= $arr[$i][0];
        $result2=mysql_query("select name from groups where id='$id' ");
        $group_name=mysql_fetch_row($result2);
        $arr[$i][1]=$group_name[0];
        $i++;
    } 
    $json=json_encode( $arr );
    echo $json;
    
       
?>