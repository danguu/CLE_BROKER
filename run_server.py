"""Convenience launcher for the FastAPI backend."""

import webbrowser

import uvicorn


def main() -> None:
    port = 8000
    webbrowser.open(f"http://localhost:{port}")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)


if __name__ == "__main__":
    main()
