import { Icon } from "@iconify/react";
export function IconTile({ icon, size = 42 }: { icon: string; size?: 38 | 42 }) {
  const dim = size === 38 ? "h-[38px] w-[38px]" : "h-[42px] w-[42px]";
  return (
    <div className={`${dim} rounded-[10px] bg-beige flex items-center justify-center shrink-0`}>
      <Icon icon={icon} className="text-brand" width={22} height={22} />
    </div>
  );
}
