# Physiotherapie Abschlussbericht

Eine Webanwendung für Physiotherapeuten zur Erstellung von Abschlussberichten mit OpenRouter-Integration.

## Projektübersicht

Diese Anwendung ermöglicht es Physiotherapeuten, strukturierte Abschlussberichte zu erstellen. Die eingegebenen Daten werden direkt an die OpenRouter API gesendet, die mithilfe eines KI-Modells einen professionellen Abschlussbericht generiert.

### Funktionen

- Formular zur Erfassung von Therapiezielen, Compliance und Hypothesen
- Dynamische Anzeige von Feldern basierend auf der Benutzerauswahl
- Direkte Integration mit OpenRouter für die KI-Generierung von Berichten
- Responsive Design für die Nutzung auf verschiedenen Geräten
- Automatische Zeiterfassung
- Ampel-Icons für Ja/Nein-Antworten
- Formular-Zusammenfassung im generierten Bericht

## Lokale Installation

1. Klonen Sie das Repository oder laden Sie die Dateien herunter
2. Öffnen Sie die `index.html` Datei in einem Webbrowser

Für die vollständige Funktionalität ist ein OpenRouter API-Schlüssel erforderlich.

## GitHub Pages Deployment (Demo-Modus)

Diese Anwendung ist für das Hosting auf GitHub Pages im Demo-Modus vorbereitet. Im Demo-Modus werden keine echten KI-generierten Berichte erstellt, sondern vorgefertigte Beispielberichte angezeigt.

### Voraussetzungen

- Ein GitHub-Konto
- Git installiert auf Ihrem Computer

### Deployment-Schritte

1. **Repository auf GitHub erstellen**:
   - Erstellen Sie ein neues Repository auf GitHub
   - Benennen Sie es z.B. "physiotherapie-abschlussbericht"

2. **Lokales Repository initialisieren und Code hochladen**:
   ```bash
   cd physiotherapie-abschlussbericht
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/IHR_USERNAME/physiotherapie-abschlussbericht.git
   git push -u origin main
   ```
   Ersetzen Sie `IHR_USERNAME` mit Ihrem GitHub-Benutzernamen.

3. **GitHub Pages aktivieren**:
   - Gehen Sie zu Ihrem Repository auf GitHub
   - Klicken Sie auf "Settings" > "Pages"
   - Unter "Source", wählen Sie "main" als Branch und "/" (root) als Ordner
   - Klicken Sie auf "Save"

4. **Auf Deployment warten**:
   - GitHub wird Ihre Seite automatisch deployen
   - Nach einigen Minuten wird Ihre Seite unter `https://IHR_USERNAME.github.io/physiotherapie-abschlussbericht` verfügbar sein

### Demo-Modus

Die Anwendung läuft im Demo-Modus, was bedeutet:

- ✅ Keine API-Schlüssel erforderlich
- ✅ Sofort einsatzbereit ohne Serverless-Funktionen
- ✅ Beispielberichte werden basierend auf den Formulardaten generiert
- ✅ Kostenlos im Rahmen von GitHub Pages
- ✅ Automatisches HTTPS durch GitHub Pages

## OpenRouter-Integration

### Konfiguration für lokale Entwicklung

Für die lokale Entwicklung können Sie eine `.env`-Datei im Projektverzeichnis erstellen:

```
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
```

Diese Datei wird nicht ins Git-Repository aufgenommen (siehe `.gitignore`).

### Unterstützte Modelle

OpenRouter unterstützt verschiedene Modelle wie:
- `anthropic/claude-3-opus`
- `anthropic/claude-3-sonnet`
- `openai/gpt-4-turbo`
- `google/gemini-pro`
- und viele weitere

Die vollständige Liste der verfügbaren Modelle finden Sie in der OpenRouter-Dokumentation.

## Anpassung

### Formularfelder anpassen

Um zusätzliche Felder hinzuzufügen oder bestehende zu ändern, bearbeiten Sie die folgenden Dateien:

1. `index.html`: Fügen Sie neue Formularelemente hinzu
2. `js/app.js`: Aktualisieren Sie das `formData`-Objekt und die Validierungslogik
3. `js/services/openRouterService.js`: Aktualisieren Sie die `formatPrompt`-Methode

### KI-Prompt anpassen

Sie können den Prompt für die KI in der `formatPrompt`-Methode in der Datei `js/services/openRouterService.js` anpassen, um spezifischere oder anders strukturierte Berichte zu generieren.

### Styling anpassen

Das Styling kann in der Datei `css/styles.css` angepasst werden. Die Anwendung verwendet CSS-Variablen für Farben und andere Designelemente, die leicht geändert werden können.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
