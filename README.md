# gDT - gradeDisplayTool
![version](https://img.shields.io/badge/version-1.0-blue) [![license](https://img.shields.io/badge/license-CC%20BY--NC%204.0-green)](https://creativecommons.org/licenses/by-nc/4.0/) ![maintained](https://img.shields.io/badge/maintained%3F-yes-lightgreen?style=flat)

[![twitter](https://img.shields.io/badge/@MrDoubleH-1DA1F2?style=flat&logo=twitter&logoColor=white)](https://www.twitter.com/Mr_DblH)

## Inhalt
Noten in Listen eintragen ohne Schnittstellen?

Eine Erleichterung ist das _gDT (gradeDisplayTool)_: Es wird (lokal) eine ``index.html`` zur Verfügung gestellt. Im eigenen Browser öffnen, eine selbstgenerierte ``csv``-Datei per Drag-&-Drop auf diese Datei ziehen - es wird zeilenweise Name, Vornamen und zugeordnete Noten einzeln in frei-wählbarem zeitlichen Abstand angezeigt.

Über einfache Einstellungen wie den zeitlichen Abstand der einzelnen Datensätze (eine Zeile in der csv-Datei) oder die Anzeigeart der Noten (_3,75_ vs _+4_) kann die Anzeige angepasst werden. Die Anzeigezeit ist stehts in Sekunden.

Der Aufbau der csv-Datei wird unten erläutert.

Noten schlechter als 4 werden _rot_ hervorgehoben.

## Hinweise und Features
- **csv-Datei: Aufbau:**

    Der Aufbau der zu importierenden muss zwingend folgendem Aufbau vorweisen:

    | Name | Vorname | Note1 | [Note2] | [Note3] | ... |
    |------|---------|-------|---------|---------|-----|
    | Bola | Tom     | 3,00  | 2,25    | 4,25    | ... |
    | Bär  | Carmen  | 1,25  | 2,25    | 3,50    | ... |
    | ...  | ...     | ...   | ...     | ...     | ... |

    Dabei ist zu beachten:
    - Die ersten drei Spalten sind verpflichtend.
    - Überschriftbegriffe sind unerheblich, müssen lediglich vorhanden sein, da mit Kopfzeilen importiert wird.
    - Es sind beliebig viele Noten(spalten) möglich; ist lediglich aufgrund der Anzeigenzeile begrenzt.
    - Noten müssen nicht zwei Nachkommastellen besitzen. Für die Umwandlung in +- (z.B. 3,25 <=> 3-) müssen zwei Nachkommastellen vorhanden sein.
    - Noten können mit . oder , als Dezimalzeichen eingegeben werden, solange es nicht mit dem Trennzeichen der csv-Datei interferiert.
    - Export aus Excel direkt möglich (Excel benutzt ; als Standard-Trennzeichen).
    - Daten werden nach (Nach-)Name (bzw. erste Spalte) aufsteigend (A-Z) sortiert.

- **Mit Tasten steuern:**

    Die Pfeiltasten sind zum _Skippen_ da:
    - Pfeiltaste Links: ein Datensatz zurück
    - Pfeiltaste Rechts: ein Datensatz vor
    - Leertaste: Start bzw. Stopp

- **Läuft im Browser:**

    Projekt besteht aus einer ``index.html``-Datei, die in einem beliebigen Browser geöffnet wird. Im gleichen Ordnner wie jene ``index.html`` liegen zwei Ordner: ``css`` und ``js``. Im Ordner ``css`` liegt eine Datei, die die Formatierungen übernimmt, die Datei ``main.js``im Ordner ``js`` übernimmt die Funktionalität des _gDT_. Die Datei ``papaparse.min.js`` übernimmt als Modul den Import einer csv-Datei.

- **flugzeugmoduskompatibel**

    Jegliche Dateien wie Icons oder Funktionalitäten sind offline verfügbar und müssen weder vor- noch nachgeladen werden: kein Datenfluss zu googlefonts oder anderen JavaScript-Dateien, keine Tracking jeglicher Art.



## Installation
Das gitHub-Projekt clonen oder die zip-Datei herunterladen. Die zip-Datei entpacken und danach die ``index.html`` öffnen.


## Lizenz
Creative Commons Attribution-NonCommercial 4.0 International [(CC BY-NC 4.0) ](https://creativecommons.org/licenses/by-nc/4.0/)
Ohne Gewähr, jeder ist für die Benutzung dieser Dateien selbst verantwortlich und sollte diese Dateien lediglich zur Unterstzützung und Ergänzung einsetzen und _nicht_ als einzige Datenquelle ohne gelegentlichen Gegenabgleich.

Dieses Projekt nutzt die js-Datei [papaparse](https://www.papaparse.com) und ist in der minimierten Version im Paket enthalten (v5). Damit ist keine Verbindung zum Internet notwendig.


## Screenshots
![Drop der CSV, Art der Notenanzeig und Zeiteinstellung in Sekunden](screenshots/1-drop-plusminus-time.gif)
