import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ZipGeneratorButton from "../utils/zipgenerator";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { apiFunction } from "../api/ApiFunction";
import { createCampaignApi, javascriptIntegrationCheckApi } from "../api/Apis";
import IntegrationTable from "../components/IntegrationPage/IntegrationTable";
import axios from "axios";
import { phpZipCode, wordpressPluginCode } from "../data/cloakingData";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

// Assuming the Tab component is defined or imported here

const CloakingIntegration = () => {
  // State for the URL input
  const [pastedUrl, setPastedUrl] = useState("");
  const [tab, setTab] = useState("php-paste");
  const location = useLocation();
  const camp = location?.state?.data;
  const navigate = useNavigate();
  const [showIntegrationTable, setShowIntegrationTable] = useState(
    !camp?.integration
  );

  const tabs = [
    {
      id: "php-upload",
      label: "PHP Upload",
      svg: (
        <svg
          class="svg-inline--fa fa-php me-2"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="php"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          data-fa-i2svg=""
        >
          <path
            fill="currentColor"
            d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"
          ></path>
        </svg>
      ),
    },
    {
      id: "php-paste",
      label: "PHP Paste",
      svg: (
        <svg
          class="svg-inline--fa fa-php me-2"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="php"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          data-fa-i2svg=""
        >
          <path
            fill="currentColor"
            d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"
          ></path>
        </svg>
      ),
    },
    {
      id: "wordpress",
      label: "Wordpress Plugin",
      svg: (
        <svg
          class="svg-inline--fa fa-wordpress me-2"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="wordpress"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          data-fa-i2svg=""
        >
          <path
            fill="currentColor"
            d="M61.7 169.4l101.5 278C92.2 413 43.3 340.2 43.3 256c0-30.9 6.6-60.1 18.4-86.6zm337.9 75.9c0-26.3-9.4-44.5-17.5-58.7-10.8-17.5-20.9-32.4-20.9-49.9 0-19.6 14.8-37.8 35.7-37.8 .9 0 1.8 .1 2.8 .2-37.9-34.7-88.3-55.9-143.7-55.9-74.3 0-139.7 38.1-177.8 95.9 5 .2 9.7 .3 13.7 .3 22.2 0 56.7-2.7 56.7-2.7 11.5-.7 12.8 16.2 1.4 17.5 0 0-11.5 1.3-24.3 2l77.5 230.4L249.8 247l-33.1-90.8c-11.5-.7-22.3-2-22.3-2-11.5-.7-10.1-18.2 1.3-17.5 0 0 35.1 2.7 56 2.7 22.2 0 56.7-2.7 56.7-2.7 11.5-.7 12.8 16.2 1.4 17.5 0 0-11.5 1.3-24.3 2l76.9 228.7 21.2-70.9c9-29.4 16-50.5 16-68.7zm-139.9 29.3l-63.8 185.5c19.1 5.6 39.2 8.7 60.1 8.7 24.8 0 48.5-4.3 70.6-12.1-.6-.9-1.1-1.9-1.5-2.9l-65.4-179.2zm183-120.7c.9 6.8 1.4 14 1.4 21.9 0 21.6-4 45.8-16.2 76.2l-65 187.9C426.2 403 468.7 334.5 468.7 256c0-37-9.4-71.8-26-102.1zM504 256c0 136.8-111.3 248-248 248C119.2 504 8 392.7 8 256 8 119.2 119.2 8 256 8c136.7 0 248 111.2 248 248zm-11.4 0c0-130.5-106.2-236.6-236.6-236.6C125.5 19.4 19.4 125.5 19.4 256S125.6 492.6 256 492.6c130.5 0 236.6-106.1 236.6-236.6z"
          ></path>
        </svg>
      ),
    },
    {
      id: "javascript",
      label: "Javascript CDN",
      svg: (
        <svg
          class="svg-inline--fa fa-code me-2"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="code"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          data-fa-i2svg=""
        >
          <path
            fill="currentColor"
            d="M414.8 40.79L286.8 488.8C281.9 505.8 264.2 515.6 247.2 510.8C230.2 505.9 220.4 488.2 225.2 471.2L353.2 23.21C358.1 6.216 375.8-3.624 392.8 1.232C409.8 6.087 419.6 23.8 414.8 40.79H414.8zM518.6 121.4L630.6 233.4C643.1 245.9 643.1 266.1 630.6 278.6L518.6 390.6C506.1 403.1 485.9 403.1 473.4 390.6C460.9 378.1 460.9 357.9 473.4 345.4L562.7 256L473.4 166.6C460.9 154.1 460.9 133.9 473.4 121.4C485.9 108.9 506.1 108.9 518.6 121.4V121.4zM166.6 166.6L77.25 256L166.6 345.4C179.1 357.9 179.1 378.1 166.6 390.6C154.1 403.1 133.9 403.1 121.4 390.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4L121.4 121.4C133.9 108.9 154.1 108.9 166.6 121.4C179.1 133.9 179.1 154.1 166.6 166.6V166.6z"
          ></path>
        </svg>
      ),
    },
  ];

  useEffect(() => {}, [tab]);

  const phpCode = `
<?php
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

$cloakerApiUrl = "${import.meta.env.VITE_SERVER_URL}/api/v2/trafficfilter/${
    camp?.cid
  }/${camp?.user_id}";

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
// echo "<pre>";
// print_r($visitorData);
// echo "</pre>";


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
        header("Location: " . $data['target'], true, 302);
        exit;
        // http_response_code(403);
        // exit("Access Denied");
    }

     if ($data['action'] === "not") {
        exit;
        // http_response_code(403);
        // exit("Access Denied");
    }
}

// If action = allow → load your page normally
?>`;

  const renderSection = (camp) => {
    switch (tab) {
      case "php-upload":
        return (
          <Phpupload
            camp={camp}
            phpCode={phpCode}
            pastedUrl={pastedUrl}
            setPastedUrl={setPastedUrl}
            setShowIntegrationTable={setShowIntegrationTable}
          />
        );
      case "php-paste":
        return (
          <PhpPaste
            camp={camp}
            phpCode={phpCode}
            pastedUrl={pastedUrl}
            setPastedUrl={setPastedUrl}
            setShowIntegrationTable={setShowIntegrationTable}
          />
        );
      case "wordpress":
        return (
          <Wordpress
            camp={camp}
            phpCode={phpCode}
            pastedUrl={pastedUrl}
            setPastedUrl={setPastedUrl}
            setShowIntegrationTable={setShowIntegrationTable}
          />
        );
      case "javascript":
        return (
          <Javascript
            camp={camp}
            pastedUrl={pastedUrl}
            setPastedUrl={setPastedUrl}
            setShowIntegrationTable={setShowIntegrationTable}
          />
        );
      default:
        return (
          <PhpPaste
            camp={camp}
            phpCode={phpCode}
            pastedUrl={pastedUrl}
            setPastedUrl={setPastedUrl}
            setShowIntegrationTable={setShowIntegrationTable}
          />
        );
    }
  };
  console.log(showIntegrationTable);

  return (
    // Outer padding and dark background for the main content area
    showIntegrationTable ? (
      <div className="p-4 md:p-8 bg-gray-900 min-h-full">
        {/* Max width container for clean layout */}
        <div className="max-w-7xl mx-auto">
          {/* === 1. Component Header (Unchanged) === */}
          <header className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <h1 className="text-2xl font-semibold text-white">
                  Cloaking Intergration
                </h1>
                <p className="text-sm text-green-500 pl-2">[ID:{camp?.cid}]</p>
              </div>
              <p className="text-sm text-left text-gray-500 mt-1">
                Create/Edit/Delete Campaigns
              </p>
            </div>
            <button
              onClick={() => {
               
                
                navigate("/Dashboard/create-campaign", {
                  state: {
                    mode: "edit",
                        id:camp.uid,
                    data: camp, // campaign data from db
                  },
                });
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-150 cursor-pointer"
            >
              Edit Campaign
            </button>
          </header>

          {/* --- Separator Line (Optional, for visual clarity) --- */}
          <hr className="border-gray-700 mb-8" />

          {/* === 2. Integration Method Tabs (Unchanged) === */}
          <div className="flex space-x-2 p-1 bg-gray-800 rounded-xl mb-6">
            {tabs?.map((t) => {
              return <Tab t={t} tab={tab} setTab={(id) => setTab(id)} />;
            })}
          </div>

          <div>{renderSection(camp)}</div>

          {/* --- Separator Line (Optional, for visual clarity) --- */}
        </div>
      </div>
    ) : (
      <div className="bg-gray-900 min-h-full">
        <IntegrationTable camp={camp} setShowIntegrationTable={setShowIntegrationTable}/>
      </div>
    )
  );
};

// Simplified Tab Component
const Tab = ({ t, tab, setTab }) => (
  <button
    className={`
          flex-1 text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center transition duration-200 cursor-pointer
          ${
            tab === t.id
              ? "bg-blue-600 text-white shadow-md" // Adjusted active color for better consistency
              : "text-gray-400 hover:bg-gray-700/50"
          }
        `}
    onClick={() => {
      setTab(t.id);
    }}
  >
    {t.svg}
    {t.label}
  </button>
);

// Functionality placeholder for copying and testing
const handleCopy = (text) => {
  const formatted =
    typeof data === "object"
      ? JSON.stringify(text, null, 2) // pretty JSON
      : String(text);
  navigator.clipboard
    .writeText(formatted)
    .then(() => {
      showSuccessToast("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};

const generateZip = async () => {
  const zip = new JSZip();
  // ADD FILES TO ZIP
  const folder = zip.folder("SecurityShield");

  folder.file("index.php", wordpressPluginCode);

  const zipBlob = await zip.generateAsync({ type: "blob" });

  saveAs(zipBlob, "SecurityShield.zip");
};

const generatePhpZip = async (phpCode) => {
  const zip = new JSZip();
  zip.file("index.php", `${phpCode} \n ${phpZipCode}`);

  const zipBlob = await zip.generateAsync({ type: "blob" });

  saveAs(zipBlob, "index.zip");
};

const javascriptIntegration = async (camp, url,setShowIntegrationTable) => {
 
  const data = {
    url: url, // client site URL
    campId: camp?.cid, // expected camp id
  };
  const res = await apiFunction(
    "post",
    javascriptIntegrationCheckApi,
    null,
    data
  );
 
  


  if (res.data.success) {
    const data = {
      integration: true,
      integrationUrl: url,
      integrationType: "javascript",
    };
    const integrate = await apiFunction(
      "patch",
      createCampaignApi,
      camp?.uid,
      data
    );
    showSuccessToast("✅ Integration Successful");
    setShowIntegrationTable(false);
  } else {
    showErrorToast("❌ Integration Failed");
  }
};

async function checkIntegration(camp, url, setShowIntegrationTable) {
  const URL = url.trim().replace(/\/+$/, "");
  const res = await fetch(`${URL}/?TS-BHDNR-84848=1`);

  const text = await res.text();


  let status = "failed";
  if (text.trim() != camp?.cid) {
    status = "false";
    showErrorToast("Integration Error try again " + status);

    return;
  }
  if (text.trim() === camp?.cid) {
    status = "success";
  }
  const data = {
    integration: true,
    integrationUrl: url,
    integrationType: "php",
  };
  const integrate = await apiFunction(
    "patch",
    createCampaignApi,
    camp?.uid,
    data
  );
  if (integrate.status === 200) {
    showSuccessToast("Integration Status: " + status);
      setShowIntegrationTable(false);
    return;
  }
  setShowIntegrationTable(true);
  showErrorToast("Integration fail Error try again" + status);
}

const Phpupload = ({ camp, phpCode, pastedUrl, setPastedUrl,setShowIntegrationTable }) => (
  <div>
    <div className="flex items-start p-4 bg-blue-900/40 border border-blue-800 rounded-lg mb-6">
      <p className="text-blue-200 text-sm">
        <span className="font-semibold">Important:{setShowIntegrationTable}</span> Use the PHP upload
        method when your safe page, money page, and cloaked URL are all distinct
        and separate.
      </p>
    </div>

    {/* === 4. Code Snippet Instructions & Block === */}
    <div className="mb-4">
      <p className="text-sm text-gray-400 mb-2">
        Download the archive file, extract and upload the whole folder to any
        domain, except the money page domain. You’ll submit the URL of this
        folder to the ad network:
      </p>
    </div>

    {/* === 5. Copy to Clipboard Button (Placed right after the code block) === */}
    <button
      onClick={() => {
        generatePhpZip(phpCode);
      }}
      className="flex items-center cursor-pointer justify-center px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg mb-8"
    >
      <svg
        class="svg-inline--fa fa-angle-down me-2"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="angle-down"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        data-fa-i2svg=""
      >
        <path
          fill="currentColor"
          d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"
        ></path>
      </svg>
      Download PHP Script
    </button>

    <hr className="border-gray-700 mb-8" />

    {/* === 6. URL Input and Test Section (New Section) === */}
    <div className="w-full">
      {/* Input Label */}
      <label
        htmlFor="pastedUrl"
        className="block text-base text-left font-medium text-white mb-2"
      >
        Enter the URL of the pasted PHP file:
      </label>
         {!pastedUrl && (
  <p className="text-sm text-red-400 mb-2 text-left">
    Please enter a valid URL to enable testing
  </p>
)}

      {/* URL Input Field */}
      <input
        id="pastedUrl"
        type="url"
        value={pastedUrl}
        onChange={(e) => setPastedUrl(e.target.value)}
        placeholder="Please put URL of your pasted script here, for example https://domain.com/scriptname.php"
        className="w-full px-4 py-3 mb-6 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />

   

      {/* Redirection Guidance */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-left text-white mb-1">
          Redirecting from the root domain
        </h3>
        <p className="text-sm text-gray-400">
          If you want to redirect from the root domain, for example,{" "}
          <code className="bg-gray-700/50 p-1 rounded">domain.com</code> instead
          of{" "}
          <code className="bg-gray-700/50 p-1 rounded">domain.com/folder</code>,
          you should paste code on top of the{" "}
          <code className="bg-gray-700/50 p-1 rounded">index.php</code> to the
          root of your domain.
        </p>
      </div>

      {/* Test URL Button */}
     <button
  disabled={!pastedUrl.trim()}
  onClick={() => checkIntegration(camp, pastedUrl, setShowIntegrationTable)}
  className={`flex items-center  px-6 py-3 text-base font-semibold rounded-lg transition duration-150 shadow-md
    ${
      pastedUrl.trim()
        ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
        : "bg-gray-600 text-gray-300 cursor-not-allowed"
    }
  `}
>
  <svg
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
  TEST URL
</button>






    </div>
  </div>
);

const PhpPaste = ({ camp, phpCode, pastedUrl, setPastedUrl,setShowIntegrationTable }) => (
  <div>
    {/* === 3. Guidance/Warning Banner (Unchanged) === */}
    <div className="flex items-start p-4 bg-blue-900/40 border border-blue-800 rounded-lg mb-6">
      <svg
        /* ... (Icon) */ className="h-6 w-6 text-blue-400 mr-3 mt-0.5 flex-shrink-0"
        /* ... */ viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <p className="text-blue-200 text-sm">
        <span className="font-semibold">Important:</span> Use the PHP paste
        method when the safe page and cloaked URL are the same.
      </p>
    </div>

    {/* === 4. Code Snippet Instructions & Block === */}
    <div className="mb-4">
      <p className="text-sm text-gray-400 mb-2">
        Copy and paste the PHP code on top of your safe page, above everything
        else, strictly at the start of the index.php. Make sure there is no
        whitespace before php.
      </p>

      {/* Code Block Container */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96 relative">
        <pre className="text-green-400 whitespace-pre-wrap text-left">
          {/* PHP Code Snippet */}
          {phpCode}
        </pre>
      </div>
    </div>

    {/* === 5. Copy to Clipboard Button (Placed right after the code block) === */}
    <button
      onClick={() => handleCopy(phpCode)}
      className="flex items-center cursor-pointer justify-center px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg mb-8"
    >
      <svg
        /* ... (Copy Icon) */ className="h-5 w-5 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      Copy to clipboard
    </button>

    <hr className="border-gray-700 mb-8" />

    {/* === 6. URL Input and Test Section (New Section) === */}
    <div className="w-full">
      {/* Input Label */}
      <label
        htmlFor="pastedUrl"
        className="block text-base text-left font-medium text-white mb-2"
      >
        Enter the URL of the pasted PHP file:
      </label>
       {!pastedUrl && (
  <p className="text-sm text-red-400 mb-2 text-left">
    Please enter a valid URL to enable testing
  </p>
)}

      {/* URL Input Field */}
      <input
        id="pastedUrl"
        type="url"
        value={pastedUrl}
        onChange={(e) => setPastedUrl(e.target.value)}
        placeholder="Please put URL of your pasted script here, for example https://domain.com/scriptname.php"
        className="w-full px-4 py-3 mb-6 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />

      {/* Redirection Guidance */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-left text-white mb-1">
          Redirecting from the root domain
        </h3>
        <p className="text-sm text-gray-400">
          If you want to redirect from the root domain, for example,{" "}
          <code className="bg-gray-700/50 p-1 rounded">domain.com</code> instead
          of{" "}
          <code className="bg-gray-700/50 p-1 rounded">domain.com/folder</code>,
          you should paste code on top of the{" "}
          <code className="bg-gray-700/50 p-1 rounded">index.php</code> to the
          root of your domain.
        </p>
      </div>

      {/* Test URL Button */}
      <button
  disabled={!pastedUrl.trim()}
  onClick={() => checkIntegration(camp, pastedUrl, setShowIntegrationTable)}
  className={`flex items-center px-6 py-3 text-base font-semibold rounded-lg transition duration-150 shadow-md
    ${
      pastedUrl.trim()
        ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
        : "bg-gray-600 text-gray-300 cursor-not-allowed"
    }
  `}
>
  <svg
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
  TEST URL
</button>

    </div>
  </div>
);

const Wordpress = ({ camp, phpCode, pastedUrl, setPastedUrl,setShowIntegrationTable }) => (
  <div>
    {/* <div className="flex items-start p-4 bg-blue-900/40 border border-blue-800 rounded-lg mb-6">
      <p className="text-blue-200 text-sm">
        <span className="font-semibold">Important:</span> Use the PHP upload
        method when your safe page, money page, and cloaked URL are all distinct
        and separate.
      </p>
    </div> */}

    {/* === 4. Code Snippet Instructions & Block === */}
    <div className="mb-4">
      <p className="text-sm text-left text-gray-400 mb-2">
        First download the wordpress plugin and install in wordpress.
      </p>

      <button
        onClick={generateZip}
        className="flex items-center cursor-pointer justify-center px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg mb-8"
      >
        <svg
          class="svg-inline--fa fa-angle-down me-2"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="angle-down"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          data-fa-i2svg=""
        >
          <path
            fill="currentColor"
            d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"
          ></path>
        </svg>
        Download wordpress Plugin
      </button>

      <p className="text-sm text-left text-gray-400 mb-1">
        Copy the PHP code and paste it your wordpress website page or post.
        <span className="text-red-500">
          Note: Disable cache plugin in this method.
        </span>
      </p>

      {/* Code Block Container */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96 relative">
        <pre className="text-green-400 whitespace-pre-wrap text-left">
          {/* PHP Code Snippet */}
          {phpCode}
        </pre>
      </div>
    </div>

    {/* === 5. Copy to Clipboard Button (Placed right after the code block) === */}
    <button
      onClick={handleCopy}
      className="flex items-center cursor-pointer justify-center px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg mb-8"
    >
      <svg
        /* ... (Copy Icon) */ className="h-5 w-5 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      Copy to clipboard
    </button>

    <hr className="border-gray-700 mb-8" />

    {/* === 6. URL Input and Test Section (New Section) === */}
    <div className="w-full">
      {/* Input Label */}
      <label
        htmlFor="pastedUrl"
        className="block text-base text-left font-medium text-white mb-2"
      >
        Enter the URL of the pasted PHP file:
      </label>
       {!pastedUrl && (
  <p className="text-sm text-red-400 mb-2 text-left">
    Please enter a valid URL to enable testing
  </p>
)}

      {/* URL Input Field */}
      <input
        id="pastedUrl"
        type="url"
        value={pastedUrl}
        onChange={(e) => setPastedUrl(e.target.value)}
        placeholder="Please put URL of your pasted script here, for example https://domain.com/scriptname.php"
        className="w-full px-4 py-3 mb-6 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />

      {/* Redirection Guidance */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-left text-white mb-1">
          Redirecting from the root domain
        </h3>
        <p className="text-sm text-gray-400">
          If you want to redirect from the root domain, for example,{" "}
          <code className="bg-gray-700/50 p-1 rounded">domain.com</code> instead
          of{" "}
          <code className="bg-gray-700/50 p-1 rounded">domain.com/folder</code>,
          you should paste code on top of the{" "}
          <code className="bg-gray-700/50 p-1 rounded">index.php</code> to the
          root of your domain.
        </p>
      </div>

      {/* Test URL Button */}
      <button
  disabled={!pastedUrl.trim()}
  onClick={() => checkIntegration(camp, pastedUrl)}
  className={`flex items-center px-6 py-3 text-base font-semibold rounded-lg transition duration-150 shadow-md
    ${
      pastedUrl.trim()
        ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
        : "bg-gray-600 text-gray-300 cursor-not-allowed"
    }
  `}
>
  <svg
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
  TEST URL
</button>

    </div>
  </div>
);

const Javascript = ({ camp, pastedUrl, setPastedUrl,setShowIntegrationTable }) => (
  <div>
    <div className="mb-4">
      <p className="text-sm text-left text-white-400 mb-2">
        You'll add this JavaScript snippet to your safe page. If a visitor is
        considered safe, a JavaScript redirect to your money page occurs. If
        not, the visitor remains on your safe page.
      </p>
      <p className="text-sm text-left text-gray-400 mb-2">
        Copy the JavaScript snippet and paste it between the{" "}
        <code>&lt;head&gt;&lt;/head&gt;</code> tags of your safe page's HTML
        source:
        {`<script src="${import.meta.env.VITE_SERVER_URL}/v2/js_code/${
          camp?.cid
        }.js"></script>`}
      </p>
    </div>

    {/* URL Input Field */}
    <input
      id="pastedUrl"
      type="url"
      disabled
      value={`<script src="${import.meta.env.VITE_SERVER_URL}/cdn/${
        camp?.cid
      }.js"></script>`}
      // onChange={(e) => setPastedUrl(e.target.value)}
      placeholder="Please put URL of your pasted script here, for example https://domain.com/scriptname.php"
      className="w-full px-4 py-3 mb-6 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />

    {/* === 5. Copy to Clipboard Button (Placed right after the code block) === */}
    <button
      onClick={() =>
        handleCopy(
          `<script src="${import.meta.env.VITE_SERVER_URL}/cdn/${
            camp?.cid
          }.js"></script>`
        )
      }
      className="flex  items-center justify-center cursor-pointer px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg mb-8"
    >
      {" "}
      <svg
        /* ... (Copy Icon) */ className="h-5 w-5 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      Copy to Clipboard
    </button>

    <hr className="border-gray-700 mb-8" />

    {/* === 6. URL Input and Test Section (New Section) === */}
    <div className="w-full">
      {/* Input Label */}
      <label
        htmlFor="pastedUrl"
        className="block text-base text-left font-medium text-white mb-2"
      >
        Enter the URL:
      </label>
      {!pastedUrl && (
  <p className="text-sm text-red-400 mb-2 text-left">
    Please enter a valid URL to enable testing
  </p>
)}

      {/* URL Input Field */}
      <input
        id="pastedUrl"
        type="url"
        value={pastedUrl}
        onChange={(e) => setPastedUrl(e.target.value)}
        placeholder="Please put URL of your pasted js cdn link, for example https://domain.com/scriptname.php"
        className="w-full px-4 py-3 mb-6 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />

      {/* Redirection Guidance */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-left text-white mb-1">
          Redirecting from the root domain
        </h3>
      </div>

      {/* Test URL Button */}
      <button
  disabled={!pastedUrl.trim()}
  onClick={() => javascriptIntegration(camp, pastedUrl,setShowIntegrationTable)}
  className={`flex items-center px-6 py-3 text-base font-semibold rounded-lg transition duration-150 shadow-md
    ${
      pastedUrl.trim()
        ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
        : "bg-gray-600 text-gray-300 cursor-not-allowed"
    }
  `}
>
  <svg
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
  TEST URL
</button>

    </div>
  </div>
);


export default CloakingIntegration;
