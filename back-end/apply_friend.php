<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $username=$_SESSION['username'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select name1 from apply where name2='$username'");  
    $i=0;
    while($detail=mysql_fetch_row($result)){
        $arr[$i]=$detail[0];
        $i++;
    } 
    $json=json_encode( $arr );
    echo $json;
    
       
?>