<?php

function conecta_bd(){
    $servidor = "localhost";
    $usuario = "root";
    $clave = "";
    $bd = "mymtgpool";
    
    $conn=mysqli_connect($servidor,$usuario,$clave, $bd);
    
    if(mysqli_connect_errno()){
        echo mysqli_connect_error();
        exit(0);
    }
    
    # Seleccion de BD
    return $conn;
}

function getSQL($sql){
    
    $conn	=	conecta_bd();
    $rs = mysqli_query($conn, $sql);   
	mysqli_close($conn);
    
    return $rs;
}

function putSQL($sql){
    $res = "";
    $conn	=	conecta_bd();
        
    $rs = mysqli_query($conn, $sql);
    
    if ($rs) {
    }else{
        echo $sql."<BR>";
    }
    mysqli_close($conn);
    
    return $res;
}

?>