# Navigation (Nav2): Path Planning and Autonomous Movement

Master robot navigation with Nav2 on the Isaac platform. This chapter covers path planning, obstacle avoidance, and autonomous movement in complex environments.

- Understanding Nav2 architecture and components
- Configuring path planners for humanoid robots
- Implementing obstacle detection and avoidance
- Tuning navigation parameters for optimal performance
- Integrating with perception systems for dynamic navigation

```mermaid
graph TD
    A[Navigation System] --> B[Path Planner]
    A --> C[Controller]
    A --> D[Recovery Behaviors]
    B --> E[Global Planner]
    C --> F[Local Planner]
    D --> G[Recovery Actions]
    E --> H[Path Execution]
    F --> H
    G --> H
```