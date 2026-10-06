import pandas as pd
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import re
import time
import socket
import ssl

# Liste der Straßennamen aus Ihrer Anfrage
addresses = [
    "ABC-Str.", "Alleestraße", "Bessemer Straße", "Westring", "Am Bremkamp",
    "Am Hahl im Welperschen Welperstr", "Am Hedtberg", "Hasenwinkeler Str.", 
    "Am Hohberg", "An der Maarbrücke", "Gahlensche Str.", "Auf dem Gericht",
    "Auf dem Jäger", "Bauernkamp", "Berthastr.", "Bessemerstraße", "Baarestraße",
    "Henry-Bessemer-Park", "Blumenfeldstr.", "Bonifatiusstr.", "Stockumer Str.",
    "Brückstraße", "Hans-Böckler-", "Franzstraße", "Castroper Hellweg", "Heinrichstr.",
    "Schwerinstr.", "Castroper Straße", "Stadionring", "I.Parallelstraße", "Centrumstraße",
    "Hansastraße", "Darpestraße", "A40", "Dachsweg", "Darpestr.", "Carolinienglückstraße",
    "Donnerbecke", "Wuppertaler Str.", "Lindener Str.", "Dorstener Str.", "Dinnendahlstr.",
    "Flaßkuhlstr.", "Freigrafendamm", "Immanuel-Kant-", "Liebfrauenstraße", "Fritz-Reuter-Str.",
    "Gabelsbergerstr.", "Hugo-Schultz-Str.", "Friederikastr.", "Günnigfelder Str.", "Aschenbruch",
    "Kirchstraße", "Kruppstraße", "Parkallee", "Gußstahlstaße", "Gustavstr.", "Hannoverstr.",
    "Harpener Hellweg", "Hauptstr.", "Heidackerstr.", "Herderallee", "Lessing-", "Bergstraße",
    "Herzogstr.", "Bergmannstraße", "Bleckstraße", "Hilligenstr.", "Hiltroper Landwehr",
    "Hordeler Heide", "Husemannplatz", "Viktoriastraße", "Im Großen Busch", "Imbuschplatz",
    "In der Schornau", "Karl-Arnold-Str.", "Karolinenstr.", "Keilstr.", "Königsallee",
    "Arnikastraße", "Wasserstraße", "Kretastraße", "Laerfeldstr.", "Alte Wittener Straße",
    "Am Kreuzacker", "Lütge Heide", "Lütkendorpweg", "Munscheider Damm", "Neveltalbrücke",
    "Muschelbank", "Neuflözstr.", "Nordring", "Schillerstr.", "Widumestr.", "Obernbaakstr.",
    "Rauendahlstr.", "Oberstr.", "Alte Bahnhofstr.", "Overdyker Str.", "Poststr.", "Ridderstr.",
    "Wilhelm-Leithe-Weg", "Ruhrstr.", "Rüsingstr.", "Vollmondstr.", "Saure Wiese", "Essener Straße",
    "Steinhagen", "Schattbachstr.", "Schinkelstr.", "Schluchtstr.", "Schoppenkampstr.",
    "Sechs-Brüder-Str.", "Spelbergs Busch", "Springorumtrasse", "Wasserstr.", "Springorumallee",
    "Glockengarten", "Goerdtstraße", "Steinhausstraße", "Parkstraße", "Blücherstraße",
    "USB Wertstoffhof", "Stennerskuhlstr.", "Stephanstr.", "Stiftstr.", "Breite Hille",
    "Veloroute", "Vierhausstr.", "Agnesstr", "Wielandstr.", "Voedestr.", "Vorm Felde",
    "Brockhauser Str.", "Waldstr.", "Weg am Kötterberg", "Hiltroper Str."
]
# Nominatim mit Timeout und besserer Fehlerbehandlung initialisieren
geolocator = Nominatim(
    user_agent="geo_cleaner",
    timeout=10,
    scheme='http'  # Manche Systeme haben Probleme mit https
)
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

def clean_address(addr):
    try:
        if pd.isna(addr):
            return ""
        
        addr = addr.strip()
        addr = re.sub(r"zwischen\s+([^,]+)\s+und\s+[^,]+", r"\1", addr, flags=re.IGNORECASE)
        addr = re.sub(r"\([^)]*\)", "", addr)
        addr = re.sub(r"\b(\d+)\s*[-–]\s*\d+\b", r"\1", addr)
        addr = re.sub(r"von\s+([^,]+)\s+bis\s+[^,]+", r"\1", addr, flags=re.IGNORECASE)
        addr = re.sub(r"\s{2,}", " ", addr)
        
        return f"{addr}, Bochum, Deutschland"
    except Exception as e:
        print(f"Fehler beim Bereinigen der Adresse '{addr}': {e}")
        return None

def get_coords(address, max_retries=3):
    for attempt in range(max_retries):
        try:
            cleaned_address = clean_address(address)
            if not cleaned_address:
                return (None, None)
                
            location = geocode(cleaned_address)
            if location:
                return (location.latitude, location.longitude)
            return (None, None)
            
        except (socket.timeout, ssl.SSLError) as e:
            print(f"Netzwerkfehler bei Adresse '{address}' (Versuch {attempt + 1}): {e}")
            time.sleep(2)  # Warte länger bei Netzwerkfehlern
        except Exception as e:
            print(f"Unerwarteter Fehler bei Adresse '{address}': {e}")
            return (None, None)
    return (None, None)

# Ergebnisse sammeln
results = []
total = len(addresses)

for i, address in enumerate(addresses, 1):
    print(f"\nVerarbeite Adresse {i}/{total}: {address}")
    lat, lon = get_coords(address)
    results.append({
        "Straßenname": address,
        "Koordinaten": (lat, lon)
    })
    print(f"Ergebnis: {lat}, {lon}")

    # Zwischenspeichern alle 10 Adressen
    if i % 10 == 0:
        df = pd.DataFrame(results)
        df.to_csv("strassen_koordinaten_partial.csv", index=False)
        print(f"\nZwischenspeicherung nach {i} Adressen")

# Finale Speicherung
df = pd.DataFrame(results)
df.to_csv("strassen_koordinaten_final.csv", index=False)
print("\nFertig! Ergebnisse in 'strassen_koordinaten_final.csv' gespeichert.")

# Ergebnisse ausgeben
for result in results:
    print(f"\n{result['Straßenname']}")
    print(f"{result['Koordinaten']}")