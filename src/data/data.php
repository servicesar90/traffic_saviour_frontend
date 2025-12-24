<?php
error_reporting(0);


// Cloaker API endpoint
$cloakerApiUrl = "https://app.clockerly.io/api/v2/trafficfilter/b29a9508-84e4-40bc-a058-a9cc4a583031/100001";

// Get real headers safely
function getHeadersSafe() {
    if (function_exists('getallheaders')) {
        return getallheaders();
    }
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $headers[str_replace('_', '-', substr($name, 5))] = $value;
        }
    }
    return $headers;
}

// Get visitor IP
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    return $_SERVER['REMOTE_ADDR'];
}

// Detect protocol
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";

// Collect visitor data
$visitorData = [
  "ip" => getUserIP(),
  "userAgent" => $_SERVER['HTTP_USER_AGENT'] ?? '',
  "referer" => $_SERVER['HTTP_REFERER'] ?? '',
  "acceptLanguage" => $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '',
  "url" => $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
  "timestamp" => gmdate("c"),
  "headers" => getHeadersSafe()
];


// log visitors data
echo "<pre>";
print_r($visitorData);
echo "</pre>";


// Send to API
$ch = curl_init($cloakerApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($visitorData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

// Show raw curl error or response directly on page
echo "<pre>";
echo "===== CURL DEBUG =====\n";
echo "CURL Error: " . ($curlError ?: "No error") . "\n";
echo "Raw Response:\n";
print_r($response);
echo "\n=======================\n";
echo "</pre>";

// If CURL failed → allow visitor normally
if (!$response || $curlError) {
    return;
}

$data = json_decode($response, true);

echo "<pre>";
echo "===== DECODED JSON =====\n";
print_r($data);
echo "=========================\n";
echo "</pre>";

// Cloaker rules
if ($data && isset($data['action'])) {

    // Redirect to target if safe
    // if ($data['action'] === true && !empty($data['target'])) {
    //     header("Location: " . $data['target'], true, 302);
    //     exit;
    // }

    // Block visitor
    if ($data['action'] === "block") {
        http_response_code(403);
        exit("Access Denied");
    }
}

// If action = allow → load your page normally
?>



<?php
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// integration check
function _check() { 
      if(isset($_GET['TS-BHDNR-84848'])){ 
        echo "ecb8e66a-de87-44b3-81c4-bea5e40f74c4"; 
        die(); 
      } 
    }

_check();


// Cloaker API endpoint
$cloakerApiUrl = "https://api.webservices.press/api/v2/trafficfilter/ecb8e66a-de87-44b3-81c4-bea5e40f74c4/100001";

// Get real headers safely
function getHeadersSafe() {
    if (function_exists('getallheaders')) {
        return getallheaders();
    }
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $headers[str_replace('_', '-', substr($name, 5))] = $value;
        }
    }
    return $headers;
}

// Get visitor IP
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    return $_SERVER['REMOTE_ADDR'];
}

// Detect protocol
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";

// Collect visitor data
$visitorData = [
  "ip" => getUserIP(),
  "userAgent" => $_SERVER['HTTP_USER_AGENT'] ?? '',
  "referer" => $_SERVER['HTTP_REFERER'] ?? '',
  "acceptLanguage" => $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '',
  "url" => $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
  "timestamp" => gmdate("c"),
  "headers" => getHeadersSafe()
];


// log visitors data
echo "<pre>";
print_r($visitorData);
echo "</pre>";


// Send to API
$ch = curl_init($cloakerApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($visitorData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

// Show raw curl error or response directly on page
echo "<pre>";
echo "===== CURL DEBUG =====\n";
echo "CURL Error: " . ($curlError ?: "No error") . "\n";
echo "Raw Response:\n";
print_r($response);
echo "\n=======================\n";
echo "</pre>";

// If CURL failed → allow visitor normally
if (!$response || $curlError) {
    return;
}

$data = json_decode($response, true);

echo "<pre>";
echo "===== DECODED JSON =====\n";
print_r($data);
echo "=========================\n";
echo "</pre>";

// Cloaker rules
if ($data && isset($data['action'])) {

    // Redirect to target if safe
    // if ($data['action'] === true && !empty($data['target'])) {
    //     header("Location: " . $data['target'], true, 302);
    //     exit;
    // }

    // Block visitor
    if ($data['action'] === "block") {
        http_response_code(403);
        exit("Access Denied");
    }
}

// If action = allow → load your page normally
?>



----------------------------------------------------------------------------$_COOKIE

<?php
// Disable error display (optional for production)
error_reporting(E_ALL);

// Your external cloaker API URL
$cloakerApiUrl = "https://app.clockerly.io/api/v2/trafficfilter/${camp?.cid}/${camp?.user_id }";
// 1. Get IP address
function getUserIP() {
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
  elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
  return $_SERVER['REMOTE_ADDR'];
}

// 2. Collect visitor data
$visitorData = [
  "ip" => getUserIP(),
  "userAgent" => $_SERVER['HTTP_USER_AGENT'] ?? '',
  "referer" => $_SERVER['HTTP_REFERER'] ?? '',
  "acceptLanguage" => $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '',
  "url" => "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
  "timestamp" => gmdate("c"),
  "headers" => getallheaders()
];

echo "<pre>";
print_r($visitorData);
echo "</pre>";


// 3. Send data to cloaker server
$ch = curl_init($cloakerApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($visitorData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
curl_close($ch);
echo($response);
// 4. Handle response
$data = json_decode($response, true);
// echo($data);
echo "<pre>";
print_r($data);
echo "</pre>";
// Based on cloaker decision, redirect or allow
if ($data && isset($data['action'])) {
    if ($data['action'] === true && !empty($data['target'])) {
        header("Location: " . $data['target'], true, 302);
        exit();
    } elseif ($data['action'] === 'block') {
        http_response_code(403);
        echo "Access Denied";
        exit();
    }
    // If action is 'allow', do nothing and continue loading the page
}
?>