<?php

	session_start();

	$target_path = dirname(__DIR__).'/uploads/';

	if(isset($_GET['getname'])) {

		$file = NULL;

		if(isset($_SESSION['tmp_name'])&&isset($_SESSION['name'])&&$_SESSION['name'] == $_GET['getname']) {
			$file = $target_path . $_GET['getname'];
		}

		$size = is_file($file) ? filesize($file) : 0;

		echo $size;

	} else {

		$post_filter = array(
			'filename' => array('filter' => FILTER_SANITIZE_STRING),
			'name' => array('filter' => FILTER_SANITIZE_STRING),
			'filesize' => array('filter' => FILTER_SANITIZE_NUMBER_INT),
			'_chunkSize' => array('filter' => FILTER_SANITIZE_NUMBER_INT),
			'_currentChunkSize' => array('filter' => FILTER_SANITIZE_NUMBER_INT),
			'_chunkNumber' => array('filter' => FILTER_SANITIZE_NUMBER_INT),
			'_totalSize' => array('filter' => FILTER_SANITIZE_NUMBER_INT)
		);
		$post = filter_var_array($_POST, $post_filter);

		$tmp_name = $_FILES['file']['tmp_name'];
		$name = $_FILES['file']['name'];
		$name2 = $post['filename'].".".pathinfo($name,PATHINFO_EXTENSION);
		$size = $_FILES['file']['size'];
		
		$_SESSION['tmp_name'] = $tmp_name;
		$_SESSION['name'] = $name;

		$target_file = $target_path.$name;

		$complete =$target_path.$name2;
		
		if(!isset( $post['_chunkSize']) && isset( $post['filesize'])) {
			 $post['_chunkSize'] = $post['filesize'];
		}

		$com = fopen($complete, "ab");
		$in = fopen($tmp_name, "rb");
		if ( $in ) {
			while ( $buff = fread( $in, $post['_chunkSize'] ) ) {
				fwrite($com, $buff);
			}   
		}
		fclose($in);

		fclose($com);
		
	}
?>