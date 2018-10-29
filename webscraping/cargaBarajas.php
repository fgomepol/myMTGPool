<?php 
	
	include('funciones.php');
			
	$result=getSQL("select codTorneo, formato from torneos WHERE torneos.codTorneo NOT IN (SELECT DISTINCT(idTorneo) as idTorneo FROM barajastorneo) order by torneos.id");
	while ($fila = mysqli_fetch_assoc($result)){
		
		$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$fila['codTorneo']);
		
		$codTorneo=$fila['codTorneo'];
		$formato=$fila['formato'];
		
		preg_match('/<table class="tourney_list".*?>.*?<\/[\s]*table>/s',$htmlPrincipal,$matches1);
		
		preg_match_all("/<tr.*?>(.*?)<\/[\s]*tr>/s", $matches1[0], $matches2);

		$table = array();
		$numLineas=1;
		foreach($matches2[1] as $row_Original){
			$arquetipo="";
			$jugador="";
			$posicion="";
			$codigoBaraja="";
			
			// AQUI OBTENEMOS LOS DATOS BÁSICOS A INTRIDUCIR PARA LA BARAJA EN LA BBDD
			preg_match_all('/<td data-th="Archetype".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches2);
			
			foreach($matches2[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesArquetipo);
				
				$posicionInicial=strpos($matchesArquetipo[0], 'ck=')+3;
				$posicionFinal=strpos($matchesArquetipo[0], '">')-$posicionInicial;
				
				$codigoBaraja=substr($matchesArquetipo[0], $posicionInicial, $posicionFinal);
				$arquetipo=sustituyeAcentos($matchesArquetipo[1]);
			}
			
			preg_match_all('/<td data-th="Player".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches3);
			
			foreach($matches3[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesJugadores);
						
				$jugador=sustituyeAcentos($matchesJugadores[1]);
			}
			
			preg_match_all('/<td data-th="Position".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches4);
			
			foreach($matches4[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesFecha);
				
				$posicion=intval($matchesFecha[1]);
			}
			
			// AQUI FORMATEAMOS LA PAGINA QUE VAMOS A GUARDAR EN LA BBDD
			
			preg_match('/<h3.*?>.*?<\/[\s]*h3>/s',$htmlPrincipal,$matches1);

			$nombreTorneo=str_replace("h3","h5", $matches1[0]);

			preg_match('/<h5.*?>.*?<\/[\s]*h5>/s',$htmlPrincipal,$matches2);

			$datosTorneo=str_replace("h5","h6", $matches2[0]);
			$datosTorneo=str_replace("Format","Formato", $datosTorneo);
			$datosTorneo=str_replace("Number of Players","Número de jugadores", $datosTorneo);
			$datosTorneo=str_replace("Date","Fecha", $datosTorneo);


			preg_match_all('/<table[^>](?:class="tourney_list")[^>]*>(.*)<\/table>/is',$htmlPrincipal,$matches3);

			$listado=$matches3[0][0];

			$listado='<div class="text-left text-info" style="font-weight:bold"><p>'.$nombreTorneo.'</p><p>'.$datosTorneo.'</p></div>'.$listado;

			$listado=formateaTablaBarajas($listado,$formato);

			$pagina=utf8_encode($listado);
			
			if($jugador!=""){
				putSQL("INSERT INTO barajastorneo (idTorneo,arquetipo,jugador,formato,posicion,pagina,codigoBaraja) VALUES ('$codTorneo','$arquetipo','$jugador','$formato','$posicion','$pagina','$codigoBaraja');");
				
				
					
				$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$codTorneo.'&iddeck='.$codigoBaraja);
				
				$html=str_replace(' style="width:100%;padding:35px;"','',$htmlPrincipal);

				preg_match('/<table class="table_deck".*?>.*?<\/[\s]*table>/s',$html,$matches);

				$listado=$matches[0];

				$listado=formateaTablaCartas($listado);

				$listado=utf8_encode($listado);
				
				$pagina=HTML2Array($listado);
				
				$pagina=sustituyeAcentos($pagina);
				
				if($pagina!=""){
					putSQL("UPDATE barajastorneo SET pagina='$pagina' WHERE idTorneo='$codTorneo' AND idBaraja='$codigoBaraja';");
				}
			}
		}
	}
	
	echo "FIN!!";
	
	function formateaTablaBarajas($tabla, $formato){
		//Formateamos la cabecera de la tabla
		$formateada=str_replace("<h3>","",$tabla);
		$formateada=str_replace("</h3>","",$formateada);
		$formateada=str_replace('<th>','<th class="text-center" style="border: 1px solid #ddd;" >',$formateada);
		$formateada=str_replace("tourney_list","col-lg-12 table-fixed",$formateada);
		$formateada=str_replace("Archetype","Baraja",$formateada);
		$formateada=str_replace("Player","Jugador",$formateada);
		$formateada=str_replace("Position","Posici&oacute;n",$formateada);
		
		//Formateamos el resto de la tabla
		
		$formateada=str_replace('align="left"',"",$formateada);
		$formateada=str_replace('data-th="Posici&oacute;n"','data-th="Posici&oacute;n" class="text-center align-middle small"',$formateada);
		$formateada=str_replace('data-th="Jugador"','data-th="Jugador" class="text-center align-middle small"',$formateada);
		$formateada=str_replace("principal","text-center align-middle small",$formateada);
		
		$formateada=str_replace('">','">',$formateada);
		$formateada=str_replace('href="deck.php?id=',' href="cartasBaraja/'.$formato.'/',$formateada);
		$formateada=str_replace('&iddeck=','/',$formateada);
		
		$formateada=str_replace('<a ','<h6><a ',$formateada);
		$formateada=str_replace('</a>','</a></h6>',$formateada);
		
		$formateada=sustituyeAcentos($formateada);
		
		return $formateada;
	}	
	
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

	