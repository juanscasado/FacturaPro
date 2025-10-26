# Guía de CSS Profesional - FacturaPro RD

## Colores Principales

```css
--color-primary: #1e40af;        /* Azul profesional */
--color-secondary: #059669;      /* Verde esmeralda */
--color-accent: #dc2626;         /* Rojo limpio */
```

## Clases de Utilidad

### Botones
- `btn-primary` - Botón principal (azul degradado)
- `btn-secondary` - Botón secundario (verde degradado)
- `btn-outline` - Botón con borde transparente

### Tarjetas y Contenedores
- `card` - Tarjeta profesional con sombra y hover
- `bg-main` - Fondo principal con degradado sutil

### Typography
- `title-main` - Título principal (2.5rem, peso 800)
- `subtitle` - Subtítulo descriptivo
- `section-title` - Título de sección (1.5rem, peso 700)

### Layout
- `App-main` - Contenedor principal con max-width
- `content-section` - Sección de contenido con espaciado
- `section-header` - Header centrado para secciones
- `grid-layout` - Sistema de grid responsive
  - `grid-1`, `grid-2`, `grid-3` - Variantes de columnas

### Formularios
- `form-input` - Input estilizado con focus states
- `form-label` - Label consistente para formularios

### Estados
- `status-success` - Badge de éxito (verde)
- `status-error` - Badge de error (rojo)  
- `status-warning` - Badge de advertencia (amarillo)

### Navegación
- `nav-link` - Enlaces de navegación con hover
- `loading-spinner` - Animación de carga

### Animaciones
- `fade-in` - Entrada suave con opacidad
- `slide-in` - Deslizamiento lateral

## Ejemplo de Uso

```jsx
<div className="content-section fade-in">
  <div className="section-header">
    <h1 className="title-main">Mi Página</h1>
    <p className="subtitle">Descripción de la funcionalidad</p>
  </div>
  
  <div className="grid-layout grid-2">
    <div className="card">
      <h3 className="section-title">Sección 1</h3>
      <button className="btn-primary">Acción</button>
    </div>
    
    <div className="card">
      <h3 className="section-title">Sección 2</h3>
      <button className="btn-secondary">Acción Secundaria</button>
    </div>
  </div>
</div>
```

## Responsive Design

Todos los componentes son responsive por defecto:
- Desktop: Layout completo con grids
- Tablet: Adaptación automática de columnas
- Mobile: Stack vertical con botones full-width

## Mejores Prácticas

1. **Consistencia**: Usa las clases predefinidas antes que CSS custom
2. **Accesibilidad**: Todos los botones tienen estados de focus
3. **Performance**: Las animaciones usan `transform` para mejor rendimiento
4. **Flexibilidad**: El sistema de grid se adapta automáticamente al contenido