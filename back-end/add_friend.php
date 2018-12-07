<?
    header('Content-Type:application/json; charset=utf-8');
    $status=false;
    $name2 = $_POST["username"];
    session_start();
    $name1=$_SESSION['username'];
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select * from user where name='$name2'"); 
    $row=mysql_fetch_assoc($result);         
    if($row){
       $status=true;
       $sql="insert into apply(name1,name2) values('$name1','$name2')";
       mysql_query($sql);       
    }
    $json=json_encode( array("status"=>$status) );
    echo $json;   
?>
