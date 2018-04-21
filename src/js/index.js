
var downloadBtn;
var preview = document.getElementById('preview');
var menu = document.getElementById("menu");

function controllaCampiObbligatori(files){
  for (var i=0; i<2; i++){
    if (!files[i]) {
      var errorMessage = document.createElement("p");
      errorMessage.textContent = "Selezionare il File " + (i+1);
      errorMessage.className = "alert alert-dismissible alert-danger";
      if (downloadBtn){
        menu.removeChild(downloadBtn);
        downloadBtn = null;
      }
      preview.innerHTML = "";
      preview.append(errorMessage);
      return false;
    }
  }
  return true;
}

function getDataFromFiles(files,callback) {
  var filesData = [];

  function readFile(index) {
    var reader = new FileReader();

    //passo base
    if( index >= files.length )
      return callback(filesData);;

    var file = files[index];
    reader.onload = function(e) {
      // get file content
      filesData[index] = e.target.result;
      // do sth with bin
      readFile(index+1)
    }
    reader.readAsText(file, 'utf-8');
  }

  readFile(0);
}

function operazioniSulTesto(data){
  //Leggi valore di offset assi teste
  var interasse_teste = document.getElementById('interasse_teste').value;
  //elabora 1st file
  var arr1 = data[0].split('\n');
  arr1[arr1.length - 2] = "(fine lavorazione asse Z)";
  var testo1 = arr1.join('\n');
  var cambioEM = `
M5 (spegne elettromandrino fine programma asse Z)
G92X${interasse_teste} (offset asse X)
M10 (scambio rele su elettromandrino asse A)
`;
  testo1 = testo1 + cambioEM;
  //elabora 2nd file
  //regex che cambia le Z con delle A
  var testo2 = data[1].replace(/Z/g, "A");
  var arr2 = testo2.split('\n');
  //eliminazione delle righe finali non necessarie
  arr2[arr2.length-2] = "";
  arr2[arr2.length-3] = "";
  arr2[arr2.length-4] = "";
  arr2[arr2.length-5] = "";
  testo2 = arr2.join('\n');
  var chiusura =`
G1A30 (altezza di sicurezza)
G0X0.000Y0.000 (punto X e Y in 0 con offset)
G92X-${interasse_teste} (compensazione offset X per asse Z)
G0X0.000Y0.000 (punto X e Y in 0 SENZA offset)
M5 (spegne l'elettromandrino)
M11 (scambio relè su elettromandrino asse Z)
M30 (chiusura programma)
`;
  testo2 = testo2 + chiusura;
  //crea testo totale
  var testoTotale = testo1 + '\n\n(inizio secondo file)\n\n' + testo2;
  //elabora 3rd file se presente
  if (data[2]){
    var arr3 = testoTotale.split('\n');
    arr3[arr3.length - 2] = "(fine lavorazione asse A)";
    testoTotale = arr3.join('\n');
    testoTotale = testoTotale + '\n\n(inizio terzo file)\n\n' + data[2];
  }
  return testoTotale;
}

function creaLinkDownload(text) {
  name = "export.tap";
  type = 'text/plain';
  var file = new Blob([text], {type: type});
  if (!downloadBtn){
    downloadBtn = document.createElement("a");
    downloadBtn.textContent= "Scarica";
    downloadBtn.href = URL.createObjectURL(file);
    downloadBtn.download = name;
    downloadBtn.className = 'btn btn-primary';
    downloadBtn.style.float = "right"
    menu.append(downloadBtn);
  } else {
    downloadBtn.href = URL.createObjectURL(file);
  }
}

function unisci(){
  //lettura percorsi files
  var files = [];
  files[0] = document.getElementById("File 1").files[0];
  files[1] = document.getElementById("File 2").files[0];
  var fileOpzionale = document.getElementById("File 3").files[0];
  if (fileOpzionale)
    files[2] = fileOpzionale;
  //controllo presenza primi 2 file
  if (!controllaCampiObbligatori(files)) return;
  //lettura files ed elaborazione
  getDataFromFiles(files, function(filesData){
    var result = operazioniSulTesto(filesData);
    preview.innerHTML = '<pre>' + result + '</pre>';
    creaLinkDownload(result);
  });

}

document.getElementById('unisci-btn').onclick = unisci;
