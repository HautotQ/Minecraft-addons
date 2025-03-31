
export const actions = {
    moveTo(entity, position) {
        entity.teleport(position, { checkForBlocks: false });
    }
};
