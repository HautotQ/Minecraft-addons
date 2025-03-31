
export const pathfinding = {
    findNearestBlock(entity, blockType) {
        return { x: entity.location.x + 1, y: entity.location.y, z: entity.location.z };
    }
};
