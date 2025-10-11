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

##  Ejecución local con Python

En Windows:

```bash
run.bat
```

En Linux / macOS:

```bash
./run.sh
```

Ambos scripts lanzan el servidor y abren el navegador de forma automática.

## Personalización

Puedes adaptar fácilmente el proyecto según tus necesidades:

* **Contenido:** edita los archivos `.html` para actualizar textos o imágenes.
* **Estilos:** modifica los colores, tipografías y tamaños en `css/estilos.css`.
* **Scripts:** agrega o ajusta funciones en `js/main.js` para ampliar interactividad.
* **Logos e íconos:** reemplaza los archivos en `img/` o usa SVG personalizados.

## Backend: API y base de datos

El proyecto ahora incluye un backend opcional para almacenar la información
recogida desde los formularios (contacto, newsletter y cotización de
talleres) en una base de datos SQLite.

### Requisitos previos

* **Python 3.10 o superior.** Verifica tu versión con `python --version`.
* (Opcional pero recomendado) **Entorno virtual** para aislar dependencias.

### Instalación paso a paso

1. **Crear y activar un entorno virtual**

   ```bash
   python -m venv .venv
   # Windows
   .\.venv\Scripts\activate
   # macOS / Linux
   source .venv/bin/activate
   ```

2. **Instalar dependencias del backend**

   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Iniciar la API**

   ```bash
   python backend/app.py
   ```

   Por defecto quedará escuchando en `http://localhost:8000` y creará el
   archivo de base de datos `backend/instance/cle_broker.sqlite` la primera
   vez que se ejecute.

4. **Ejecutar el sitio estático (opcional)**

   En otra terminal puedes usar los scripts existentes para ver el sitio
   mientras el backend está activo:

   ```bash
   ./run.sh
   # o en Windows
   run.bat
   ```

### Endpoints disponibles

| Método | Ruta              | Descripción                                    |
| ------ | ----------------- | ---------------------------------------------- |
| GET    | `/api/health`     | Verificación rápida del estado del backend.   |
| POST   | `/api/contact`    | Registra un mensaje del formulario de contacto.|
| POST   | `/api/newsletter` | Guarda solicitudes del formulario de inicio.  |
| POST   | `/api/workshops`  | Registra solicitudes de cotización de talleres.|

Cada petición devuelve un mensaje de confirmación y el identificador del
registro creado dentro de la base de datos.

### Configuración del frontend

El archivo `js/app-config.js` define la variable `apiBaseUrl`. Si despliegas
el backend en otra URL o puerto, actualiza este valor para que los
formularios sigan apuntando correctamente a la API.
