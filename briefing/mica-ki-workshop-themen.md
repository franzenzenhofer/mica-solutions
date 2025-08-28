# MICA KI Workshop Themen

## Fragestellungen KI Anwendung bei MICA

### 1. Praxiswissen Chatbot/KI-Suche

**Website:** https://www.musicaustria.at/praxiswissen/

#### 1.1 Grundidee
- **KI-Suchfunktion bzw. Chatbot** selbst entwickeln
- Durchsucht unser Praxiswissen
- **Entlastung des Beratungsteams** durch automatische Beantwortung allgemeiner (nicht individueller) Fragestellungen
- Benutzer sollen zunächst im Praxiswissen bzw. über KI-Suche Antworten finden

#### 1.2 Erweiterte Vision
- **KI über mehrere ausgewählte Websites suchen lassen**
- Training auf mehrere Websites
- Grund: Für einige Bereiche gibt es anderswo sehr gute FAQs

#### 1.3 Langfristige Strategie
**Frage:** Werden wir für bestimmte Bereiche nur mehr diesen Chatbot anbieten statt Informationen zu sammeln und zu texten?

**Einschränkung:** Wird nur für bestimmte ausgewählte Bereiche funktionieren - einiges ist bei uns exklusiv zu finden bzw. in dieser Form exklusiv.

#### 1.4 Aktualisierung des Praxiswissens
**Ziel:** Veraltete Inhalte herausfinden und überarbeiten

**Bedenken:** 
- Vermutlich heikle Angelegenheit, weil KI Daten erfindet und fantasiert
- Alles muss nachgeprüft werden
- **Fraglich:** Vermutlich keine Arbeitserleichterung, oder doch?

### 2. Musikdatenbank Optimierung

**Website:** https://db.musicaustria.at/

#### 2.1 Aktuelle Situation
- Sammlung von Infos zu österreichischen Musikschaffenden
- Schwerpunkt: Komponist:innen aus dem Bereich zeitgenössische Musik und Jazzmusiker:innen
- (Für Pop gibt es das SR-Archiv)
- **Problem:** Ziel wäre, dass die Daten immer aktuell sind - davon sind wir weit entfernt

#### 2.2 Use-Case: Datenbank-Team Workflow
**Aktueller Prozess:**
- Team durchforstet Websites der Musikschaffenden und ihrer Verlage nach neuen Informationen
- **Problem:** Informationen bzw. Daten sind sehr unterschiedlich strukturiert bzw. sortiert
- **Aktualisiert werden:** Werklisten und Biographien

#### 2.3 Kernfragen für KI-Unterstützung

##### 2.3.1 Biographien-Abgleich
**Frage:** Wie kann KI uns dabei helfen, die veraltete Version eines biographischen Datensatzes in unserer Datenbank mit der Website der jeweiligen Personen bzw. Verlage abzugleichen?

##### 2.3.2 Werklisten-Aktualisierung  
**Frage:** Wie kann KI uns bei der Aktualisierung der Werklisten unterstützen?
- Suche nach neuen Werken
- Transfer dieser Daten **im richtigen Format** in unsere Datenbank

##### 2.3.3 E-Mail-Daten-Verarbeitung
**Frage:** Fallweise bekommen wir Daten per E-Mail. Lässt sich in diesem Fall KI einsetzen, um den Vorgang des Abgleichens der Daten effizienter zu gestalten?

##### 2.3.4 Intelligente Suche
**Ziel:** Chatbot geführte Suche bzw. Suchhilfe zwecks Ergänzung unserer jetzigen Suchmöglichkeiten bzw. Filter in der Datenbank.

#### 2.4 Fundamentale Strategiefrage
**Überlegung:** Ob Datenbanken wie diese mittelfristig völlig anders gehandhabt werden und wir nur mehr einen Chatbot pflegen bzw. zusätzlich sinnvolle Suchvorgänge bzw. Prompts vorschlagen?

**Radikaler Ansatz:** 
- Kein Einpflegen von Daten mehr
- Stattdessen: Einsatz eines **Scrapers in Verbindung mit KI-Tools**

### 3. Listen-Aktualisierung

**Beispiel:** https://www.musicaustria.at/bundeslaender/burgenland/festivals/

#### 3.1 Grundsatzfrage
**Ist es noch sinnvoll solche kuratierten Listen zu machen?**

#### 3.2 Optimierungsfrage
**Falls ja, wie können wir das effizienter machen?**

**Aktueller Prozess:** 
- Wir gehen die Datensätze einzeln durch
- Abgleich, ob sich Daten geändert haben
- Prüfung, ob es die Organisation noch gibt

### 4. Event-Management und Veranstaltungskalender

#### 4.1 Aktueller Workflow
- **Bisherige Aktualisierung:** im CRM, dann Datenausspielung auf die Website
- **Veranstaltungskalender:** mit Konzerten österreichischer Musikschaffender
- **Neuer Ansatz:** Team versucht mehrstufigen Prozess aufzusetzen für mehr Effizienz

#### 4.2 Venue-Scraping
**Status:** Seiten von Venues lassen sich halbwegs gut scrapen

#### 4.3 E-Mail-Verarbeitung für Events
**Ziel:** Veranstaltungsankündigungen die uns via E-Mail geschickt werden, würden wir gerne mit KI aufbereiten

**Gewünschtes Ergebnis:** 
- Am Ende sollte eine **XLS-Liste** rauskommen
- Die wir nur noch importieren müssen

**Kernfrage:** **Ist das realistisch?**

#### 4.4 Strategische Reflexion
**Grundsatzfrage:** **Gehen unsere Überlegungen überhaupt in die richtige Richtung?**

## Weitere Fragestellungen

### 5. Website-Optimierung für AI

**Betroffene Websites:**
- https://www.musicaustria.at/
- https://www.musicexport.at/
- https://db.musicaustria.at/

**Kernfragen:**
- **AI-Optimierung alle Websites:** was ist zu tun? 
- Ist etwas zu tun? 
- **Oder eher Opt-Out aus KI?**

### 6. Automatisierte Berichterstattung

#### 6.1 Aktuelle Herausforderung
- **Berichte schreiben:** hoher Zeitaufwand
- **Problem:** Monatsberichte sollten in Jahresbericht einfließen ohne dass etwas vergessen wird

#### 6.2 Matomo-Integration
**Frage:** Ist der Überblick über unsere Website-Nutzungszahlen in Matomo mit KI automatisch erstellbar?

#### 6.3 Datenanalyse und Insights
**Ziel:** Analyse aller bereits existierenden Daten bzw. von uns gesammelten Daten/Kennzahlen
- Matomo
- Social Media KPIs
- Newsletter
- Umfrageergebnisse

**Zweck:** Um klarer zu erkennen welche Posts die Zugriffe auf unsere Website motivieren und verstärken.

### 7. CRM-Optimierung

#### 7.1 Adressdatensatz-Aktualisierung
**Use Case:** Aktualisierung von Adressdatensätzen für einzelne Projekte
- Beispiel: Klassik/neue Musik Ensembles für Messen
- Ergänzung neuer Ensembles

**Bisherige Erfahrung:** Letzteres hat bisher nicht funktioniert mit ChatGPT

**Frage:** Könnte das in Zukunft der Fall sein?

### 8. Workshop-Anmeldungsanalyse

**Zielsetzung:** In-depth Analyse der Anmeldungen zu Workshops

**Analysefragen:**
- Wer kommt über welchen Kanal?
- Wie können wir schlechte Ergebnisse umdrehen?

**Beispiel-Problem:** Thema Mental Load stößt auf viel Interesse, hat aber wenige/keine Anmeldungen

### 9. Spezielle Projekte

#### 9.1 Hörminute-Landkarte
**Projekt:** https://www.hoerminute.at/
**Bedarf:** Landkarte mit Musik-Institutionen und Hörminuten für das Volksschulprojekt Hörminute

### 10. Alltägliche Büroautomatisierung

#### 10.1 Grundsatzfragen
- **Welche alltäglichen Büroaufgaben** lassen sich durch KI heute schon zuverlässig unterstützen oder automatisieren?
- **Welche Tools oder Anwendungen** sind im Büro besonders nützlich?
- **Wie lässt sich KI in Kombination mit bestehenden Office-Programmen** (z. B. MS Office, Google Workspace) sinnvoll nutzen?

#### 10.2 Aufgaben-Management
**Frage:** Wie kann KI bei der Organisation und Priorisierung von Aufgaben unterstützen?

### 11. Audio-/Text-Verarbeitung

#### 11.1 Transkription von Interviews
**Bedarf:** Audio zu Text

**Fragen:**
- Welche Transkriptionsprogramme lassen sich gut mit Chat GPT u. ä. kombinieren?
- Wie kann KI Teammeetings unterstützen z. B. durch Protokollierung oder Übersetzung?

### 12. Bildverarbeitung

#### 12.1 Fotobearbeitung für Website
**Problem:** Fotobearbeitung zur Veröffentlichung auf der Website ist im Alltag doch hier und da ein Zeitfresser

**Frage:** Gibt es dafür eine nützliche Hilfe, abseits des Photoshop Intensivkurses?

### 13. Website-Suche

#### 13.1 KI-Chatbot für Website-Suche
**Ziel:** KI-Chatbot um auf der Website besser nach Themen suchen zu können

### 14. GDPR-konforme Alternativen

#### 14.1 Mistral vs. ChatGPT
**Kernfrage:** Ist Mistral (Le Chat) eine gute Alternative zu Chat GPT für unsere Zwecke?

**Begründung:** 
- Europäischer Anbieter
- DSGVO-konform

## Zusammenfassung der Hauptbedarfe

### Priorisierte Use Cases:

1. **Praxiswissen-Chatbot** - Entlastung des Beratungsteams
2. **Datenbank-Synchronisation** - Automatischer Abgleich von Biografien und Werklisten
3. **E-Mail-Verarbeitung** - Automatische Aufbereitung von Event- und Personen-Daten
4. **Listen-Aktualisierung** - Effiziente Pflege von Festival- und Organisations-Listen
5. **Automatisierte Berichterstattung** - Integration von Monats- zu Jahresberichten
6. **CRM-Optimierung** - Intelligente Adressdaten-Aktualisierung
7. **Büroautomatisierung** - Allgemeine Effizienzsteigerung bei Routinetätigkeiten

### Kritische Erfolgsfaktoren:

- **GDPR-Konformität** (Mistral als europäische Alternative)
- **Datenqualität und -verifizierung**
- **Integration in bestehende Workflows**
- **Benutzerfreundlichkeit für Non-Tech-Team**
- **Kosteneffizienz gegenüber manueller Arbeit**

### Risiken und Bedenken:

- **KI erfindet und fantasiert Daten** - alles muss nachgeprüft werden
- **Unklarer ROI** bei einigen Anwendungen
- **Komplexität der internen Regelwerke** schwer zu automatisieren
- **Qualitätskontrolle** bleibt menschliche Aufgabe