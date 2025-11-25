"""Aplicación backend sencilla para CLE_BROKER.

Este módulo expone una API REST mínima basada en Flask que permite
almacenar la información enviada desde los formularios del sitio web en
una base de datos SQLite.
"""

from __future__ import annotations

import os
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class TimestampMixin:
    """Mixin para agregar campos de auditoría básicos."""

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class ContactMessage(db.Model, TimestampMixin):
    __tablename__ = "contact_messages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50))
    subject = db.Column(db.String(255))
    message = db.Column(db.Text, nullable=False)
    preferred_channels = db.Column(db.String(255))


class NewsletterSubscription(db.Model, TimestampMixin):
    __tablename__ = "newsletter_subscriptions"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    requirements = db.Column(db.Text)


class WorkshopQuoteRequest(db.Model, TimestampMixin):
    __tablename__ = "workshop_quote_requests"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    topic = db.Column(db.String(120), nullable=False)


@dataclass
class ApiResponse:
    message: str
    data: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def _ensure_instance_dir(app: Flask) -> Path:
    instance_path = Path(os.environ.get("CLE_BROKER_INSTANCE", app.instance_path))
    instance_path.mkdir(parents=True, exist_ok=True)
    return instance_path


def create_app() -> Flask:
    """Crea y configura la aplicación Flask."""

    app = Flask(__name__)
    CORS(app)

    instance_path = _ensure_instance_dir(app)
    database_url = os.environ.get(
        "CLE_BROKER_DATABASE_URL", f"sqlite:///{instance_path / 'cle_broker.sqlite'}"
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

    register_routes(app)

    return app


def parse_request_json(required_fields: Iterable[str]) -> Dict[str, Any]:
    """Obtiene el JSON de la petición y valida los campos obligatorios."""

    if not request.is_json:
        return {}

    payload: Dict[str, Any] = request.get_json(force=True) or {}

    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        raise ValueError(f"Faltan campos obligatorios: {', '.join(missing)}")

    return payload


def normalise_multi_value(raw_value: Any) -> List[str]:
    """Convierte un valor recibido desde el formulario en una lista de strings."""

    if raw_value is None:
        return []
    if isinstance(raw_value, str):
        return [part.strip() for part in raw_value.split(",") if part.strip()]
    if isinstance(raw_value, (list, tuple)):
        return [str(item) for item in raw_value if str(item).strip()]
    return [str(raw_value)]


def register_routes(app: Flask) -> None:
    """Registra las rutas de la API."""

    @app.get("/api/health")
    def health_check() -> Any:
        return jsonify(status="ok"), 200

    @app.post("/api/contact")
    def create_contact_message() -> Any:
        try:
            payload = parse_request_json(["name", "email", "message"])
        except ValueError as exc:
            return jsonify(error=str(exc)), 400

        preferred_channels = ",".join(normalise_multi_value(payload.get("preferred")))

        message = ContactMessage(
            name=payload.get("name"),
            email=payload.get("email"),
            phone=payload.get("phone"),
            subject=payload.get("subject"),
            message=payload.get("message"),
            preferred_channels=preferred_channels,
        )
        db.session.add(message)
        db.session.commit()

        response = ApiResponse(
            message="Solicitud registrada correctamente.",
            data={"id": message.id},
        )
        return jsonify(response.to_dict()), 201

    @app.post("/api/newsletter")
    def create_newsletter_subscription() -> Any:
        try:
            payload = parse_request_json(["name", "email"])
        except ValueError as exc:
            return jsonify(error=str(exc)), 400

        subscription = NewsletterSubscription(
            name=payload.get("name"),
            email=payload.get("email"),
            requirements=payload.get("requirements"),
        )
        db.session.add(subscription)
        db.session.commit()

        response = ApiResponse(
            message="Suscripción registrada. ¡Gracias por escribirnos!",
            data={"id": subscription.id},
        )
        return jsonify(response.to_dict()), 201

    @app.post("/api/workshops")
    def create_workshop_quote() -> Any:
        try:
            payload = parse_request_json(["name", "phone", "subject"])
        except ValueError as exc:
            return jsonify(error=str(exc)), 400

        quote = WorkshopQuoteRequest(
            name=payload.get("name"),
            phone=payload.get("phone"),
            topic=payload.get("subject"),
        )
        db.session.add(quote)
        db.session.commit()

        response = ApiResponse(
            message="Solicitud de cotización recibida.",
            data={"id": quote.id},
        )
        return jsonify(response.to_dict()), 201


app = create_app()


if __name__ == "__main__":  # pragma: no cover - ejecución directa
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
