<?    
    header('Content-Type:application/json; charset=utf-8');
    $status=false;  
    $userName = $_POST["name"];
    $pass = $_POST["password"];
    $email = $_POST["email"];
    $Pass = md5($pass);
    $conn=mysql_connect("localhost","root","12345678");
    mysql_select_db("user",$conn);
    $result=mysql_query("select * from user where name='$userName' "); 
    $row=mysql_fetch_assoc($result);         
    if($row){
        $json=json_encode( array("status"=>$status) );
        echo $json;
    }
    else{
        $sql="insert into user(name,password,email) values('$userName','$Pass','$email')";
        mysql_query($sql);
        $status=true;
        $json=json_encode( array("status"=>$status) );
        echo $json;
    }          
 ?>
 