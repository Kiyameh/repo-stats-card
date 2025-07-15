# Archivo: Objectives.md

## 1\. Resumen del Proyecto

El objetivo es crear un **paquete de npm ligero y sin dependencias** que permita a cualquier usuario web mostrar una tarjeta (card) con estadísticas de un repositorio de GitHub. El paquete será programado en **HTML, CSS y JavaScript (ES Modules)**. Una función de JavaScript se encargará de obtener los datos de la API de GitHub y renderizar la tarjeta en un elemento específico del DOM.

---

## 2\. Funcionalidad Principal

El paquete debe exportar una única función asíncrona, por ejemplo `createRepoCard(selector, repoName)`.

- `selector` (string): Un selector CSS (ej: `'#mi-div'`) que apunta al elemento contenedor donde se inyectará la tarjeta.
- `repoName` (string): El nombre del repositorio en formato `'usuario/nombre-del-repo'` (ej: `'facebook/react'`).

La función debe:

1.  Realizar una petición `fetch` a la API pública de GitHub (`https://api.github.com/repos/{repoName}`).
2.  Procesar la respuesta JSON para extraer las estadísticas clave.
3.  Generar dinámicamente el HTML para la tarjeta.
4.  Inyectar los estilos CSS necesarios en el `<head>` del documento para asegurar que la tarjeta se vea bien de forma aislada.
5.  Insertar el HTML de la tarjeta dentro del elemento contenedor especificado.
6.  Manejar errores de forma elegante (ej: si el repositorio no existe o la API falla).

---

## 3\. Características Clave

- **Sin dependencias externas**: Debe funcionar únicamente con las APIs nativas del navegador (Fetch API, DOM Manipulation).
- **Estadísticas a mostrar**: La tarjeta debe mostrar como mínimo:
  - Nombre del repositorio (enlazado a su URL de GitHub).
  - ⭐ Estrellas (Stargazers).
  - 🍴 Forks.
  - ❗ Issues abiertos.
- **Estilo autocontenido**: El CSS debe estar encapsulado o ser inyectado por el script para no interferir con los estilos de la página del usuario y para que la tarjeta funcione "out-of-the-box".
- **Responsivo**: El diseño de la tarjeta debe ser simple y adaptarse a diferentes anchos de pantalla.

---

## 4\. Pila Tecnológica

- **Lenguaje**: JavaScript (ECMAScript 6+), usando `async/await` y `fetch`.
- **Maquetación**: HTML5.
- **Estilos**: CSS3.
- **Módulos**: ES Modules (`import`/`export`).

---

## 5\. Estructura de Archivos del Proyecto

El AI debe generar la siguiente estructura de archivos:

```
github-repo-stats-card/
├── index.js          # Lógica principal, llamadas a la API y manipulación del DOM.
├── package.json      # Metadatos del paquete.
├── index.html        # Archivo de demostración para pruebas locales.
└── README.md         # Documentación del proyecto.
```

---

## 6\. Pasos para el Desarrollo

1.  **Inicializar `package.json`**: Crear el archivo `package.json` con los siguientes campos clave:

    - `"name"`: `github-repo-stats-card`.
    - `"version"`: `"1.0.0"`.
    - `"description"`: "Un paquete simple para mostrar una tarjeta de estadísticas de un repositorio de GitHub."
    - `"main"`: `"index.js"`.
    - `"type"`: `"module"`.
    - `"license"`: `"MIT"`.

2.  **Desarrollar `index.js`**:

    - Crear y exportar la función `async function createRepoCard(selector, repoName)`.
    - Dentro de la función, validar que `selector` y `repoName` son proporcionados.
    - Usar un bloque `try...catch` para manejar las peticiones y errores.
    - Implementar la llamada `fetch` a `https://api.github.com/repos/${repoName}`.
    - Si la respuesta no es `ok` (`!response.ok`), lanzar un error.
    - Extraer los datos necesarios del JSON: `name`, `html_url`, `stargazers_count`, `forks_count`, `open_issues_count`.
    - Crear una función interna `generateHTML(stats)` que devuelva un string con el HTML de la tarjeta.
    - Crear una función `injectCSS()` que cree una etiqueta `<style>` con el CSS de la tarjeta y la añada al `<head>`. Debe comprobar si ya ha sido añadida para no duplicarla.
    - Localizar el elemento contenedor con `document.querySelector(selector)`.
    - Llamar a `injectCSS()` y luego establecer el `innerHTML` del contenedor con el HTML generado.
    - En el bloque `catch`, mostrar un mensaje de error en el contenedor.

3.  **Diseñar el CSS (dentro de `injectCSS()` en `index.js`)**:

    - El estilo debe ser simple y profesional.
    - Usar una clase principal (ej: `.github-stats-card`) para encapsular los estilos.
    - Utilizar Flexbox para alinear los elementos internos.
    - Definir un `font-family` genérico (ej: `sans-serif`).
    - Asegurar que los enlaces tengan un estilo claro.

4.  **Crear `index.html` para Pruebas**:

    - Un HTML básico con un `<div>` (ej: `<div id="card-container"></div>`).
    - Incluir un script de tipo módulo: `<script type="module">`.
    - Dentro del script, importar la función desde `./index.js` y llamarla con datos de prueba:
      ```javascript
      import {createRepoCard} from './index.js'
      createRepoCard('#card-container', 'torvalds/linux')
      ```

5.  **Generar `README.md`**:

    - Incluir el nombre del proyecto, una descripción, instrucciones de instalación (`npm install ...`) y un ejemplo de uso claro (tanto el HTML como el JavaScript que el usuario final debe escribir).

---

## 7\. Ejemplo de Uso Final (para el README.md)

**HTML:**

```html
<div id="github-card"></div>
```

**JavaScript:**

```javascript
import {createRepoCard} from 'github-repo-stats-card'

// Muestra las estadísticas del repositorio de Vue.js
createRepoCard('#github-card', 'vuejs/vue')
```
