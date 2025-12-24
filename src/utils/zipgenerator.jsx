import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ZipGeneratorButton() {
    console.log("dhsafbh");
    
  
  const generateZip = async () => {
    const zip = new JSZip();
    console.log("zip generation");
    
    // ADD FILES TO ZIP
    zip.file("readme.txt", "This is a test file inside the ZIP.");
    zip.file("data.json", JSON.stringify({ test: true, timestamp: Date.now() }, null, 2));

    // GENERATE ZIP (async)
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // DOWNLOAD ZIP
    saveAs(zipBlob, "myGeneratedZip.zip");
  }
  generateZip();
}
