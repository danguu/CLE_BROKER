# CLE_BROKER

**CLE_BROKER** es un sitio web informativo diseñado para representar a una corredora o asesoría financiera.
El proyecto está desarrollado íntegramente con **HTML**, **CSS** y **JavaScript**.

## Descripción general

Este sitio busca ofrecer una presencia digital moderna y responsiva para una empresa del sector financiero o de seguros.
Su estructura abarca las secciones fundamentales de un sitio corporativo:

* **Inicio:** presentación visual con información general y llamadas a la acción.
* **Servicios:** descripción de los productos o servicios ofrecidos.
* **Preguntas frecuentes (FAQ):** respuestas a las dudas comunes de los clientes.
* **Contacto:** formulario y medios de comunicación.
* **Sobre nosotros:** historia, misión y valores de la empresa.
* **CHATBOT:** que simula conversaciones humanas para automatizar tareas y dar soporte a usuarios. 

## Estructura del proyecto

```
CLE_BROKER/
- index.html                 # Página principal
- servicios.html             # Página de servicios
- faq.html                   # Preguntas frecuentes
- contacto.html              # Formulario y datos de contacto
- sobre-nosotros.html        # Información institucional

- css/
   - estilos.css            # Estilos globales
   - ...                    # Otros estilos específicos

- js/
   - main.js                # Funciones y scripts de interacción
   - ...                    # Archivos JS complementarios

- img/                       # Imágenes y recursos gráficos
- lib/                       # Librerías o dependencias opcionales
```

## Tecnologías utilizadas

| Tecnología       | Uso principal                            |
| ---------------- | ---------------------------------------- |
| **HTML**        | Estructura del contenido                 |
| **CSS**         | Diseño visual y responsive               |
| **JavaScript**   | Interactividad y comportamiento dinámico |
| **GitHub Pages y Python** | Hosting gratuito y despliegue automático |

## Ejecución del proyecto
El sitio está publicado y accesible directamente desde GitHub Pages.

**URL de acceso:** [https://danguu.github.io/CLE_BROKER/](https://danguu.github.io/CLE_BROKER/)

## Backend (FastAPI)

El proyecto ahora incluye un backend ligero construido con **FastAPI** para procesar el formulario de contacto y guardar los mensajes enviados por los usuarios.

### Requisitos previos

1. **Python 3.10 o superior** instalado en tu equipo.
2. **pip** (gestor de paquetes de Python).
3. Opcional pero recomendado: un entorno virtual creado con `python -m venv venv`.

### Instalación de dependencias

Desde la raíz del proyecto ejecuta los siguientes pasos:

```bash
python -m venv venv          # Opcional, pero recomendable
source venv/bin/activate     # En Windows usa: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### Ejecutar el servidor en desarrollo

Tienes tres alternativas equivalentes para iniciar el backend junto con los archivos estáticos:

1. Usar el script para Windows:

   ```bash
   run.bat
   ```

2. Usar el script para Linux/macOS:

   ```bash
   ./run.sh
   ```

3. Ejecutar directamente con Python/uvicorn:

   ```bash
   python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

Al iniciar el servidor se abrirá el navegador en `http://localhost:8000`. FastAPI servirá automáticamente el frontend y responderá a las solicitudes del formulario.

### Dónde se guardan los mensajes

Cada envío del formulario de contacto se almacena en `backend/data/messages.json`. El archivo se crea automáticamente y puedes inspeccionarlo para revisar el historial.

### API disponible

- `GET /api/health`: comprueba el estado del backend.
- `POST /api/contact`: recibe los datos del formulario y devuelve `OK` si todo fue correcto.
- `GET /api/contact`: lista los mensajes recibidos (ordenados del más reciente al más antiguo).

## Personalización

Puedes adaptar fácilmente el proyecto según tus necesidades:

* **Contenido:** edita los archivos `.html` para actualizar textos o imágenes.
* **Estilos:** modifica los colores, tipografías y tamaños en `css/estilos.css`.
* **Scripts:** agrega o ajusta funciones en `js/main.js` para ampliar interactividad.
* **Logos e íconos:** reemplaza los archivos en `img/` o usa SVG personalizados.
