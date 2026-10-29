"""
Simple Local HTTP Server for Kapish Rawat's Portfolio Website.
Automatically finds an available port, serves the directory, and launches your browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean logging
        print(f"[HTTP] {self.address_string()} - {format % args}")

def run_server():
    global PORT
    while PORT < 8100:
        try:
            with socketserver.TCPServer(("", PORT), Handler) as httpd:
                url = f"http://localhost:{PORT}"
                print("=" * 60)
                print(f"🚀 Kapish Rawat's Portfolio is running locally!")
                print(f"🌐 URL: {url}")
                print(f"📁 Root: {DIRECTORY}")
                print(f"💡 Press Ctrl+C in terminal to stop server.")
                print("=" * 60)
                
                # Open browser
                webbrowser.open(url)
                httpd.serve_forever()
                break
        except OSError:
            PORT += 1

if __name__ == "__main__":
    try:
        run_server()
    except KeyboardInterrupt:
        print("\n[+] Server stopped successfully.")
        sys.exit(0)

