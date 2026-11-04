# Vizion

A visual UML editor for VS Code. Diagram classes, notes, frames and relationships on a canvas, saved as readable JSON.

## Features

- **Visual editing**: canvas with grid snapping, class/note/frame/shape nodes, and resizing.
- **Relations**: different routing styles, labels, multiplicities, and customizable endpoint shapes.
- **Inspector**: edit names, stereotypes, members, note content, and geometry.
- **Export**: save the diagram as PNG or copy it to the clipboard.
- **AI-friendly**: every document carries guidance that helps coding agents interpret and edit it safely.

![Vizion UML editor](screenshots/default.png)

## How to use

1. **Create a diagram**: Open an empty `.viz` file with `UML Editor - Vizon` or run `Vizion: New UML Diagram` from the Command Palette.
2. **Add elements**: right-click the canvas and choose **Add New**.
3. **Connect elements**: select an element and drag from its connect port to a target element; change the relation type in the Inspector.
4. **Edit**: double-click a node or label to edit it inline, or select it and use the Inspector on the right.
5. **Navigate**: drag the canvas to pan, use the mouse wheel to zoom, and drag or resize nodes with 20px grid snapping.
6. **Export**: right-click the canvas and choose **Export → as PNG** or **to Clipboard**.

The `.viz` file stays plain JSON. Use **Open With… → Text Editor** on the editor tab to inspect or edit it directly.

## Install

1. Download `vizion-0.3.0.vsix` below.
2. Open the Command Palette (**Ctrl+Shift+P**)
3. Select **Extensions: Install from VSIX...**
4. Select `vizion-0.3.0.vsix`

Or clone the project and run:

```bash
npm ci
npm run package
code --install-extension vizion-0.3.0.vsix
```


## Development

```bash
npm run typecheck
npm run check
npm test
npm run build
```

Then press **F5**, and open `.vizion/example.viz`.