#!/usr/bin/env python3
"""Restore the original server-hub root proxy without touching /portfolio."""

from pathlib import Path
import sys


if len(sys.argv) != 2:
    raise SystemExit("usage: restore-serverhub-root.py <nginx-site-config>")

config_path = Path(sys.argv[1])
source = config_path.read_text(encoding="utf-8")

http_portfolio_root = """    location / {
        allow all;
        return 301 https://femicdev.de$request_uri;
    }
"""

https_portfolio_root = """    location ^~ /portfolio-assets/ {
        allow all;
        alias /var/www/portfolio/current/;
        expires 1y;
        add_header Cache-Control \"public, immutable\" always;
        add_header X-Content-Type-Options \"nosniff\" always;
    }

    location / {
        allow all;
        root /var/www/portfolio/current;
        try_files $uri $uri/ /index.html;

        add_header Cache-Control \"no-cache\" always;
        add_header Content-Security-Policy \"default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests\" always;
        add_header Cross-Origin-Opener-Policy \"same-origin\" always;
        add_header Permissions-Policy \"camera=(), geolocation=(), microphone=()\" always;
        add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;
        add_header X-Content-Type-Options \"nosniff\" always;
        add_header X-Frame-Options \"DENY\" always;
    }
"""

serverhub_root = """    location / {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_cache_bypass $http_upgrade;
    }
"""

if source.count(http_portfolio_root) != 1 or source.count(https_portfolio_root) != 1:
    raise SystemExit("refusing to restore: the expected temporary root handlers were not found exactly once")

restored = source.replace(http_portfolio_root, serverhub_root, 1)
restored = restored.replace(https_portfolio_root, serverhub_root, 1)
config_path.write_text(restored, encoding="utf-8")
