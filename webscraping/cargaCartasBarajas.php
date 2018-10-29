<?php 
	
	include('funciones.php');
		
	$result=getSQL("SELECT idTorneo,codigoBaraja FROM barajastorneo");
	while ($fila = mysqli_fetch_assoc($result)){
		
		$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$fila['idTorneo'].'&iddeck='.$fila['codigoBaraja']);
		
		$codTorneo=$fila['idTorneo'];
		$codBaraja=$fila['codigoBaraja'];

		$html=str_replace(' style="width:100%;padding:35px;"','',$htmlPrincipal);

		preg_match('/<table class="table_deck".*?>.*?<\/[\s]*table>/s',$html,$matches);

		$listado=$matches[0];

		$listado=formateaTablaCartas($listado);

		$listado=utf8_encode($listado);
		
		$pagina=HTML2Array($listado);
		
		$pagina=sustituyeAcentos($pagina);
		
		if($pagina!=""){
			putSQL("UPDATE barajastorneo SET pagina='$pagina' WHERE idTorneo='$codTorneo' AND idBaraja='$codBaraja';");
		}
	}
	
	echo "FIN!!";
	
	function formateaTablaCartas($tabla){
		//Formateamos la cabecera de la tabla
		$formateada=str_replace('scope="side_movil" style="text-align:right;background:#434686;color:#fff;font-weight:bold"',"",$tabla);
		$formateada=str_replace("table_deck","col-lg-12 table-fixed",$formateada);
		$formateada=str_replace('<th	style="','<th class="text-left" style="border: 1px solid #ddd; ',$formateada);
		$formateada=str_replace('<th style="','<th class="text-left" style="border: 1px solid #ddd; ',$formateada);
		$formateada=str_replace('<th>','<th class="text-center" style="border: 1px solid #ddd;>',$formateada);
		$formateada=str_replace('<th class="text-center" style="border: 1px solid #ddd;" scope="hide">','',$formateada);
		$formateada=str_replace('<th scope="','<th class="text-center" style="border: 1px solid #ddd;" scope="',$formateada);
		$formateada=str_replace('id="sideboard"','id="sideboard"',$formateada);
		$formateada=str_replace('Deck Name',"Nombre Baraja",$formateada);
		$formateada=str_replace('playing',"jugando",$formateada);
		$formateada=str_replace('Position',"Posici&oacute;n",$formateada);
		$formateada=str_replace('Sideboard',"Banquillo",$formateada);
		$formateada=str_replace('15 Cards',"",$formateada);
		
		$formateada=sustituyeAcentos($formateada);
		
		return $formateada;
	}
	
	function HTML2Array($html){

		$str="<table class='col-lg-12 table-fixed'>";
		preg_match_all("/<tr.*?>(.*?)<\/[\s]*tr>/s", $html, $matches);

		$table = array();
		$numLineas=1;
		foreach($matches[1] as $row_html){
			
			if(strpos($row_html, "60 Cards")===false && strpos($row_html, "side_movil")===false){
				$valor=strpos($row_html, 'id="sideboard"');
				
				$row_html=str_replace('class="screenshot"','class="text-success"',$row_html);
				
				if($valor>0){
					$parte1=substr($row_html,0,$valor);
					$parte2=str_replace('class="text-success"','class="text-danger"',substr($row_html,$valor));	
					$row_html=$parte1.$parte2;
					$str .= "<tr>".$row_html."</tr>";
				}else{
					$str .= "<tr>".$row_html."</tr>";
				}
				$numLineas++;
			}
		}
		$str.="</table>";
		return $str;
	}

	function sustituyeAcentos($formateada){
		
		$codigo= array("&aacute;","&eacute;","&iacute;","&oacute;","&uacute;","&uuml;","&ntilde;","&Aacute;","&Eacute;","&Iacute;","&Oacute;","&Uacute;","&Uuml;","&Ntilde;","&ordm;","&acute;","&sup3;","&Atilde;","&atilde;","&Otilde;","&otilde;","\"");
		$cambiar = array("á","é","í","ó","ú","ü","ñ","Á","É","Í","Ó","Ú","Ü","Ñ","º","´","³","Ã","ã","Õ","õ","'");
		
		return str_replace($cambiar, $codigo, $formateada);
		
	}

?>

	