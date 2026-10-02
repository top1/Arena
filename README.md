# Moss & Metal

A small, playable solar-punk RPG prototype about Ari and Pip, his pocket-sized robot companion. Explore a top-down woodland, gather field finds, gently bonk curious creatures and guardians, program Pip's night route, then collect his overnight haul and grow your home.

## Play

Serve this folder with any static web server. For example:

```sh
python3 -m http.server 4173 --bind 0.0.0.0
```

Open the served page in a browser. No build step or dependencies are required.

## Controls

- **WASD / arrow keys** — walk; **tap or click the field** to walk there
- **E** — gather a nearby field find
- **Space** — gentle bonk a nearby creature or guardian
- **I** — open Ari's satchel; **H** — visit the home workshop
- **Head home & send Pip** — fast-forward through the night shift and reveal the haul

Choose Pip's stops on the right before dusk. The Sunken Orchard is open from the start; befriend Mossback to unlock Emberfen Rise. The prototype is built with vanilla HTML, CSS and Canvas; progress is session-only.
