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

## Backend API

El repositorio ahora incluye un backend completo (carpeta `src/`) que expone endpoints REST para formularios, contenidos turísticos y autenticación administrativa sin modificar el frontend existente. Revisa [`README_BACKEND.md`](README_BACKEND.md) para detalles de despliegue, variables de entorno y ejemplos de integración mediante `fetch()`.
