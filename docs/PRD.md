# PRD - Kaitel Training Platform V1
## Plataforma Integral de Entrenamiento y Evaluación para Agentes de Contact Center Bancario

**Cliente:** Kaitel Paraguay / Itti Digital  
**Versión:** 1.0  
**Fecha:** 2026-02-17

---

## 1. Visión del Producto

Plataforma web que permite entrenar y evaluar agentes de contact center bancario mediante simulaciones realistas de llamadas, análisis de voz con IA, y tableros de control para supervisores. Diseñada para escalar el acompañamiento sin contratar proporcionalmente más tutores.

## 2. Usuarios Objetivo

| Rol | Descripción |
|-----|-------------|
| **Agente** | Operador de contact center en entrenamiento o evaluación continua |
| **Supervisor** | Líder de equipo que monitorea desempeño y asigna entrenamientos |
| **Admin** | Gestiona usuarios, escenarios y configuración global |

## 3. Módulos Funcionales

### 3.1 Simulaciones Progresivas de Llamadas
- Escenarios organizados por complejidad (Nivel 1-5)
- Categorías: Consultas informativas, Reclamos, Fraude, Lavado de activos, Robo
- Respuestas dinámicas del cliente via GPT-4o
- Síntesis de voz realista (OpenAI TTS) con voces M/F según perfil
- Indicador visual de "cliente hablando"
- Grabación de respuestas del agente

### 3.2 Evaluación Automática con IA
- 5 dimensiones: Empatía, Claridad, Protocolo, Resolución, Confianza
- Puntuación 0-100 por dimensión
- Feedback personalizado: fortalezas, debilidades, recomendaciones
- Historial de evaluaciones con tendencias

### 3.3 Análisis de Voz y Sentimiento
- Transcripción automática (Whisper API)
- Métricas vocales: velocidad, pausas, claridad, confianza, empatía, profesionalismo, entusiasmo
- Puntuación vocal global
- Insights personalizados

### 3.4 Reproductor Sincronizado
- Reproducción de audio con transcripción sincronizada
- Resaltado de palabras clave bancarias
- Navegación por clic en transcripción
- Controles completos (play/pause, velocidad, volumen)

### 3.5 Marcadores Temporales
- Categorías: Excelente, Bueno, Necesita Mejora, Error Crítico
- Notas personalizadas por marcador
- Banderas de colores en línea de tiempo
- Tooltips informativos

### 3.6 Sistema de Gamificación
- Niveles: Junior → Intermediate → Senior → Expert
- Puntos de experiencia (XP) por simulación completada
- Badges desbloqueables por logros
- Progreso visual con barras y animaciones

### 3.7 Tableros de Control
- **Agente:** Métricas personales, historial, fortalezas/debilidades, plan de mejora
- **Supervisor:** Vista consolidada de equipos, rankings, estadísticas grupales

## 4. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript, Vite, TailwindCSS, shadcn/ui |
| Routing | Wouter |
| State | TanStack Query + tRPC Client |
| Backend | Node.js 22, Express 4, tRPC 11 |
| ORM | Drizzle ORM |
| DB | SQLite (dev) / MySQL-TiDB (prod) |
| AI | OpenAI GPT-4o, Whisper, TTS |
| Storage | Local (dev) / AWS S3 (prod) |
| Testing | Vitest |

## 5. Identidad Visual

- **Color primario:** #00D084 (Verde Itti)
- **Color secundario:** #0F172A (Slate 900)
- **Acento:** #10B981 (Emerald 500)
- **Fondo:** #F8FAFC (Slate 50)
- **Tipografía:** Inter (Google Fonts)
- **Estilo:** Minimalista, profesional, moderno

## 6. Arquitectura de Datos

### Entidades principales:
- `users` - Agentes, supervisores, admins
- `scenarios` - Escenarios de simulación
- `simulations` - Sesiones de entrenamiento
- `evaluations` - Resultados de evaluación IA
- `voice_analyses` - Análisis de voz
- `recordings` - Grabaciones de audio
- `markers` - Marcadores temporales
- `badges` - Insignias del sistema
- `user_badges` - Insignias desbloqueadas
- `user_progress` - Progreso y XP

## 7. API Endpoints (tRPC)

- `auth.login` / `auth.register`
- `scenarios.list` / `scenarios.getById`
- `simulations.start` / `simulations.respond` / `simulations.complete`
- `evaluations.evaluate` / `evaluations.getHistory`
- `voice.transcribe` / `voice.analyze` / `voice.synthesize`
- `markers.create` / `markers.list`
- `gamification.getProgress` / `gamification.getBadges`
- `dashboard.agentStats` / `dashboard.supervisorStats`
