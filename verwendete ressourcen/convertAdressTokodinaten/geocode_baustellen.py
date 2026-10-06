import csv
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import re
import time

# Geokodierung initialisieren
geolocator = Nominatim(user_agent="bochum_baustellen_advanced")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

def split_zwischen(address):
    """Erkennt 'zwischen X und Y' und gibt Einzeladressen zurück"""
    match = re.search(r"zwischen (.+?) und (.+)", address)
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return None, None

def get_coordinates(address):
    """Holt Koordinaten für eine einzelne Adresse"""
    try:
        location = geocode(f"{address}, Bochum, Deutschland")
        return (location.longitude, location.latitude) if location else (None, None)
    except Exception as e:
        print(f"Fehler bei {address}: {e}")
        return None, None

# CSV-Verarbeitung
input_file = "adressen.csv"
output_file = "baustellen_bochum_advanced.csv"

with open(input_file, mode="r", encoding="utf-8") as infile, \
     open(output_file, mode="w", encoding="utf-8", newline="") as outfile:

    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames + [
        "start_lon", "start_lat", 
        "end_lon", "end_lat",
        "is_route"  # Markiert ob es sich um eine Strecke handelt
    ]
    
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        address = row["strasse"]
        start, end = split_zwischen(address)

        if start and end:  # Falls "zwischen X und Y" erkannt wurde
            # Geokodiere beide Punkte
            start_lon, start_lat = get_coordinates(start)
            end_lon, end_lat = get_coordinates(end)
            time.sleep(1)  # Rate-Limiting

            # Neue Felder hinzufügen
            row.update({
                "start_lon": start_lon,
                "start_lat": start_lat,
                "end_lon": end_lon,
                "end_lat": end_lat,
                "is_route": True,
                "original_address": address  # Originaladresse behalten
            })
        else:  # Normale Adresse
            lon, lat = get_coordinates(address)
            row.update({
                "start_lon": lon,
                "start_lat": lat,
                "end_lon": None,
                "end_lat": None,
                "is_route": False,
                "original_address": address
            })

        # Nur definierte Felder schreiben
        writer.writerow({k: v for k, v in row.items() if k in fieldnames})
        print(f"Verarbeitet: {address}")

print("Fertig! Ergebnisse in", output_file)