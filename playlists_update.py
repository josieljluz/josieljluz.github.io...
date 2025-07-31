import requests
import os
from datetime import datetime

# URLs das playlists (substitua pelas suas URLs reais)
PLAYLIST_URLS = [
    "http://m3u4u.com/m3u/3wk1y24kx7uzdevxygz7",
    "http://m3u4u.com/epg/3wk1y24kx7uzdevxygz7",
    "http://m3u4u.com/m3u/782dyqdrqkh1xegen4zp",
    "http://m3u4u.com/epg/782dyqdrqkh1xegen4zp",
    "http://m3u4u.com/m3u/jq2zy9epr3bwxmgwyxr5",
    "http://m3u4u.com/epg/jq2zy9epr3bwxmgwyxr5",
    "https://gitlab.com/josieljefferson12/playlists/-/raw/main/m3u4u_proton.me.m3u",
    "https://gitlab.com/josieljefferson12/playlists/-/raw/main/PiauiTV.m3u",
    "https://gitlab.com/josieljefferson12/playlists/-/raw/main/playlist.m3u",
    "https://gitlab.com/josielluz/playlists/-/raw/main/playlists.m3u",
    "https://gitlab.com/josieljefferson12/playlists/-/raw/main/pornstars.m3u"
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
