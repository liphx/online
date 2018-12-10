<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $name=$_POST['name'];
    $id=$_POST['id'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select * from group_message where id='$id' and name='$name' order by date,time");    
    $i=10001;
    while($detail=mysql_fetch_row($result)){
        $arr[$i]=$detail;
        $i++;
    } 
    $json=json_encode( $arr );
    echo $json;    
?>