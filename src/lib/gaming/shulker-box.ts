export const SHULKER_SLOTS = 27;
export const DOUBLE_CHEST_SLOTS = 54;
export const PLAYER_SLOTS = 36;
export const OFFHAND_SLOTS = 1;

export const STACK_PRESETS = [
  { id: '64', label: '64-stack blocks and items', stackSize: 64 },
  { id: '16', label: '16-stack items (ender pearls, snowballs)', stackSize: 16 },
  { id: '1', label: 'Unstackable items (tools, buckets)', stackSize: 1 },
] as const;

export interface ShulkerResult {
  stackSize: number;
  itemsPerBox: number;
  boxCount: number;
  totalItems: number;
  leftoverItems: number;
  boxesNeededForItems: number;
  doubleChestItems: number;
  enderChestItems: number;
  inventoryItems: number;
  fullCarryItems: number;
}

export function itemsPerShulker(stackSize: number): number {
  const stack = clampStack(stackSize);
  return SHULKER_SLOTS * stack;
}

export function shulkersForItems(itemCount: number, stackSize: number): number {
  const per = itemsPerShulker(stackSize);
  if (itemCount <= 0) return 0;
  return Math.ceil(itemCount / per);
}

export function calculateShulkerLoad(boxCount: number, itemCount: number, stackSize: number): ShulkerResult {
  const stack = clampStack(stackSize);
  const boxes = Math.max(0, Math.floor(boxCount));
  const items = Math.max(0, Math.floor(itemCount));
  const per = SHULKER_SLOTS * stack;
  const totalItems = boxes * per;
  const boxesNeededForItems = shulkersForItems(items, stack);
  const leftoverItems = items === 0 ? 0 : items % per === 0 ? 0 : per - (items % per);

  return {
    stackSize: stack,
    itemsPerBox: per,
    boxCount: boxes,
    totalItems,
    leftoverItems,
    boxesNeededForItems,
    doubleChestItems: DOUBLE_CHEST_SLOTS * per,
    enderChestItems: SHULKER_SLOTS * per,
    inventoryItems: PLAYER_SLOTS * per,
    fullCarryItems: (PLAYER_SLOTS + OFFHAND_SLOTS) * per,
  };
}

function clampStack(stackSize: number): number {
  if (stackSize >= 64) return 64;
  if (stackSize >= 16) return 16;
  return 1;
}
