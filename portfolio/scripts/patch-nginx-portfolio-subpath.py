#!/usr/bin/env python3
"""Add public /portfolio routes while preserving the femicdev.de server hub."""

from pathlib import Path
import sys


if len(sys.argv) != 2:
    raise SystemExit("usage: patch-nginx-portfolio-subpath.py <nginx-site-config>")

config_path = Path(sys.argv[1])
source = config_path.read_text(encoding="utf-8")
marker = "    # Homepage (docker on 3000)\n"

http_routes = """    # Public portfolio (static React app)
    location = /portfolio {
        allow all;
        return 301 https://femicdev.de/portfolio/;
    }

    location ^~ /portfolio/ {
        allow all;
        return 301 https://femicdev.de$request_uri;
    }

"""

https_routes = """    # Public portfolio (static React app)
    location = /portfolio {
        allow all;
        return 301 /portfolio/;
    }

    location ^~ /portfolio/assets/ {
        allow all;
        root /var/www/portfolio/current;
        expires 1y;
        add_header Cache-Control \"public, immutable\" always;
        add_header X-Content-Type-Options \"nosniff\" always;
    }

    location ^~ /portfolio/ {
        allow all;
        root /var/www/portfolio/current;
        try_files $uri $uri/ /portfolio/index.html;

        add_header Cache-Control \"no-cache\" always;
        add_header Content-Security-Policy \"default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests\" always;
        add_header Cross-Origin-Opener-Policy \"same-origin\" always;
        add_header Permissions-Policy \"camera=(), geolocation=(), microphone=()\" always;
        add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;
        add_header X-Content-Type-Options \"nosniff\" always;
        add_header X-Frame-Options \"DENY\" always;
    }

"""

if "# Public portfolio (static React app)" in source:
    raise SystemExit("refusing to patch: portfolio routes already exist")
if source.count(marker) != 2:
    raise SystemExit(f"refusing to patch: expected two homepage markers, found {source.count(marker)}")

before_first, after_first = source.split(marker, 1)
between, after_second = after_first.split(marker, 1)
patched = before_first + http_routes + marker + between + https_routes + marker + after_second
config_path.write_text(patched, encoding="utf-8")
