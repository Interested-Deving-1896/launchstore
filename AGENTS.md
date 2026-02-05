# AGENTS.md

> **Important:** This file must be kept up-to-date. When the user provides new rules or makes significant codebase
> changes, update this file accordingly.

## Project Overview

**LaunchStore** is a GTK4/Libadwaita desktop application built with Deno that provides a unified interface for managing
and discovering Linux applications. It aims to make app management accessible to everyday users by consolidating
Flatpak, AppImage, and Distrobox applications into one place.

### Key Features (Current & Planned)

- Browse and manage user and system launchers (`.desktop` files)
- AppImage management with portable home folder support
- Distrobox container integration
- Launcher editing and startup launcher management
- Settings window with appearance preferences

## Tech Stack

- **Runtime:** Deno
- **UI Framework:** GTK4 with Libadwaita (via GObject Introspection bindings)
- **Language:** TypeScript
- **GIR Bindings:** `@girs/*` packages from `gir.deno.dev`

## Project Structure

```
src/
├── app.ts              # Application entry point, main window setup
├── constants.ts        # Global constants (HOME, PATH, SPACING)
├── components/         # Reusable UI components
│   ├── ContainerBox.ts
│   ├── LauncherItemBox.ts
│   ├── MoreBox.ts
│   ├── Page.ts
│   └── TitlesAndIconBox.ts
├── pages/              # Full page views
│   ├── HomePage.ts
│   ├── InstallAppImagePage.ts
│   ├── LauncherPage.ts
│   ├── LauncherRawPage.ts
│   └── StartupLauncherPage.ts
├── windows/            # Secondary windows
│   └── SettingsWindow.ts
├── libs/               # Core libraries and utilities
│   ├── desktop.ts      # .desktop file parser
│   ├── launchers.ts    # Launcher detection and management
│   ├── signals.ts      # Reactive signal system (similar to Svelte stores)
│   └── utils/          # Utility functions
│       ├── bind.ts     # GTK widget lifecycle binding
│       ├── buttonClass.ts
│       ├── coroutine.ts # Generator-based async with GLib integration
│       ├── format.ts
│       ├── gtk.ts
│       ├── markup.ts
│       ├── size.ts
│       └── try.ts
└── data/               # (Reserved for data files)
```

## Coding Conventions

### Imports

- **Always use absolute imports with the `~/` alias** - never use relative imports (`./` or `../`)
- The `~/` alias maps to the project root as defined in `deno.json`
- Example: `import { SPACING } from "~/constants.ts";`

### Code Style

- Use **tabs** for indentation (indent width: 4)
- Line width: **120 characters**
- Always include `.ts` extension in imports
- Use TypeScript strict mode with `noUncheckedIndexedAccess`

### Component Patterns

- Components are **factory functions** that return GTK widgets or composite objects
- Pages return a `Page` type with `{ host: Gtk.ScrolledWindow, container: Gtk.Box }`
- Use the custom `Sync` signal system for reactive state management
- Use `bind()` utility for widget lifecycle management (realize/unrealize)
- Use `coroutine()` with `timeout()` for async operations integrated with GLib main loop

### GTK/Adwaita Conventions

- Initialize Adw with `Adw.init()` before creating widgets
- Use `Adw.Application` as the app base
- Use `Adw.NavigationView` for navigation stack
- Use `Adw.ViewStack` with `ViewSwitcherTitle`/`ViewSwitcherBar` for tab-like views
- Apply consistent spacing using the `SPACING` constant (12px)

## Running the Project

```bash
# Run in development
deno task start

# Compile to binary
deno task compile
```

## Key Abstractions

### Signal System (`libs/signals.ts`)

A reactive state management system similar to Svelte stores:

- `sync<T>(starter)` - Creates a signal with start/stop lifecycle
- `computed(() => ...)` - Creates a derived signal
- Signals are lazy - they only run when followed

### Coroutines (`libs/utils/coroutine.ts`)

Generator-based async that integrates with GLib's main loop:

```typescript
coroutine(function* () {
	while (true) {
		doSomething();
		yield timeout(250); // Wait 250ms using GLib
	}
});
```

### Desktop File Parser (`libs/desktop.ts`)

Parses `.desktop` files into a structured format:

```typescript
type DesktopFile = Record<string, Record<string, string>>;
```

## Agent Instructions

1. **Keep this file updated** - When the user provides new rules, conventions, or makes architectural changes, update
   the relevant sections of this document.

2. **Follow import conventions strictly** - Always use `~/...` paths, never relative imports.

3. **Match existing patterns** - Study existing components before creating new ones to maintain consistency.

4. **Use the signal system** - For reactive state, use the custom `Sync`/`computed` system, not external libraries.

5. **Respect GTK lifecycle** - Use `bind()` for cleanup when widgets are realized/unrealized.

6. **Test changes** - Run `deno task start` to verify changes work correctly.
