<?php 
	
	include('funciones.php');
	
	//Blob de barajas	
	/*
	$result=getSQL("SELECT * FROM barajastorneo where id=2");
	
	while ($fila = mysqli_fetch_assoc($result)){
		$info  = base64_decode(base64_encode($fila['pagina'])); 
		
		echo $info; 
	}*/
	
	//Blob cartas de barajas
	
	$result=getSQL("SELECT * FROM cartasbaraja where id=1");
	
	while ($fila = mysqli_fetch_assoc($result)){
		$info  = base64_decode(base64_encode($fila['pagina'])); 
		
		echo $info; 
	}

?>

	