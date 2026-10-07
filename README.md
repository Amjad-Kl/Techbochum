StadtBarrierefrei – Bochum & Ruhrgebiet

StadtBarrierefrei ist eine Webanwendung, mit der barrierefreie Orte, Baustellen und gemeldete Hindernisse in Bochum und Umgebung auf einer Karte angezeigt werden.

Die Idee dahinter ist, dass Menschen schnell sehen können, welche Orte und Wege gut zugänglich sind. Gleichzeitig können Nutzer selbst Hindernisse melden, zum Beispiel defekte Aufzüge, Stufen oder zu enge Wege.

Funktionen

* Anzeige von barrierefreien Orten auf einer Karte
* Anzeige von aktuellen Baustellen und Einschränkungen
* Melden von neuen Hindernissen
* Möglichkeit, Meldungen mit einem Foto und einem Schweregrad zu ergänzen
* Suche nach Orten
* Verschiedene Einstellungen für bessere Barrierefreiheit
* Kontrastmodus und Schriftgrößen-Anpassung
* Dunkelmodus
* Vorlesefunktion (TTS)
* Farbsimulation für verschiedene Sehschwächen

Projektstruktur

Das Projekt besteht aus einem Frontend und einem kleinen Node.js/Express-Backend.

├── .env.example             # Beispiel für Umgebungsvariablen
├── .env                     # Lokale Einstellungen
├── .gitignore               # Dateien, die nicht zu Git gehören
├── package.json             # Abhängigkeiten und Startskripte
├── server.js                # Express-Server
├── README.md                # Projektdokumentation
│
├── models/
│   └── Report.js            # Datenmodell für Meldungen
│
├── routes/
│   └── reports.js           # API für Meldungen
│
├── data/
│   └── reports.json         # Lokale Speicherung der Meldungen
│
└── public/
    ├── index.html           # Hauptseite
    │
    ├── css/
    │   └── style.css        # Styles und Responsive Design
    │
    ├── js/
    │   ├── app.js           # Hauptlogik der Anwendung
    │   ├── map.js           # Karte und Marker
    │   ├── reports.js        # Meldungen und API
    │   └── accessibility.js  # Barrierefreiheits-Funktionen
    │
    ├── data/
    │   ├── default-locations.json
    │   └── baustellen.geojson
    │
    └── assets/
        └── images/

Installation und Start

Variante 1: Node.js / Express

Für die vollständige Version mit Backend:

npm install
npm start

Danach kann die Anwendung im Browser geöffnet werden:

http://localhost:5000

Eine MongoDB ist nicht zwingend notwendig. Wenn keine MongoDB erreichbar ist, werden die Meldungen lokal in data/reports.json gespeichert.

Variante 2: Nur Frontend

Die ältere Frontend-Version kann auch mit einem einfachen Python-Webserver gestartet werden.

Im Ordner website_V6(cursor):

python -m http.server 8000

Danach im Browser:

http://localhost:8000/index.html

In dieser Variante werden neue Meldungen im Browser gespeichert.

REST-API

Das Backend stellt unter /api/reports verschiedene Endpunkte zur Verfügung:

Methode	Endpunkt	Beschreibung
GET	/api/reports	Alle Meldungen anzeigen
POST	/api/reports	Neue Meldung erstellen
PATCH	/api/reports/:id	Status einer Meldung ändern
DELETE	/api/reports/:id	Meldung löschen
GET	/api/health	Prüfen, ob das Backend funktioniert

Barrierefreiheit

Bei der Entwicklung wurde darauf geachtet, dass die Anwendung möglichst einfach und barrierearm bedienbar ist.

Dazu gehören unter anderem:

* hoher Kontrast
* Anpassung der Schriftgröße
* Dunkelmodus
* Vorlesefunktion über die Browser-Web-Speech-API
* Farbsimulation für verschiedene Sehschwächen
* Bedienung über die Tastatur
* sichtbare Fokus-Anzeigen
* Verwendung von aria-Attributen

Datenquellen

* Kartendaten: OpenStreetMap
* Baustellendaten: offene Geodaten der Stadt Bochum
* Geokodierung: Photon API / Komoot OSM Geocoder
* Icons: Font Awesome Free

Hinweis

Das Projekt wurde für Bochum und das Ruhrgebiet entwickelt und kann bei Bedarf um weitere Orte und Funktionen erweitert werden.