# Fraraccio 2-Heads CNC TAP Tool

Applicazione web "vanilla Javascript" utilizzata per aggregare in
un'unica sequenza diverse fasi di una fresa CNC con doppia testa. I files
di ingresso e il file di uscita sono tutti in formato ".tap".

L'applicazione è stata realizzata per le coltellerie
[Fraraccio](https://www.fraraccioknife.com) e settata con i parametri relativi
alla loro fresa CNC.



## Come creare un unico file per l'applicazione

L'applicazione può essere usata così com'è oppure per comodità si può esportare
tutto in un solo file HTML; per fare ciò è necessario avere installato NPM ed
eseguire i seguenti comandi:

`$ npm install --dev`

per installare le dipendenze e poi:

`$ npm start`

per generare il file HTML. Verrà creata una cartella di nome "out" con dentro
il file.
