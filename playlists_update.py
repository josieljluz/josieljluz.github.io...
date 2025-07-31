import requests
import os
from datetime import datetime

# URLs das playlists (substitua pelas suas URLs reais)
PLAYLIST_URLS = [
    "epgbrasil.m3u": "http://m3u4u.com/m3u/3wk1y24kx7uzdevxygz7",
    "epgbrasil.xml.gz": "http://m3u4u.com/epg/3wk1y24kx7uzdevxygz7",
    "epgbrasilportugal.m3u": "http://m3u4u.com/m3u/782dyqdrqkh1xegen4zp",
    "epgbrasilportugal.xml.gz": "http://m3u4u.com/epg/782dyqdrqkh1xegen4zp",
    "epgportugal.m3u": "http://m3u4u.com/m3u/jq2zy9epr3bwxmgwyxr5",
    "epgportugal.xml.gz": "http://m3u4u.com/epg/jq2zy9epr3bwxmgwyxr5",
    "m3u@proton.me.m3u": "https://gitlab.com/josieljefferson12/playlists/-/raw/main/m3u4u_proton.me.m3u",
    "PiauiTV.m3u": "https://gitlab.com/josieljefferson12/playlists/-/raw/main/PiauiTV.m3u",
    "playlist.m3u": "https://gitlab.com/josieljefferson12/playlists/-/raw/main/playlist.m3u",
    "playlists.m3u": "https://gitlab.com/josielluz/playlists/-/raw/main/playlists.m3u",
    "pornstars.m3u": "https://gitlab.com/josieljefferson12/playlists/-/raw/main/pornstars.m3u"
]

def download_file(url, filename):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"✅ Arquivo baixado: {filename}")
        
        # Adiciona timestamp ao arquivo
        timestamp = datetime.now().strftime("# Atualizado em %d/%m/%Y - %H:%M:%S BRT\n")
        with open(filename, 'a') as f:
            f.write(timestamp)
            
    except Exception as e:
        print(f"❌ Erro ao baixar {url}: {e}")

def main():
    print("🔄 Iniciando atualização das playlists...")
    for url in PLAYLIST_URLS:
        filename = os.path.basename(url)
        download_file(url, filename)
    print("✅ Todas as playlists foram atualizadas!")

if __name__ == "__main__":
    main()
