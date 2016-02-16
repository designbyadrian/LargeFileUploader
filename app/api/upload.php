<?php

	session_start();

	$target_path = dirname(__DIR__).'/uploads/';

	if(isset($_GET['filename'])) {

		$get_filter = array(
			'name' => array('filter' => FILTER_SANITIZE_STRING),
			'filename' => array('filter' => FILTER_SANITIZE_STRING)
		);
		$get = filter_var_array($_GET, $get_filter);

		$file = NULL;

		if(isset($_SESSION['tmp_name'])&&isset($_SESSION['filename'])&&$_SESSION['filename'] == $get['filename']) {
			$file = $target_path . $get['name'] . "/" . $get['filename'];
		}

		$size = is_file($file) ? filesize($file) : 0;

		echo $size;

	} else {

		$post_filter = array(
			'name' => array('filter' => FILTER_SANITIZE_STRING),
			'safename' => array('filter' => FILTER_SANITIZE_STRING),
			'_filename' => array('filter' => FILTER_SANITIZE_STRING),
			'_filesize' => array('filter' => FILTER_SANITIZE_NUMBER_INT),
			'_chunkSize' => array('filter' => FILTER_SANITIZE_NUMBER_INT),
			'_currentChunkSize' => array('filter' => FILTER_SANITIZE_NUMBER_INT),
			'_chunkNumber' => array('filter' => FILTER_SANITIZE_NUMBER_INT),
			'_totalSize' => array('filter' => FILTER_SANITIZE_NUMBER_INT)
		);
		$post = filter_var_array($_POST, $post_filter);

		$tmp_name = $_FILES['file']['tmp_name'];
		$name = $_FILES['file']['name'];
		$name2 = $post['_filename'].".".pathinfo($name,PATHINFO_EXTENSION);
		$size = $_FILES['file']['size'];
		
		$_SESSION['tmp_name'] = $tmp_name;
		$_SESSION['filename'] = $name;

		$target_path.=$post['safename'];

		if (!file_exists($target_path)) {
			mkdir($target_path, 0777, true);
		}

		$complete =$target_path."/".$name2;

		if(!isset( $post['_chunkSize']) && isset( $post['_filesize'])) {
			 $post['_chunkSize'] = $post['_filesize'];
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