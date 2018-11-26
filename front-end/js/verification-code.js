//便于保存验证码
var code;
function createCode(){   
    code = '';
    //设置长度
    var codeLength = 4;
    var codeV = document.getElementById('code');
    //设置随机字符
    var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R', 'S','T','U','V','W','X','Y','Z');   
    for(var i = 0; i < codeLength; i++){
         var index = Math.floor(Math.random()*36);
         code += random[index]; 
    }
    codeV.value = code;
}

function validate(){
    var oValue = document.getElementById('input').value.toUpperCase();
    if(oValue ==0){
        alert('请输入验证码');
        return false;
    }else if(oValue != code){
        alert('验证码不正确，请重新输入');
        oValue = ' ';
        createCode();
        return false;
    }else{
        return true;
    }
}
//每次进入界面展示一个随机的验证码
window.onload = function (){

    createCode();
}