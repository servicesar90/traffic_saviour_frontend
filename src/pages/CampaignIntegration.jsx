import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { apiFunction } from "../api/ApiFunction";
import { createCampaignApi, javascriptIntegrationCheckApi } from "../api/Apis";
import IntegrationTable from "../components/IntegrationPage/IntegrationTable";
import { phpZipCode, wordpressPluginCode } from "../data/cloakingData";
import { showErrorToast, showSuccessToast } from "../components/toast/toast";

const CloakingIntegration = () => {
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
      label: "Upload via PHP",
      svg: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <rect x="4" y="18" width="16" height="3" rx="1" />
        </svg>
      ),
    },
    {
      id: "php-paste",
      label: "Paste PHP Code",
      svg: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 3h6" />
          <path d="M10 8h8" />
          <path d="M10 12h8" />
          <path d="M10 16h5" />
          <path d="M6 8v8" />
          <path d="m4 10 2-2 2 2" />
          <path d="m4 14 2 2 2-2" />
        </svg>
      ),
    },
    {
      id: "wordpress",
      label: "WordPress Setup",
      svg: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="m8 8 2 8 2-5 2 5 2-8" />
        </svg>
      ),
    },
    {
      id: "javascript",
      label: "JavaScript Tag",
      svg: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m8 6-4 6 4 6" />
          <path d="m16 6 4 6-4 6" />
          <path d="m14 4-4 16" />
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
header("Expires: Tue, 01 Jan 2000 00:00:00 GMT"); // Past date
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); // For HTTP/1.0
header("X-Accel-Expires: 0"); // Nginx proxy caching disable

// integration check
function _check() {
  if(isset($_GET['TS-BHDNR-84848'])){
    echo "${camp?.cid}";
    die();
  }
}

_check();

$cloakerApiUrl = "${import.meta.env.VITE_SERVER_URL}/api/v2/trafficfilter/${camp?.cid}/${camp?.user_id}";

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

function getUserIP() {
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
  if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
  return $_SERVER['REMOTE_ADDR'];
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";

$visitorData = [
  "ip" => getUserIP(),
  "userAgent" => $_SERVER['HTTP_USER_AGENT'] ?? '',
  "referer" => $_SERVER['HTTP_REFERER'] ?? '',
  "acceptLanguage" => $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '',
  "url" => $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
  "timestamp" => gmdate("c"),
  "headers" => getHeadersSafe()
];

$ch = curl_init($cloakerApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($visitorData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

if (!$response || $curlError) {
  return;
}

$data = json_decode($response, true);

if ($data && isset($data['action'])) {
  if ($data['action'] === true && !empty($data['target'])) {
    header("Location: " . $data['target'], true, $data['http_code'] ?? 301);
    exit;
  }

  if ($data['action'] === false && !empty($data['target'])) {
    header("Location: " . $data['target'], true, $data['http_code'] ?? 301);
    exit;
  }

  if ($data['action'] === "not") {
    exit;
  }
}
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

  const activeTab = tabs.find((t) => t.id === tab);

  return showIntegrationTable ? (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-start justify-between gap-4 mb-4 flex-col md:flex-row">
          <div>
            <h1 className="dashboard-heading text-left">Integration Setup</h1>
            <p className="text-[12px] text-[#52607a] mt-1">
              Configure cloaking integration for campaign <span className="font-semibold text-[#141824]">{camp?.cid}</span>
            </p>
          </div>
          <button
            onClick={() => {
              navigate("/Dashboard/create-campaign", {
                state: {
                  mode: "edit",
                  id: camp.uid,
                  data: camp,
                },
              });
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-[12px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white"
          >
            Open Campaign Editor
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <div className="rounded-md border border-[#d5d9e4] bg-white px-3 py-2">
            <p className="text-[10px] uppercase font-extrabold tracking-wide text-[#52607a]">Campaign ID</p>
            <p className="text-[13px] font-semibold text-[#1f2a44] mt-1">{camp?.cid || "-"}</p>
          </div>
          <div className="rounded-md border border-[#d5d9e4] bg-white px-3 py-2">
            <p className="text-[10px] uppercase font-extrabold tracking-wide text-[#52607a]">Workspace</p>
            <p className="text-[13px] font-semibold text-[#1f2a44] mt-1">Setup Console</p>
          </div>
          <div className="rounded-md border border-[#d5d9e4] bg-white px-3 py-2">
            <p className="text-[10px] uppercase font-extrabold tracking-wide text-[#52607a]">Current Method</p>
            <p className="text-[13px] font-semibold text-[#1f2a44] mt-1">{activeTab?.label || "-"}</p>
          </div>
          <div className="rounded-md border border-[#d5d9e4] bg-white px-3 py-2">
            <p className="text-[10px] uppercase font-extrabold tracking-wide text-[#52607a]">Integration State</p>
            <p className="text-[13px] font-semibold text-[#1f2a44] mt-1">{camp?.integration ? "Integration Complete" : "Setup Pending"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-5 items-start">
          <aside className="rounded-md  p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#52607a] mb-3">Setup Methods</p>
            <div className="flex flex-col gap-2">
              {tabs?.map((t, index) => (
                <Tab key={t.id} index={index} t={t} tab={tab} setTab={(id) => setTab(id)} />
              ))}
            </div>
          </aside>

          <div>{renderSection(camp)}</div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <IntegrationTable camp={camp} setShowIntegrationTable={setShowIntegrationTable} />
    </div>
  );
};

const Tab = ({ index, t, tab, setTab }) => (
  <button
    className={`w-full text-sm font-semibold py-3 px-3 rounded-md flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer border text-left ${
      tab === t.id
        ? "bg-[#3c79ff] !text-white border-[#3c79ff] shadow-sm"
        : "bg-white text-[#3a4761] border-[#d5d9e4] hover:bg-[#f4f7ff] hover:border-[#bfd0ff]"
    }`}
    onClick={() => {
      setTab(t.id);
    }}
  >
    <span className="flex items-center gap-2 min-w-0">
      {t.svg}
      <span className="truncate">{t.label}</span>
    </span>
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
        tab === t.id ? "bg-white/20 text-white" : "bg-[#edf2ff] text-[#3c79ff]"
      }`}
    >
      {index + 1}
    </span>
  </button>
);

const handleCopy = (text) => {
  const formatted =
    typeof data === "object" ? JSON.stringify(text, null, 2) : String(text);

  navigator.clipboard
    .writeText(formatted)
    .then(() => {
      showSuccessToast("Copied to clipboard!");
    })
    .catch(() => {});
};

const generateZip = async () => {
  const zip = new JSZip();
  const folder = zip.folder("TrafficSaviourCloakingIntegration");
  folder.file("index.php", wordpressPluginCode);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "TrafficSaviourCloakingIntegration.zip");
};

const generatePhpZip = async (phpCode) => {
  const zip = new JSZip();
  zip.file("index.php", `${phpCode} \n ${phpZipCode}`);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "index.zip");
};

const javascriptIntegration = async (camp, url, setShowIntegrationTable) => {
  const data = {
    url: url,
    campId: camp?.cid,
  };

  const res = await apiFunction("post", javascriptIntegrationCheckApi, null, data);

  if (res.data.success) {
    const data = {
      integration: true,
      integrationUrl: url,
      integrationType: "javascript",
    };
    await apiFunction("patch", createCampaignApi, camp?.uid, data);
    showSuccessToast("Integration Successful");
    setShowIntegrationTable(false);
  } else {
    showErrorToast("Integration Failed");
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

  const integrate = await apiFunction("patch", createCampaignApi, camp?.uid, data);
  if (integrate.status === 200) {
    showSuccessToast("Integration Status: " + status);
    setShowIntegrationTable(false);
    return;
  }

  setShowIntegrationTable(true);
  showErrorToast("Integration fail Error try again" + status);
}

const fieldLabelClass =
  "flex items-center text-[11px] font-extrabold uppercase text-[#52607a] tracking-wide mb-2";
const inputClass =
  "w-full bg-white border border-[#d5d9e4] text-sm rounded-md py-2.5 px-4 text-[#141824] placeholder-[#95a1b8] focus:outline-none focus:border-[#3c79ff] focus:shadow-[inset_0_0_0_1px_#3c79ff] transition-colors";
const codeBlockClass =
  "bg-[#0f172a] border border-[#1e293b] rounded-md p-4 font-mono text-[12px] overflow-auto max-h-96 shadow-sm";
const primaryActionClass =
  "inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] bg-[#3c79ff] text-white hover:bg-[#356ee6] cursor-pointer !text-white";
const successActionClass =
  "inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-[13px] transition-colors";

const phpKeywords = new Set([
  "if",
  "else",
  "function",
  "return",
  "echo",
  "header",
  "exit",
  "die",
  "true",
  "false",
  "null",
  "foreach",
  "as",
  "isset",
]);

const renderPhpLine = (line) => {
  const tokenRegex =
    /(\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\$[A-Za-z_]\w*|\b[A-Za-z_]\w*\b)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = tokenRegex.exec(line)) !== null) {
    const token = match[0];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(<span key={`txt-${key++}`}>{line.slice(lastIndex, start)}</span>);
    }

    let className = "text-[#d6deeb]";
    if (token.startsWith("//")) className = "text-[#637777]";
    else if (token.startsWith('"') || token.startsWith("'")) className = "text-[#ecc48d]";
    else if (token.startsWith("$")) className = "text-[#82aaff]";
    else if (phpKeywords.has(token)) className = "text-[#c792ea]";
    else if (/^[A-Za-z_]\w*$/.test(token)) className = "text-[#89ddff]";

    parts.push(
      <span key={`tok-${key++}`} className={className}>
        {token}
      </span>
    );
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(<span key={`tail-${key++}`}>{line.slice(lastIndex)}</span>);
  }

  return parts;
};

const CodeEditorPreview = ({ code, fileName = "index.php" }) => {
  const lines = (code || "").replace(/\t/g, "  ").split("\n");

  return (
    <div className="mb-4 overflow-hidden rounded-md border border-[#27334a] bg-[#0b1220] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#27334a] bg-[#111a2f] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[11px] font-semibold text-[#9fb0d1]">{fileName}</span>
        <span className="text-[10px] text-[#6f81a5]">PHP</span>
      </div>

      <div className="max-h-96 overflow-auto font-mono text-[12px] leading-6">
        {lines.map((line, index) => (
          <div key={`${fileName}-${index}`} className="flex">
            <span className="w-12 select-none border-r border-[#27334a] bg-[#0f172a] px-2 text-right text-[#5c6d8c]">
              {index + 1}
            </span>
            <span className="flex-1 whitespace-pre px-3 text-[#d6deeb]">{renderPhpLine(line)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SectionCard = ({ title, subtitle, children }) => (
  <div className="rounded-md border border-[#d5d9e4] bg-white p-5 md:p-6 text-left">
    <div className="mb-5">
      <h2 className="text-[22px] font-extrabold text-[#141824] leading-tight">{title}</h2>
      {subtitle && <p className="text-[12px] text-[#52607a] mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const InfoStrip = ({ tone = "blue", title, message }) => {
  const styles =
    tone === "amber"
      ? "border-[#f5d6a2] bg-[#fff8ee] text-[#8a4b06]"
      : "border-[#d9e4ff] bg-[#f5f8ff] text-[#1f3f8f]";

  return (
    <div className={`rounded-md border px-4 py-3 mb-5 text-[12px] ${styles}`}>
      <span className="font-bold uppercase tracking-wide">{title}: </span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

const GuideBox = () => (
  <div className="mb-6 rounded-md border border-[#e2e8f0] bg-[#f8fbff] p-4 text-left">
    <h3 className="text-[13px] font-semibold text-[#1f2a44] mb-2">Root Domain Redirect</h3>
    <p className="text-[12px] text-[#52607a] leading-relaxed">
      If redirect should run from the root domain like <code className="px-1.5 py-0.5 rounded border border-[#d5d9e4] bg-white text-[#141824]">domain.com</code> instead of <code className="px-1.5 py-0.5 rounded border border-[#d5d9e4] bg-white text-[#141824]">domain.com/folder</code>, place the integration code at the top of root <code className="px-1.5 py-0.5 rounded border border-[#d5d9e4] bg-white text-[#141824]">index.php</code>.
    </p>
  </div>
);

const UrlField = ({ label, value, onChange, placeholder }) => (
  <div className="mb-6">
    <label htmlFor="pastedUrl" className={fieldLabelClass}>
      {label}
    </label>
    {!value && (
      <p className="text-[12px] text-[#b42318] mb-2">Enter a valid URL to activate testing.</p>
    )}
    <input
      id="pastedUrl"
      type="url"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputClass}
    />
  </div>
);

const TestButton = ({ enabled, onClick, text = "Run URL Test" }) => (
  <button
    disabled={!enabled}
    onClick={onClick}
    className={`${successActionClass} ${
      enabled
        ? "bg-[#16a34a] hover:bg-[#15803d] text-white cursor-pointer"
        : "bg-[#e2e8f0] text-[#8a94ab] cursor-not-allowed"
    }`}
  >
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
    {text}
  </button>
);

const Phpupload = ({ camp, phpCode, pastedUrl, setPastedUrl, setShowIntegrationTable }) => (
  <SectionCard
    title="PHP File Upload Method"
    subtitle="Download the script package, upload it on a separate domain, then verify the integration URL."
  >
    <InfoStrip
      tone="amber"
      title="Best Practice"
      message="Use this method when safe page, money page, and cloaked URL are all on separate paths."
    />

    <p className="text-[13px] text-[#52607a] mb-4">
      Download the archive, extract it, and upload the folder to any domain except your money-page domain. Submit that folder URL to your ad network.
    </p>

    <button
      onClick={() => {
        generatePhpZip(phpCode);
      }}
      className={`${primaryActionClass} mb-6`}
    >
      <svg className="h-4 w-4" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          fill="currentColor"
          d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"
        ></path>
      </svg>
      Download PHP Package
    </button>

    <div className="h-px bg-[#e7ecf5] mb-6" />

    <UrlField
      label="Integrated URL"
      value={pastedUrl}
      onChange={(e) => setPastedUrl(e.target.value)}
      placeholder="https://domain.com/scriptname.php"
    />

    <GuideBox />

    <TestButton
      enabled={Boolean(pastedUrl.trim())}
      onClick={() => checkIntegration(camp, pastedUrl, setShowIntegrationTable)}
    />
  </SectionCard>
);

const PhpPaste = ({ camp, phpCode, pastedUrl, setPastedUrl, setShowIntegrationTable }) => (
  <SectionCard
    title="PHP Snippet Method"
    subtitle="Paste the snippet at the top of your safe page, then verify the deployed URL."
  >
    <InfoStrip
      tone="blue"
      title="When to Use"
      message="Use this method when your safe page and cloaked URL are the same."
    />

    <p className="text-[13px] text-[#52607a] mb-3">
      Copy this PHP snippet and place it at the very top of <code className="px-1.5 py-0.5 rounded border border-[#d5d9e4] bg-white text-[#141824]">index.php</code> with no whitespace before PHP.
    </p>

    <CodeEditorPreview code={phpCode} fileName="index.php" />

    <button onClick={() => handleCopy(phpCode)} className={`${primaryActionClass} mb-6`}>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      Copy PHP Code
    </button>

    <div className="h-px bg-[#e7ecf5] mb-6" />

    <UrlField
      label="Live PHP URL"
      value={pastedUrl}
      onChange={(e) => setPastedUrl(e.target.value)}
      placeholder="https://domain.com/scriptname.php"
    />

    <GuideBox />

    <TestButton
      enabled={Boolean(pastedUrl.trim())}
      onClick={() => checkIntegration(camp, pastedUrl, setShowIntegrationTable)}
    />
  </SectionCard>
);

const Wordpress = ({ camp, phpCode, pastedUrl, setPastedUrl, setShowIntegrationTable }) => (
  <SectionCard
    title="WordPress Plugin Method"
    subtitle="Install the plugin first, then place the PHP snippet inside your WordPress page or post."
  >
    <InfoStrip
      tone="amber"
      title="Important"
      message="Disable caching plugins while configuring this integration method."
    />

    <button onClick={generateZip} className={`${primaryActionClass} mb-4`}>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      Download WP Plugin
    </button>

    <p className="text-[13px] text-[#52607a] mb-3">Copy this PHP snippet and insert it into your WordPress page/post content.</p>

    <CodeEditorPreview code={phpCode} fileName="wordpress-page.php" />

    <button onClick={() => handleCopy(phpCode)} className={`${primaryActionClass} mb-6`}>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      Copy PHP Code
    </button>

    <div className="h-px bg-[#e7ecf5] mb-6" />

    <UrlField
      label="WordPress URL"
      value={pastedUrl}
      onChange={(e) => setPastedUrl(e.target.value)}
      placeholder="https://domain.com/page-url"
    />

    <GuideBox />

    <TestButton
      enabled={Boolean(pastedUrl.trim())}
      onClick={() => checkIntegration(camp, pastedUrl, setShowIntegrationTable)}
    />
  </SectionCard>
);

const Javascript = ({ camp, pastedUrl, setPastedUrl, setShowIntegrationTable }) => (
  <SectionCard
    title="JavaScript CDN Method"
    subtitle="Add the CDN snippet inside the head tag and validate your safe-page URL."
  >
    <InfoStrip
      tone="blue"
      title="Behavior"
      message="Safe visitors are redirected to the money page, blocked visitors remain on the safe page."
    />

    <label htmlFor="script-snippet" className={fieldLabelClass}>
      Script Tag
    </label>
    <input
      id="script-snippet"
      type="url"
      disabled
      value={`<script src="${import.meta.env.VITE_SERVER_URL}/cdn/${camp?.cid}.js"></script>`}
      className={`${inputClass} mb-4 font-mono bg-[#f8fafc]`}
    />

    <button
      onClick={() =>
        handleCopy(`<script src="${import.meta.env.VITE_SERVER_URL}/cdn/${camp?.cid}.js"></script>`)
      }
      className={`${primaryActionClass} mb-6`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      Copy Script Tag
    </button>

    <div className="h-px bg-[#e7ecf5] mb-6" />

    <UrlField
      label="Safe Landing URL"
      value={pastedUrl}
      onChange={(e) => setPastedUrl(e.target.value)}
      placeholder="https://yourdomain.com/safe-page"
    />

    <TestButton
      enabled={Boolean(pastedUrl.trim())}
      onClick={() => javascriptIntegration(camp, pastedUrl, setShowIntegrationTable)}
      text="Run URL Test"
    />
  </SectionCard>
);

export default CloakingIntegration;
