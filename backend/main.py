"""Backend application for CLE_BROKER."""
from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from pydantic import EmailStr

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
MESSAGES_FILE = DATA_DIR / "messages.json"

CONTACT_LOCK = asyncio.Lock()

app = FastAPI(
    title="CLE Broker Backend",
    description=(
        "API mínima para manejar envíos del formulario de contacto y servir "
        "los archivos estáticos del proyecto CLE_BROKER."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def _read_messages() -> List[dict]:
    if not MESSAGES_FILE.exists():
        return []
    try:
        return json.loads(MESSAGES_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:  # pragma: no cover - defensive guard
        raise HTTPException(status_code=500, detail="No se pudo leer el historial de mensajes") from exc


async def _store_message(entry: dict) -> None:
    async with CONTACT_LOCK:
        messages = await _read_messages()
        messages.append(entry)
        MESSAGES_FILE.write_text(json.dumps(messages, ensure_ascii=False, indent=2), encoding="utf-8")


@app.get("/api/health", response_class=JSONResponse)
async def healthcheck() -> dict:
    """Endpoint de verificación simple."""
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/contact", response_class=JSONResponse)
async def list_contact_messages() -> List[dict]:
    """Devuelve el historial de mensajes recibidos."""
    messages = await _read_messages()
    return messages[::-1]


@app.post("/api/contact", response_class=PlainTextResponse)
async def submit_contact(
    name: str = Form(..., min_length=1),
    email: EmailStr = Form(...),
    phone: str = Form("") ,
    subject: str = Form(""),
    message: str = Form(..., min_length=1),
    preferred: Optional[List[str]] = Form(None),
) -> str:
    """Recibe la información del formulario de contacto."""
    normalized_preferences = sorted({pref.strip().lower() for pref in (preferred or []) if pref.strip()})
    entry = {
        "name": name.strip(),
        "email": str(email),
        "phone": phone.strip(),
        "subject": subject.strip(),
        "message": message.strip(),
        "preferred": normalized_preferences,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    await _store_message(entry)
    return "OK"


app.mount("/", StaticFiles(directory=str(BASE_DIR), html=True), name="static")
