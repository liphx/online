<!DOCTYPE html>
<html><head><meta charset="UTF-8">
</head>
<body>
    
<h1>欢迎加入我们</h1>
    <form  method="post" action="">
        <div>
            <label>账号</label>
            <input name="name" type="text"  maxlength="15">
        </div>
        <div>
            <label>密码</label>
            <input name="password" type="password" maxlength="20">
        </div>
        <div>
            <label>邮箱</label>
            <input name="email" type="email" maxlength="50">
        </div>
        <br>
        <div>
            <input type="submit" name="register" value="注册" id="button">
        </div>
    </form>
    
    <?    
        if(isset($_POST["register"])){
            $userName = $_POST["name"];
            $pass = $_POST["password"];
            $email = $_POST["email"];
            if($userName!="" && $pass!="" && $email!=""){
                $Pass = md5($pass);
                $conn=mysql_connect("localhost","root","12345678");
                mysql_select_db("user",$conn);
                $result=mysql_query("select * from user where name='$userName' "); 
                $row=mysql_fetch_assoc($result);         
                if($row){
                    echo "用户名已存在";
                }
                else{
                    $sql="insert into user(name,password,email) values('$userName','$Pass','$email')";
                    mysql_query($sql);
                    echo "注册成功";
                }
            }
            else{
                echo "账号和密码与邮箱均不能为空";
            }
            
        }
    ?>

       
      
<ul>
  <li>已经拥有帐号? <a rel="nofollow" href="login.php">直接登录</a></li>
</ul>
</body>
</html>

