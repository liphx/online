<?
    header('Content-Type:application/json; charset=utf-8');
    $id=$_POST['group_id'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select name from group_apply where id='$id'");  
    $i=0;
    while($detail=mysql_fetch_row($result)){
        $arr[$i]=$detail[0];
        $i++;
    } 
    $json=json_encode( $arr );
    echo $json;    
?>