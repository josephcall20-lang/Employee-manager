# This file is the entry point for the Render web service.
from api.index import app

if __name__ == "__main__":
    # This part is for local testing if needed, Render won't use it directly.
    app.run(host='0.0.0.0', port=5000)
