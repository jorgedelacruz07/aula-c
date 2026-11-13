#!/usr/bin/env python3
"""Servidor local de la plataforma y fuentes didácticas del repositorio."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import argparse

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"


class StudyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB), **kwargs)

    def translate_path(self, path):
        request_path = unquote(urlsplit(path).path)
        for prefix, directory in (("/ejercicios/", ROOT / "ejercicios"), ("/pruebas/", ROOT / "pruebas")):
            if request_path.startswith(prefix):
                candidate = (directory / request_path[len(prefix):]).resolve()
                try:
                    candidate.relative_to(directory.resolve())
                except ValueError:
                    return str(directory / "__not_found__")
                return str(candidate)
        return super().translate_path(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), StudyHandler)
    print(f"Plataforma 1INF01 disponible en http://localhost:{args.port} (solo acceso local)", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
