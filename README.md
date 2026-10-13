# JJFF · Portal de recursos

Web estática para centralizar los recursos de las **XV Jornadas Formativas** del Consejo de Estudiantes de la EHU.

## Publicación en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo, `jjff-recursos`).
2. Sube **todo el contenido de esta carpeta a la raíz** del repositorio.
3. En GitHub entra en `Settings → Pages`.
4. En `Build and deployment`, selecciona `Deploy from a branch`.
5. Selecciona `main` y la carpeta `/ (root)` y guarda.
6. GitHub mostrará la URL pública cuando termine el despliegue.

No necesita npm, Node, React ni proceso de compilación.

## Dónde se edita cada cosa

La mayor parte del contenido dinámico está en:

`assets/js/data.js`

Ahí puedes cambiar:

- metadatos generales de las jornadas;
- horario;
- personas responsables de cada formación;
- enlaces a Canva;
- enlaces a OneDrive;
- documentos y estados (pendiente/listo);
- normas de las presentaciones.

### Añadir un enlace real

Los enlaces que todavía no tenemos aparecen como `href: "#"` o `canva: "#"` y con `status: "pending"`.

Cuando exista el enlace, sustitúyelo y cambia el estado a `ready`.

Ejemplo:

```js
{
  title: "Escaleta general",
  href: "https://...",
  provider: "OneDrive",
  access: "restricted",
  status: "ready"
}
```

## Privacidad

El repositorio está pensado para **no contener datos personales**. Los listados o recursos internos deben permanecer en Canva/OneDrive con permisos restringidos. La web puede enlazarlos, pero no debe copiar su contenido al repositorio.

## Estructura

```text
/
├── index.html
├── horario.html
├── ponencias.html
├── presentaciones.html
├── documentos.html
├── info.html
├── 404.html
├── assets/
│   ├── css/styles.css
│   ├── js/data.js
│   ├── js/site.js
│   └── img/favicon.svg
└── README.md
```

## Nota sobre las reglas de presentaciones

Las reglas incluidas se han trasladado del documento de instrucciones disponible: portada común, plantilla asignada, paleta propia, EHUSans y coherencia visual. El documento de origen menciona una edición anterior, por lo que conviene revisar únicamente cualquier referencia nominal a la edición antes de publicar material definitivo.


## Administración de enlaces

La página `admin.html` permite cambiar enlaces de Canva y OneDrive sin editar archivos a mano. Para guardar cambios necesita un **fine-grained personal access token** de GitHub limitado al repositorio `2026JJFF` con permiso **Contents: Read and write**. El token se introduce en cada sesión y no se guarda en el repositorio.

URL una vez publicado: `https://inigougedoehu-ai.github.io/2026JJFF/admin.html`
