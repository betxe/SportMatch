# SportMatch — pantallas y subpantallas

Las seis vistas del prototipo. Las cajas grandes son pantallas. Las cajas de dentro son subpantallas: se abren encima, sin cambiar de ruta.

## Jerarquía

```mermaid
flowchart TB
  APP["SportMatch"]

  APP --> V1
  APP --> TABS
  APP --> V3
  APP --> V4

  V1["V1 · Create Player Card<br/>primera vez y al editar"]
  V1 --> V1A["Name y Age"]
  V1 --> V1B["Sports you play<br/>Beg. / Int. / Adv."]
  V1 --> V1C["NEXT"]

  TABS["Barra inferior"]
  TABS --> V2
  TABS --> V5
  TABS --> V6

  V2["V2 · Home<br/>Noticeboard feed"]
  V2 --> V2A["Filtros<br/>All · Basketball · Football · Near Me"]
  V2 --> V2B["Tarjetas de Session"]
  V2 --> V2C["Reminders"]
  V2 --> V2D["Different level<br/>Join anyway?"]
  V2 --> V2E["Add Sport"]

  V3["V3 · Session<br/>Lineup Sheet"]
  V3 --> V3A["Meeting point<br/>pin y Open in Maps"]
  V3 --> V3B["Lineup Sheet<br/>huecos numerados"]
  V3 --> V3C["Session Chat"]
  V3 --> V3D["Leave Session"]
  V3 --> V3E["JOIN GAME<br/>o SESSION FULL"]

  V4["V4 · Create Session"]
  V4 --> V4A["Step 1 of 3<br/>Sport y Meeting point"]
  V4 --> V4B["Step 2 of 3<br/>Level, Pace / Intensity, Spots"]
  V4 --> V4C["Step 3 of 3<br/>Review the Session"]

  V5["V5 · My Games"]
  V5 --> V5A["Upcoming<br/>Are you going? Yes / No"]
  V5 --> V5B["1h reminder!"]
  V5 --> V5C["Past<br/>Attended / No-show"]
  V5 --> V5D["Confirm attendance"]

  V6["V6 · My Player Card"]
  V6 --> V6A["Attendance y deportes"]
  V6 --> V6B["Edit sports and levels"]
  V6 --> V6C["Reset demo data"]
```

## Cómo se navega

La primera vez solo existe V1. Después, Home, My Games y My Player Card se cambian con la barra inferior. El detalle y crear una sesión se salen de esa barra y se cierran con Back.

```mermaid
flowchart TB
  START(["Primera visita"]) --> V1["V1 Create Player Card"]
  V1 -->|NEXT| HOME

  HOME["V2 Home"]
  GAMES["V5 My Games"]
  CARD["V6 My Player Card"]

  HOME <-->|barra inferior| GAMES
  HOME <-->|barra inferior| CARD
  GAMES <-->|barra inferior| CARD

  HOME -->|Lineup Sheet| DETAIL["V3 Session"]
  GAMES -->|Lineup Sheet| DETAIL
  DETAIL -->|Back| HOME
  DETAIL -->|Back| GAMES

  HOME -->|+ Create Session| CREATE["V4 Create Session"]
  CREATE -->|Back en el paso 1, o PUBLISH| HOME

  CARD -->|Edit sports and levels| EDIT["V1 otra vez, como editor"]
  EDIT -->|NEXT o Back| CARD
  CARD -->|Reset demo data| V1
```

Create Session no cambia de pantalla: Back baja un paso y NEXT sube un paso.

```mermaid
stateDiagram-v2
  [*] --> S1
  S1: Step 1 of 3 · Sport y Meeting point
  S2: Step 2 of 3 · Level, Pace / Intensity y Spots
  S3: Step 3 of 3 · Review the Session

  S1 --> S2: NEXT
  S2 --> S1: Back
  S2 --> S3: NEXT
  S3 --> S2: Back
  S3 --> [*]: PUBLISH, vuelve a Home
  S1 --> [*]: Back, vuelve a Home
```

## Qué se abre encima de cada pantalla

Estas piezas no son rutas. Se cierran con Cancel, Close o tocando fuera.

```mermaid
flowchart LR
  subgraph Home["V2 Home"]
    H1["Reminders"]
    H2["Different level"]
    H3["Add Sport"]
  end

  subgraph Detail["V3 Session"]
    D1["Session Chat"]
    D2["Leave Session"]
    D3["Different level"]
    D4["Add Sport"]
  end

  subgraph Games["V5 My Games"]
    G1["Confirm attendance"]
  end

  subgraph Card["V6 My Player Card"]
    C1["Reset demo data"]
  end
```

| Pantalla | Subpantalla | Cuándo aparece |
|---|---|---|
| V2 Home y V3 Session | Different level | El Level de la Session no es el de la Player Card |
| V2 Home y V3 Session | Add Sport | Ese Sport no está en la Player Card |
| V2 Home | Reminders | Se pulsa la campana |
| V3 Session | Session Chat | Solo Host y confirmed players |
| V3 Session | Leave Session | Se pulsa LEAVE SESSION |
| V5 My Games | Confirm attendance | El Host revisa quién vino |
| V6 My Player Card | Reset demo data | Se pulsa Reset demo data |
