<?php

if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'hdfs' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ]; // bisa
    // $uploadPath = "/var/www/html/tes/". $_FILES[ 'file' ][ 'name' ]; // tidak bisa
    // $uploadPath = "http://192.168.1.60/tes/". $_FILES[ 'file' ][ 'name' ]; // tidak bisa
    
    /*echo('$tempPath = '.$tempPath.'<br>');
    echo('$uploadPath = '.$uploadPath.'<br>');
    echo('size  = '.$_FILES[ 'file' ][ 'size' ].'<br>');*/
    
    move_uploaded_file( $tempPath, $uploadPath );

    $answer = array( 'answer' => 'File transfer completed' );
    $json = json_encode( $answer );

    echo $json;

} else {

    echo 'No files';

}

?>