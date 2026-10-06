#!/usr/bin/env bash
# Beende das Skript sofort bei Fehlern
set -euo pipefail

# -----------------------------------------------------------------------------
# Konfiguration
# -----------------------------------------------------------------------------
# Pfad zu dem Verzeichnis, in dem deine Quellordner liegen (relativ oder absolut):
SOURCE_DIR="C:\Users\Amjad\Desktop\MyGithubRepo (7)\SK2\website"

# Definition der Stufen: "Ordnername:Tag:Commit-Titel"
VERSIONS=(
  "website_V7:v7.0:feat: Version 7 - Vollständige Code mit README"
)

# -----------------------------------------------------------------------------
# Sicherheitsprüfungen
# -----------------------------------------------------------------------------
if [ ! -d ".git" ]; then
  echo "[-] Fehler: Dieses Skript muss im Stammverzeichnis deines Git-Repositories ausgeführt werden."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "[-] Warnung: Du befindest dich auf Branch '$CURRENT_BRANCH', nicht auf 'main'."
fi

# -----------------------------------------------------------------------------
# Automatisierter Ablauf
# -----------------------------------------------------------------------------
for entry in "${VERSIONS[@]}"; do
  IFS=":" read -r FOLDER TAG COMMIT_MSG <<< "$entry"
  SOURCE_PATH="${SOURCE_DIR}/${FOLDER}"

  echo "================================================================="
  echo " Verarbeite: ${FOLDER} -> Tag: ${TAG}"
  echo "================================================================="

  # 1. Prüfen, ob der Quellordner existiert
  if [ ! -d "$SOURCE_PATH" ]; then
    echo "[-] Fehler: Quellordner '$SOURCE_PATH' nicht gefunden!"
    exit 1
  fi

  # 2. Arbeitsverzeichnis leeren (ohne .git, .gitignore und das Skript selbst)
  echo "[*] Bereinige bisherige Dateien im Repo..."
  find . -mindepth 1 -maxdepth 1 \
    ! -name ".git" \
    ! -name ".gitignore" \
    ! -name "push_versions.sh" \
    -exec rm -rf {} +

  # 3. Neue Version ins Hauptverzeichnis kopieren
  echo "[*] Kopiere Dateien aus '${FOLDER}'..."
  cp -r "${SOURCE_PATH}"/* .

  # 4. Änderungen stagen
  git add -A

  # Prüfen, ob Änderungen vorliegen
  if git diff --cached --quiet; then
    echo "[!] Keine Änderungen erkannt – überspringe Commit für ${TAG}."
    continue
  fi

  # 5. Commit erstellen
  git commit -m "$COMMIT_MSG"

  # 6. Tag setzen (überschreibt alten Tag, falls bereits vorhanden)
  if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "[*] Aktualisiere bestehendes Tag '${TAG}'..."
    git tag -d "$TAG"
  fi
  git tag -a "$TAG" -m "Release ${TAG}: ${FOLDER}"

  # 7. Push nach GitHub
  echo "[*] Pushe Branch und Tag '${TAG}' nach GitHub..."
  git push origin "$CURRENT_BRANCH"
  git push origin "$TAG" --force

  echo "[+] ${TAG} erfolgreich committet und gepusht!"
  echo ""
  sleep 1
done

echo "================================================================="
echo "[OK] Alle Versionen (v3.0 bis v6.1) wurden erfolgreich übertragen!"
echo "================================================================="