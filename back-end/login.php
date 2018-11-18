<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
</head>
<div class="login">
    <form method="post" action="">
        <fieldset>
            <legend>登录</legend>           
            <div>
                <p>账号：<input type="text" name="username"  placeholder="请输入用户名"></p>
            </div>
            <div>
                <p>密码：<input type="password" name="password" placeholder="请输入密码"></p>
            </div>
            <div>
                <input value="登录" type="submit" name="login">
                <a href="register.php" >注册帐号</a>
            </div>        
        </fieldset>
    </form>
    <?    
        if(isset($_POST["login"])){
            $userName = $_POST["username"];
            $pass = $_POST["password"];
            if($userName!="" && $pass!=""){
                $Pass = md5($pass);
                $conn=mysql_connect("localhost","root","12345678");
                mysql_select_db("user",$conn);
                $result=mysql_query("select * from user where name='$userName' and password='$Pass' "); 
                $row=mysql_fetch_assoc($result);         
                if(!$row){
                   echo "账号或密码错误";
                }
                else{
                   echo "登录成功";
                }
            }
            else{
                echo "账号和密码不能为空";
            }
            
        }
    ?>
</div>
</html>