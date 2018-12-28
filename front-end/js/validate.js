//表单验证
$(document).ready(function(){


            $("#username").blur(function(){
                var $parent = $(this).parent();
                $parent.find(".error").remove();
                var regname = $.trim(this.value);
                var pattern = /^\w{2,15}$/;
            
                if(regname == ""||!pattern.test(regname)){
                $parent.append("<span class='error'>" + "用户名格式错误" + "</span>");                    
                return false;
                }
                else {
                    $parent.append("<span class='success'>" + "OK" + "</span>");
                    return true;
                }
            });

            $("#password").blur(function(){
                var $parent = $(this).parent();
                $parent.find(".error").remove();
                var regpass = $.trim(this.value);
                var pattern = /^\w{6,20}$/;
            
                if(regpass == ""||!pattern.test(regpass)){
                $parent.append("<span class='error'>" + "密码格式错误" + "</span>");                    
                return false;
                }
                else {
                    $parent.append("<span class='success'>" + "OK" + "</span>");
                    return true;
                }
            });

            $("#email").blur(function(){
                var $parent = $(this).parent();
                $parent.find(".error").remove();
                var regemail = $.trim(this.value);
                var pattern = /.+@.+\.[a-zA-Z]{2,4}$/;
              
                if(regemail == ""||!pattern.test(regemail)){
                $parent.append("<span class='error'>" + "邮箱格式错误" + "</span>");                    
                return false;
                }
                else {
                    $parent.append("<span class='success'>" + "OK" + "</span>");
                    return true;
                }
            });
        });