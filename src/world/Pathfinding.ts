/**
 * A* Pathfinding Engine
 * Computes shortest walking paths around walls and furniture on the grid.
 */

export interface Point {
  x: number;
  y: number;
}

interface Node {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

export class Pathfinding {
  public static findPath(
    start: Point,
    target: Point,
    gridWidth: number,
    gridHeight: number,
    isWalkable: (x: number, y: number) => boolean
  ): Point[] {
    // If target itself is not walkable (e.g. clicking on furniture), find closest adjacent walkable tile
    let realTarget = target;
    if (!isWalkable(target.x, target.y)) {
      const neighbors = this.getNeighbors(target, gridWidth, gridHeight);
      const walkableNeighbors = neighbors.filter(n => isWalkable(n.x, n.y));
      if (walkableNeighbors.length > 0) {
        realTarget = walkableNeighbors[0];
      } else {
        return []; // No accessible path
      }
    }

    const openList: Node[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: Node = {
      x: start.x,
      y: start.y,
      g: 0,
      h: this.heuristic(start, realTarget),
      f: 0,
      parent: null
    };
    startNode.f = startNode.g + startNode.h;
    openList.push(startNode);

    while (openList.length > 0) {
      // Find lowest F score
      openList.sort((a, b) => a.f - b.f);
      const current = openList.shift()!;

      if (current.x === realTarget.x && current.y === realTarget.y) {
        // Path found! Reconstruct
        const path: Point[] = [];
        let curr: Node | null = current;
        while (curr) {
          path.unshift({ x: curr.x, y: curr.y });
          curr = curr.parent;
        }
        return path;
      }

      closedSet.add(`${current.x},${current.y}`);

      const neighbors = this.getNeighbors({ x: current.x, y: current.y }, gridWidth, gridHeight);

      for (const n of neighbors) {
        if (closedSet.has(`${n.x},${n.y}`)) continue;
        if (!isWalkable(n.x, n.y) && !(n.x === realTarget.x && n.y === realTarget.y)) continue;

        const gScore = current.g + 1;
        let neighborNode = openList.find(node => node.x === n.x && node.y === n.y);

        if (!neighborNode) {
          neighborNode = {
            x: n.x,
            y: n.y,
            g: gScore,
            h: this.heuristic(n, realTarget),
            f: 0,
            parent: current
          };
          neighborNode.f = neighborNode.g + neighborNode.h;
          openList.push(neighborNode);
        } else if (gScore < neighborNode.g) {
          neighborNode.g = gScore;
          neighborNode.f = neighborNode.g + neighborNode.h;
          neighborNode.parent = current;
        }
      }
    }

    return []; // No path found
  }

  private static heuristic(p1: Point, p2: Point): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  }

  private static getNeighbors(p: Point, width: number, height: number): Point[] {
    const res: Point[] = [];
    const dirs = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];

    dirs.forEach(d => {
      const nx = p.x + d.x;
      const ny = p.y + d.y;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        res.push({ x: nx, y: ny });
      }
    });

    return res;
  }
}
