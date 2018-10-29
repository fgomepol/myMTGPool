<?php 
	include('funciones.php');
	/*
		Modern 95 paginas
		
		if($i==1){
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Modern');
		}else{
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Modern&page='.$i);
		}
		
	*/
	
	/*
		Vintage 26 paginas
		
		if($i==1){
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Vintage');
		}else{
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Vintage&page='.$i);
		}
	*/
	
	/*
		Legacy 74 paginas
	
		if($i==1){
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Legacy');
		}else{
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Legacy&page='.$i);
		}
	*/
	//Standard (aqui tengo que ver como lo voy a hacer)
	
	//Aqui procesamos los torneos de Modern 95 paginas
	
	for($i=1; $i<=95; $i++){
		if($i==1){
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Modern');
		}else{
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Modern&page='.$i);
		}
		
		preg_match('/<table class="tourney_list".*?>.*?<\/[\s]*table>/s',$htmlPrincipal,$matches1);

		preg_match_all("/<tr.*?>(.*?)<\/[\s]*tr>/s", $matches1[0], $matches2);

		$table = array();
		$numLineas=1;
		foreach($matches2[1] as $row_Original){
			$nombreTorneo="";
			$jugadoresTorneo="";
			$fechaTorneo="";
			
			preg_match_all('/<td data-th="Tournament Name".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches2);
			
			foreach($matches2[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesNombre);
				
				$posicionInicial=strpos($matchesNombre[0], 'id=')+3;
				$posicionFinal=strpos($matchesNombre[0], '">')-$posicionInicial;
				
				$codigoTorneo=substr($matchesNombre[0], $posicionInicial, $posicionFinal);
						
				$nombreTorneo=sustituyeAcentos($matchesNombre[1]);
			}
			
			preg_match_all('/<td data-th="Players".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches3);
			
			foreach($matches3[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesJugadores);
						
				$jugadoresTorneo=$matchesJugadores[1];
			}
			
			preg_match_all('/<td data-th="Date".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches4);
			
			foreach($matches4[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesFecha);
				
				$fechaTorneo=strtotime(str_replace("/","-",$matchesFecha[1]." 00:00:00"));
			}
			
			if($nombreTorneo!=""){
				putSQL("INSERT INTO torneos (formato,nombre,jugadores,fecha,codTorneo) VALUES ('Modern','$nombreTorneo','$jugadoresTorneo','$fechaTorneo','$codigoTorneo');");
				
				$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$codigoTorneo);
		
				$codTorneo=$codigoTorneo;
				$formato='Modern';
				
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
					
					if($jugador!=""){
						putSQL("INSERT INTO barajastorneo (idTorneo,arquetipo,jugador,formato,posicion,codigoBaraja) VALUES ('$codTorneo','$arquetipo','$jugador','$formato','$posicion','$codigoBaraja');");
													
						$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$codTorneo.'&iddeck='.$codigoBaraja);
						
						$html=str_replace(' style="width:100%;padding:35px;"','',$htmlPrincipal);

						preg_match('/<table class="table_deck".*?>.*?<\/[\s]*table>/s',$html,$matches);

						$listado=$matches[0];

						$listado=formateaTablaCartas($listado);

						$listado=utf8_encode($listado);
						
						$pagina=HTML2Array($listado);
						
						$pagina=sustituyeAcentos($pagina);
						
						preg_match_all("/<tr.*?>(.*?)<\/[\s]*tr>/s", $pagina, $matches);

						$table = array();
						$numLineas=1;
						$i=0;
						foreach($matches[1] as $row_html){
							
							preg_match_all('/<td .*?>(.*?)<\/[\s]*td>/s', $row_html, $matches2);
							
							$strCambiar="";
							$strCambiado="";
								
							foreach($matches2[1] as $row_html2){
								
								preg_match_all('/\d <a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matches3);
								
								$j=0;
								foreach ($matches3[1] as $array2){
									
									$nombreAux=str_replace("\r","",str_replace("\n","",$array2));
									
									if(!ctype_alpha (substr($nombreAux,-1))){
										$nombreAux=substr($nombreAux,0,-1);
									}
									
									$arrayCartas[$i]['carta']=addslashes($nombreAux);
									
									$selectCarta=getSQL('select productId from cards WHERE name="'.str_replace('\"',"'",$arrayCartas[$i]['carta']).'" AND UID!=0;');
									$datosCarta = mysqli_fetch_assoc($selectCarta);
									
									$valorCarta=substr($matches3[0][$j],0,2);	
									$arrayCartas[$i]['numero']=intval($valorCarta);
									$arrayCartas[$i]['idCarta']=intval($datosCarta['productId']);
									$j++;
									$i++;
								}
							}
						}
						
						$cartas=json_encode($arrayCartas);
						unset($arrayCartas);
						
						if($pagina!=""){
							putSQL("UPDATE barajastorneo SET pagina='$pagina',cartasBaraja='$cartas' WHERE idTorneo='$codTorneo' AND codigoBaraja='$codigoBaraja';");
						}
					}
				}
			}
		}
	}

	//Aqui procesamos los torneos de Legacy 74 paginas
	
	for($i=1; $i<=74; $i++){
		if($i==1){
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Legacy');
		}else{
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Legacy&page='.$i);
		}
		
		preg_match('/<table class="tourney_list".*?>.*?<\/[\s]*table>/s',$htmlPrincipal,$matches1);

		preg_match_all("/<tr.*?>(.*?)<\/[\s]*tr>/s", $matches1[0], $matches2);

		$table = array();
		$numLineas=1;
		foreach($matches2[1] as $row_Original){
			$nombreTorneo="";
			$jugadoresTorneo="";
			$fechaTorneo="";
			
			preg_match_all('/<td data-th="Tournament Name".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches2);
			
			foreach($matches2[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesNombre);
				
				$posicionInicial=strpos($matchesNombre[0], 'id=')+3;
				$posicionFinal=strpos($matchesNombre[0], '">')-$posicionInicial;
				
				$codigoTorneo=substr($matchesNombre[0], $posicionInicial, $posicionFinal);
						
				$nombreTorneo=sustituyeAcentos($matchesNombre[1]);
			}
			
			preg_match_all('/<td data-th="Players".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches3);
			
			foreach($matches3[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesJugadores);
						
				$jugadoresTorneo=$matchesJugadores[1];
			}
			
			preg_match_all('/<td data-th="Date".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches4);
			
			foreach($matches4[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesFecha);
				
				$fechaTorneo=strtotime(str_replace("/","-",$matchesFecha[1]." 00:00:00"));
			}
			
			if($nombreTorneo!=""){
				putSQL("INSERT INTO torneos (formato,nombre,jugadores,fecha,codTorneo) VALUES ('Legacy','$nombreTorneo','$jugadoresTorneo','$fechaTorneo','$codigoTorneo');");
				
				$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$codigoTorneo);
		
				$codTorneo=$codigoTorneo;
				$formato='Legacy';
				
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
					
					if($jugador!=""){
						putSQL("INSERT INTO barajastorneo (idTorneo,arquetipo,jugador,formato,posicion,codigoBaraja) VALUES ('$codTorneo','$arquetipo','$jugador','$formato','$posicion','$codigoBaraja');");
						
						
							
						$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$codTorneo.'&iddeck='.$codigoBaraja);
						
						$html=str_replace(' style="width:100%;padding:35px;"','',$htmlPrincipal);

						preg_match('/<table class="table_deck".*?>.*?<\/[\s]*table>/s',$html,$matches);

						$listado=$matches[0];

						$listado=formateaTablaCartas($listado);

						$listado=utf8_encode($listado);
						
						$pagina=HTML2Array($listado);
						
						$pagina=sustituyeAcentos($pagina);
						
						preg_match_all("/<tr.*?>(.*?)<\/[\s]*tr>/s", $pagina, $matches);

						$table = array();
						$numLineas=1;
						$i=0;
						foreach($matches[1] as $row_html){
							
							preg_match_all('/<td .*?>(.*?)<\/[\s]*td>/s', $row_html, $matches2);
							
							$strCambiar="";
							$strCambiado="";
								
							foreach($matches2[1] as $row_html2){
								
								preg_match_all('/\d <a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matches3);
								
								$j=0;
								foreach ($matches3[1] as $array2){
									
									$nombreAux=str_replace("\r","",str_replace("\n","",$array2));
									
									if(!ctype_alpha (substr($nombreAux,-1))){
										$nombreAux=substr($nombreAux,0,-1);
									}
									
									$arrayCartas[$i]['carta']=addslashes($nombreAux);
									
									$selectCarta=getSQL('select productId from cards WHERE name="'.str_replace('\"',"'",$arrayCartas[$i]['carta']).'" AND UID!=0;');
									$datosCarta = mysqli_fetch_assoc($selectCarta);
									
									$valorCarta=substr($matches3[0][$j],0,2);	
									$arrayCartas[$i]['numero']=intval($valorCarta);
									$arrayCartas[$i]['idCarta']=intval($datosCarta['productId']);
									$j++;
									$i++;
								}
							}
						}
						
						$cartas=json_encode($arrayCartas);
						unset($arrayCartas);
						
						if($pagina!=""){
							putSQL("UPDATE barajastorneo SET pagina='$pagina',cartasBaraja='$cartas' WHERE idTorneo='$codTorneo' AND codigoBaraja='$codigoBaraja';");
						}
					}
				}
			}
		}
	}
	
	//Aqui procesamos los torneos de Vintage 26 paginas
	
	for($i=1; $i<=26; $i++){
		if($i==1){
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Vintage');
		}else{
			$htmlPrincipal = file_get_contents('http://tcdecks.net/format.php?format=Vintage&page='.$i);
		}
		
		preg_match('/<table class="tourney_list".*?>.*?<\/[\s]*table>/s',$htmlPrincipal,$matches1);

		preg_match_all("/<tr.*?>(.*?)<\/[\s]*tr>/s", $matches1[0], $matches2);

		$table = array();
		$numLineas=1;
		foreach($matches2[1] as $row_Original){
			$nombreTorneo="";
			$jugadoresTorneo="";
			$fechaTorneo="";
			
			preg_match_all('/<td data-th="Tournament Name".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches2);
			
			foreach($matches2[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesNombre);
				
				$posicionInicial=strpos($matchesNombre[0], 'id=')+3;
				$posicionFinal=strpos($matchesNombre[0], '">')-$posicionInicial;
				
				$codigoTorneo=substr($matchesNombre[0], $posicionInicial, $posicionFinal);
						
				$nombreTorneo=sustituyeAcentos($matchesNombre[1]);
			}
			
			preg_match_all('/<td data-th="Players".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches3);
			
			foreach($matches3[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesJugadores);
						
				$jugadoresTorneo=$matchesJugadores[1];
			}
			
			preg_match_all('/<td data-th="Date".*?>(.*?)<\/[\s]*td>/s', $row_Original, $matches4);
			
			foreach($matches4[0] as $row_html2){
				
				preg_match('/<a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matchesFecha);
				
				$fechaTorneo=strtotime(str_replace("/","-",$matchesFecha[1]." 00:00:00"));
			}
			
			if($nombreTorneo!=""){
				putSQL("INSERT INTO torneos (formato,nombre,jugadores,fecha,codTorneo) VALUES ('Vintage','$nombreTorneo','$jugadoresTorneo','$fechaTorneo','$codigoTorneo');");
				
				$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$codigoTorneo);
		
				$codTorneo=$codigoTorneo;
				$formato='Vintage';
				
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
					
					if($jugador!=""){
						putSQL("INSERT INTO barajastorneo (idTorneo,arquetipo,jugador,formato,posicion,codigoBaraja) VALUES ('$codTorneo','$arquetipo','$jugador','$formato','$posicion','$codigoBaraja');");
						
						
							
						$htmlPrincipal = file_get_contents('http://tcdecks.net/deck.php?id='.$codTorneo.'&iddeck='.$codigoBaraja);
						
						$html=str_replace(' style="width:100%;padding:35px;"','',$htmlPrincipal);

						preg_match('/<table class="table_deck".*?>.*?<\/[\s]*table>/s',$html,$matches);

						$listado=$matches[0];

						$listado=formateaTablaCartas($listado);

						$listado=utf8_encode($listado);
						
						$pagina=HTML2Array($listado);
						
						$pagina=sustituyeAcentos($pagina);
						
						preg_match_all("/<tr.*?>(.*?)<\/[\s]*tr>/s", $pagina, $matches);

						$table = array();
						$numLineas=1;
						$i=0;
						foreach($matches[1] as $row_html){
							
							preg_match_all('/<td .*?>(.*?)<\/[\s]*td>/s', $row_html, $matches2);
							
							$strCambiar="";
							$strCambiado="";
								
							foreach($matches2[1] as $row_html2){
								
								preg_match_all('/\d <a .*?>(.*?)<\/[\s]*a>/s', $row_html2, $matches3);
								
								$j=0;
								foreach ($matches3[1] as $array2){
									
									$nombreAux=str_replace("\r","",str_replace("\n","",$array2));
									
									if(!ctype_alpha (substr($nombreAux,-1))){
										$nombreAux=substr($nombreAux,0,-1);
									}
									
									$arrayCartas[$i]['carta']=addslashes($nombreAux);
									
									$selectCarta=getSQL('select productId from cards WHERE name="'.str_replace('\"',"'",$arrayCartas[$i]['carta']).'" AND UID!=0;');
									$datosCarta = mysqli_fetch_assoc($selectCarta);
									
									$valorCarta=substr($matches3[0][$j],0,2);	
									$arrayCartas[$i]['numero']=intval($valorCarta);
									$arrayCartas[$i]['idCarta']=intval($datosCarta['productId']);
									$j++;
									$i++;
								}
							}
						}
						
						$cartas=json_encode($arrayCartas);
						unset($arrayCartas);
						
						if($pagina!=""){
							putSQL("UPDATE barajastorneo SET pagina='$pagina',cartasBaraja='$cartas' WHERE idTorneo='$codTorneo' AND codigoBaraja='$codigoBaraja';");
						}
					}
				}
			}
		}
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

	