<?php 
$app->get('/user', function() {
    $db = new DbHandler();
    $user = $db->getRecord("select user_id,firstname,lastname,password,email,apikey,create_date,update_date,role_name as role from user, role where role.role_id=user.role_id");
	if($user){
		$response["code"] = 1;
		$response["status"] = "success";
		$response["message"] = $user;
	} else {
		$response["code"] = 2;
		$response["status"] = "fail";
		$response["message"] = "Error getting user";
	}
	
    echoResponse(200, $response);
});

$app->post('/user', function() use ($app) {
    require_once 'passwordHash.php';
	$db = new DbHandler();
    $data = json_decode($app->request->getBody());
    $chekduplikat = $db->getOneRecord("select user_id from user where email='".$data->email."'");
    if ($chekduplikat == NULL) {
        $sql = "INSERT INTO user (firstname, lastname, email, password, create_date, role_id) VALUES ('".$data->firstname."', '".$data->lastname."', '".$data->email."', '".passwordHash::hash($data->password)."', '".date("Y-m-d")."', 1 )";
    	$insert = $db->insertRecord($sql);
        if($insert){
            $response["code"] = 1;
            $response["status"] = "success";
            $response["message"] = "User save successfully";
        } else {
            $response["code"] = 2;
            $response["status"] = "fail";
            $response["message"] = "Error save user";
        }
    } else {
        $response["code"] = 2;
        $response["status"] = "fail";
        $response["message"] = "Email already exists";
    }

    echoResponse(200, $response);
});

$app->get('/session', function() {
    $db = new DbHandler();
    $session = $db->getSession();
    $response["uid"] = $session['uid'];
    $response["email"] = $session['email'];
    $response["name"] = $session['name'];
    echoResponse(200, $session);
});

$app->post('/login_user', function() use ($app) {
    require_once 'passwordHash.php';
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'password'),$r);
    $response = array();
    $db = new DbHandler();
    $password = $r->password;
    $email = $r->email;
    $user = $db->getOneRecord("select user_id,firstname,lastname,password,email from user where email='$email'");
    if ($user != NULL) {
        if(passwordHash::check_password($user['password'],$password)){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['firstname'] = $user['firstname'];
        $response['lastname'] = $user['lastname'];
        $response['uid'] = $user['user_id'];
        $response['email'] = $user['email'];;
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = $user['user_id'];
        $_SESSION['email'] = $email;
        $_SESSION['name'] = $user['firstname'];
        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }
    }else {
            $response['status'] = "error";
            $response['message'] = 'No such user is registered';
        }
    echoResponse(200, $response);
});

$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});

$app->post('/job', function() use ($app) {
    $data = $app->request->getBody();
    $response = curl_post('http://192.168.1.231:3001/oozie/start/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c', $data);
    echoResponse(200, json_decode($response));
});

$app->post('/apikey', function() use ($app) {
    $data = $app->request->getBody();
    $response = curl_post('http://192.168.1.231:3001/apikey/create/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c', $data);
    echoResponse(200, json_decode($response));
});

$app->post('/login', function() use ($app) {
    $data = $app->request->getBody();
    $response = login_post('http://192.168.1.231:3001/user/read/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c', $data);
	/*if (!isset($_SESSION)) {
            session_start();
        }*/
    echoResponse(200, json_decode($response));
});

function curl_post($url, $data){
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => $url,
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "POST",
	  CURLOPT_POSTFIELDS => $data,
	  CURLOPT_HTTPHEADER => array(
		"cache-control: no-cache",
		"content-type: application/json",
		"postman-token: 2455eaea-31a0-5bf3-20b8-ca63094301d7"
	  ),
	));

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);
	if ($err) {
	  return "cURL Error #:" . $err;
	} else {
	  return $response;
	}
}

/*function login_post($url, $data){
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => $url,
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "POST",
	  CURLOPT_POSTFIELDS => $data,
	  CURLOPT_HTTPHEADER => array(
		"cache-control: no-cache",
		"content-type: application/json",
		"postman-token: 2455eaea-31a0-5bf3-20b8-ca63094301d7"
	  ),
	));

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);
	if ($err) {
	  return "cURL Error #:" . $err;
	} else {
	  return $response;
	}
}*/

?>