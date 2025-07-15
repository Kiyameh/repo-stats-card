# 📊 GitHub Stats Card

Un paquete de npm ligero y sin dependencias que permite mostrar una tarjeta con estadísticas de un repositorio de GitHub en cualquier página web.

## ✨ Características

- **🚀 Sin dependencias**: Funciona únicamente con APIs nativas del navegador
- **🎨 Estilo autocontenido**: CSS inyectado automáticamente, no interfiere con estilos existentes
- **📱 Responsivo**: Se adapta a diferentes tamaños de pantalla
- **⚡ Ligero**: Solo JavaScript vanilla con ES Modules
- **🛡️ Manejo de errores**: Muestra mensajes de error elegantes cuando algo falla

## 📦 Instalación

```bash
npm install github-repo-stats-card
```

## 🚀 Uso Básico

### HTML

```html
<div id="github-card"></div>
```

### JavaScript

```javascript
import {createRepoCard} from 'github-repo-stats-card'

// Muestra las estadísticas del repositorio de Vue.js
createRepoCard('#github-card', 'vuejs/vue')
```

## 📋 Parámetros

### `createRepoCard(selector, repoName)`

- **`selector`** (string): Selector CSS del elemento contenedor donde se mostrará la tarjeta
- **`repoName`** (string): Nombre del repositorio en formato `'usuario/nombre-del-repo'`

## 📊 Estadísticas Mostradas

La tarjeta muestra las siguientes estadísticas del repositorio:

- ⭐ **Estrellas** (Stargazers)
- 🍴 **Forks**
- ❗ **Issues abiertos**
- 📝 **Descripción** del repositorio
- 🔗 **Enlace directo** al repositorio en GitHub

## 🎨 Personalización

El paquete inyecta automáticamente los estilos CSS necesarios. Los estilos están encapsulados en la clase `.github-stats-card` para evitar conflictos con tu CSS existente.

### Estructura HTML Generada

```html
<div class="github-stats-card">
  <div class="card-header">
    <h3 class="repo-name">
      <a href="...">usuario/repositorio</a>
    </h3>
    <p class="repo-description">Descripción del repositorio</p>
  </div>

  <div class="card-stats">
    <div class="stat-item">
      <span class="stat-icon">⭐</span>
      <span class="stat-value">1,234</span>
      <span class="stat-label">Estrellas</span>
    </div>
    <!-- Más estadísticas... -->
  </div>

  <div class="card-footer">
    <a
      href="..."
      class="view-repo-btn"
      >Ver en GitHub →</a
    >
  </div>
</div>
```

## 🔧 Ejemplos de Uso

### Múltiples Tarjetas

```javascript
import {createRepoCard} from 'github-repo-stats-card'

// Crear varias tarjetas
createRepoCard('#vue-card', 'vuejs/vue')
createRepoCard('#react-card', 'facebook/react')
createRepoCard('#angular-card', 'angular/angular')
```

### Con Manejo de Errores

```javascript
import {createRepoCard} from 'github-repo-stats-card'

try {
  await createRepoCard('#my-card', 'usuario/repositorio')
} catch (error) {
  console.error('Error al cargar la tarjeta:', error)
}
```

## 🛠️ Desarrollo Local

1. Clona el repositorio
2. Instala las dependencias (si las hay)
3. Abre `index.html` en tu navegador para ver la demostración

## 📝 API de GitHub

Este paquete utiliza la [API pública de GitHub](https://docs.github.com/en/rest/reference/repos#get-a-repository) para obtener las estadísticas del repositorio. No requiere autenticación para repositorios públicos.

**Límites de la API:**

- 60 requests por hora para IPs no autenticadas
- Para mayor límite, considera usar un token de GitHub

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir mejoras.

## 📄 Licencia

MIT License - ver el archivo LICENSE para más detalles.

## 🙏 Agradecimientos

- [GitHub API](https://docs.github.com/en/rest) por proporcionar los datos
- La comunidad de desarrolladores por las ideas y feedback

---

**¿Te gustó este paquete? ¡Dale una ⭐ en GitHub!**
