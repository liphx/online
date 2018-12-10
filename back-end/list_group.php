<?
    header('Content-Type:application/json; charset=utf-8');
    session_start();
    $username=$_SESSION['username'];
    
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);

    $result=mysql_query("select * from group_member where name='$username'");  

    
    $i=0;
    while($detail=mysql_fetch_row($result)){
        $arr[$i]=$detail[0];
        $result2=mysql_query("select * from groups where id='$arr[$i]'");
        $detail2=mysql_fetch_row($result2);
        $arr2[$i]=$detail2[0];
        $i++;
    } 

    $json=json_encode( $arr2 );
    echo $json;
    
       
?>