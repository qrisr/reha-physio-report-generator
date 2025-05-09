# Reha 2025 - Physiotherapie Abschlussbericht Generator

Eine Webanwendung für Physiotherapeuten, die es ermöglicht, strukturierte Abschlussberichte zu generieren. Die Anwendung erfasst Formulardaten und sendet diese an eine KI (OpenRouter mit verschiedenen KI-Modellen), um professionelle Berichte zu erstellen.

## Funktionen

- Formular zur Datenerfassung mit relevanten Feldern für Physiotherapie-Berichte
- Visuelle Indikatoren (Ampelsystem) für Therapieziel-Status und Compliance
- Automatische Berichterstellung basierend auf den eingegebenen Daten
- Einfaches und übersichtliches Design für eine intuitive Benutzererfahrung
- Admin-Bereich zur Konfiguration des KI-Modells, System Prompts und API-Schlüssels

## Admin-Bereich

Der Admin-Bereich ist über einen Link im Footer der Anwendung zugänglich. Hier können folgende Einstellungen vorgenommen werden:

- **System Prompt**: Anpassung des Prompts, der an die KI gesendet wird, mit Unterstützung für Variablen und bedingte Logik
- **KI-Modell**: Auswahl aus verschiedenen verfügbaren KI-Modellen (GPT-3.5, GPT-4, Claude, etc.)
- **API-Schlüssel**: Konfiguration des OpenRouter API-Schlüssels für die KI-Integration

Standardmäßiges Admin-Passwort: `admin123` (sollte in der Produktion geändert werden)

## Technische Details

- Vanilla JavaScript (kein Framework)
- CSS mit Variablen für das Farbschema
- Responsive Design
- Integration mit OpenRouter API für KI-generierte Berichte
- Deployment auf GitHub Pages
- Lokale Speicherung der Admin-Einstellungen im Browser (localStorage)

## Nutzung

1. Formular mit den relevanten Patientendaten und Behandlungsinformationen ausfüllen
2. Auf "Absenden" klicken
3. Der generierte Bericht wird unterhalb des Formulars angezeigt
4. Bei Bedarf kann das Formular zurückgesetzt werden, um einen neuen Bericht zu erstellen

## Admin-Konfiguration

1. Klicken Sie auf den "Admin"-Link im Footer der Anwendung
2. Geben Sie das Admin-Passwort ein (Standard: `admin123`)
3. Passen Sie den System Prompt, das KI-Modell und den API-Schlüssel nach Bedarf an
4. Klicken Sie auf "Einstellungen speichern", um die Änderungen zu übernehmen

## Verfügbare Variablen im System Prompt

Der System Prompt unterstützt folgende Variablen:

- `{time}` - Zeitpunkt der Berichterstellung
- `{goalStatus}` - Status des Therapieziels (erreicht/nicht-erreicht)
- `{compliance}` - Compliance des Patienten (ja/nein)
- `{therapyGoal}` - Das definierte Therapieziel
- `{hypothesis}` - Die eingegebene Hypothese
- `{reason}` - Begründung bei Nicht-Erreichung des Ziels
- `{formData:json}` - Alle Formulardaten als JSON-Objekt

Bedingte Logik ist ebenfalls möglich, z.B.:
`{goalStatus === "erreicht" ? "Das Ziel wurde erreicht" : "Das Ziel wurde nicht erreicht"}`
