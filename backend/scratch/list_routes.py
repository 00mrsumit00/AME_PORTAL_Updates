
from server import app
for route in app.routes:
    print(f"{getattr(route, 'methods', 'ANY')} {route.path}")
