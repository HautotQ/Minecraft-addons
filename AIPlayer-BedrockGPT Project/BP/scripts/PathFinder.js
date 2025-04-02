// Framework: JavaScript

class PathFinder {
    static LOGGER = console;

    static simplifyPath(path) {
        let simplifiedPath = [];
        let previousPosition = null;

        for (const currentPosition of path) {
            if (currentPosition !== previousPosition) {
                simplifiedPath.push(currentPosition);
            }
            previousPosition = currentPosition;
        }

        return simplifiedPath;
    }

    static identifyPrimaryAxis(path) {
        let xChanges = 0;
        let yChanges = 0;
        let zChanges = 0;
        let previousPosition = path[0];

        for (const currentPosition of path) {
            if (currentPosition.method_10263() !== previousPosition.method_10263()) {
                xChanges++;
            }

            if (currentPosition.method_10264() !== previousPosition.method_10264()) {
                yChanges++;
            }

            if (currentPosition.method_10260() !== previousPosition.method_10260()) {
                zChanges++;
            }
            previousPosition = currentPosition;
        }

        let axisPriorityList = [];
        if (xChanges > 0 || yChanges > 0 || zChanges > 0) {
            if (xChanges > 0) {
                axisPriorityList.push("x");
            }

            if (yChanges > 0) {
                axisPriorityList.push("y");
            }

            if (zChanges > 0) {
                axisPriorityList.push("z");
            }

            axisPriorityList.sort((a, b) => {
                const changesA = a === "x" ? xChanges : (a === "y" ? yChanges : zChanges);
                const changesB = b === "x" ? xChanges : (b === "y" ? yChanges : zChanges);
                return changesB - changesA;
            });
        }

        return axisPriorityList;
    }

    static calculatePath(start, target) {
        PathFinder.LOGGER.info("Finding the shortest path to the target, please wait patiently if the game seems hung");
        const openSet = [];
        const closedSet = [];
        let startNode = new PathFinder.Node(start, null, 0.0, this.getDistance(start, target));
        openSet.push(startNode);

        while (openSet.length > 0) {
            const currentNode = openSet.shift();
            if (currentNode.position === target) {
                return this.reconstructPath(currentNode);
            }

            closedSet.push(currentNode);
            const neighbors = this.getNeighbors(currentNode.position);

            for (const neighbor of neighbors) {
                if (!closedSet.some(node => node.position === neighbor)) {
                    const tentativeGScore = currentNode.gScore + this.getDistance(currentNode.position, neighbor);
                    let neighborNode = openSet.find(node => node.position === neighbor);

                    if (!neighborNode) {
                        neighborNode = new PathFinder.Node(neighbor, currentNode, tentativeGScore, this.getDistance(neighbor, target));
                        openSet.push(neighborNode);
                    } else if (tentativeGScore < neighborNode.gScore) {
                        neighborNode.parent = currentNode;
                        neighborNode.gScore = tentativeGScore;
                        neighborNode.fScore = tentativeGScore + neighborNode.hScore;
                    }
                }
            }
        }

        return [];
    }

    static reconstructPath(node) {
        let path = [];
        while (node !== null) {
            path.unshift(node.position);
            node = node.parent;
        }
        return path;
    }

    static getNeighbors(pos) {
        let neighbors = [];
        neighbors.push(pos.method_10069(1, 0, 0));
        neighbors.push(pos.method_10069(-1, 0, 0));
        neighbors.push(pos.method_10069(0, 0, 1));
        neighbors.push(pos.method_10069(0, 0, -1));
        neighbors.push(pos.method_10069(0, 1, 0));
        neighbors.push(pos.method_10069(0, -1, 0));
        return neighbors;
    }

    static getDistance(pos1, pos2) {
        return Math.sqrt(pos1.method_10262(pos2));
    }

    static Node = class {
        constructor(position, parent, gScore, hScore) {
            this.position = position;
            this.parent = parent;
            this.gScore = gScore;
            this.hScore = hScore;
            this.fScore = gScore + hScore;
        }

        compareTo(other) {
            return this.fScore - other.fScore;
        }
    };
}