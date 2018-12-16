<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $name=$_SESSION['username'];
    $id=$_GET['group_id'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select message,date,time,name from group_message where id='$id' order by date,time");    
    $i=1;
    while($detail=mysql_fetch_row($result)){
        $arr[$i]=$detail;
        $i++;
    } 
    $json=json_encode( $arr );
    echo $json;    
?>