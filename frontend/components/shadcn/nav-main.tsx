"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/shadcn/ui/sidebar";
import { cn } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NavMenu } from "@/types/common";

export function NavMain({ items }: { items: NavMenu[] }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() =>
                    pathname !== item.url && item.url && router.push(item.url)
                  }
                >
                  {item.icon && <item.icon />}
                  <span
                    className={cn(
                      pathname === item?.url && "underline underline-offset-4"
                    )}
                  >
                    {item.title}
                  </span>
                  {item.items && item.items.length > 0 && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn({
                  hidden: !(item.items && item.items.length > 0),
                })}
              >
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <span
                          className="cursor-pointer"
                          onClick={() =>
                            subItem.url &&
                            pathname !== subItem.url &&
                            router.push(subItem.url)
                          }
                        >
                          {subItem?.icon && <subItem.icon />}
                          <span
                            className={cn(
                              pathname === subItem?.url &&
                                "underline underline-offset-4"
                            )}
                          >
                            {subItem.title}
                          </span>
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
