<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $name1=$_SESSION['username'];
    $name2=$_GET['name'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select * from message where (name1='$name1' and name2='$name2') or (name1='$name2' and name2='$name1') order by date,time");    
    $i=0;
    while($detail=mysql_fetch_row($result)){
        $arr[$i]=$detail;
        $i++;
    } 
    $json=json_encode( $arr );
    echo $json;    
?>