import WebFlow from '../../models/WebFlow';

export const ensureParentOwnership = async (
  parentId: number | null | undefined,
  userId: number
) => {
  if (parentId === null || parentId === undefined) {
    return;
  }

  const parentWebFlow = await WebFlow.findOne({
    where: { id: parentId, userId },
  });

  if (!parentWebFlow) {
    throw new Error('PARENT_NOT_FOUND');
  }
};
