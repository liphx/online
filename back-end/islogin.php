<?
    header('Content-Type:application/json; charset=utf-8');
    $status=false;
    $username;
    session_start();
    if(isset($_SESSION['username'])){
        $status=true; 
        $username=$_SESSION['username'];
    }
    $json=json_encode( array("status"=>$status,"username"=>$username) );
    echo $json;   
?>
