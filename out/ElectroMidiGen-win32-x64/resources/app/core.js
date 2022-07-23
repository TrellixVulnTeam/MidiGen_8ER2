version = '1.0.01'

window.addEventListener('DOMContentLoaded', () => {
    const path = require('path');
    const fs = require('fs');

    const fileurl = "https://yantraz.com/tools/downversions/ElectroMidiGen/version.txt"

    let dns = require('dns')

    function isInternetOnline(callback) {
        dns.lookup('yantraz.com', function (error) {
            if (error && error.code == "ENOTFOUND") {
                callback(false);
            } else {
                callback(true);
            }
        })
    }

    try {
    fetch(fileurl)
    .then(function(response) {
        response.text().then(function(text) {
        if (text !== version) {
            alert("App version is outdated. Update using Apple/Microsoft Store.")
        }
        });
    });
} catch {alert('Unable to confirm app version, check internet connection.')}

    function showOfflineError(thevar) {
        if (!thevar) {
            alert('Unable to confirm app version, check internet connection.')
        }
    }

    isInternetOnline(showOfflineError)

    //alert(fs.readFileSync(fileurl))

    document.getElementById("iwanttoexport").addEventListener("click", ()=>{okfile()})
    function okfile() {
    try { fs.mkdirSync(path.join(__dirname, 'saves'), { recursive: true })} catch {}
    try { fs.writeFileSync(path.join(__dirname, 'saves', document.getElementById("thexpod").value+".efmgt"), document.getElementById("ptrns").value, 'utf-8'); alert("File saved as: " + path.join(__dirname, "saves/"+document.getElementById("thexpod").value+".efmgt"))}
    catch(e) { alert('Failed to save the file !'); }
    }

    document.getElementById("iwanttoimport").addEventListener("click", ()=>{yesfile()})
    function yesfile() {
        try{ document.getElementById("ptrns").value = fs.readFileSync(document.getElementById("thimpod").value) } catch {document.getElementById("ptrns").value = 'Failed to import file'}
    }
  })