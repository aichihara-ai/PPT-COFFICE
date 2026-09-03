import * as React$1 from 'react';
import { ReactNode } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as class_variance_authority_dist_types from 'class-variance-authority/dist/types';
import { VariantProps } from 'class-variance-authority';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { DayPicker, DayButton, DateRange } from 'react-day-picker';
export { DateRange } from 'react-day-picker';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import * as RechartsPrimitive from 'recharts';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { Combobox as Combobox$1 } from '@base-ui/react';
import { Command as Command$1 } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { Table as Table$1, Row, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { Drawer as Drawer$1 } from 'vaul';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as react_hook_form from 'react-hook-form';
import { FieldValues, FieldPath, ControllerProps } from 'react-hook-form';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { OTPInput } from 'input-otp';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as ResizablePrimitive from 'react-resizable-panels';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { LucideIcon } from 'lucide-react';
import { ToasterProps } from 'sonner';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

declare function Accordion({ ...props }: React$1.ComponentProps<typeof AccordionPrimitive.Root>): React$1.JSX.Element;
declare function AccordionItem({ className, ...props }: React$1.ComponentProps<typeof AccordionPrimitive.Item>): React$1.JSX.Element;
declare function AccordionTrigger({ className, children, ...props }: React$1.ComponentProps<typeof AccordionPrimitive.Trigger>): React$1.JSX.Element;
declare function AccordionContent({ className, children, ...props }: React$1.ComponentProps<typeof AccordionPrimitive.Content>): React$1.JSX.Element;

declare const alertVariants: (props?: ({
    variant?: "default" | "destructive" | "success" | "warning" | "info" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
declare function Alert({ className, variant, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof alertVariants>): React$1.JSX.Element;
declare function AlertTitle({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function AlertDescription({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;

declare function AlertDialog({ ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Root>): React$1.JSX.Element;
declare function AlertDialogTrigger({ ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Trigger>): React$1.JSX.Element;
declare function AlertDialogPortal({ ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Portal>): React$1.JSX.Element;
declare function AlertDialogOverlay({ className, ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Overlay>): React$1.JSX.Element;
declare function AlertDialogContent({ className, ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Content>): React$1.JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function AlertDialogFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function AlertDialogTitle({ className, ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Title>): React$1.JSX.Element;
declare function AlertDialogDescription({ className, ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Description>): React$1.JSX.Element;
declare function AlertDialogAction({ className, ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Action>): React$1.JSX.Element;
declare function AlertDialogCancel({ className, ...props }: React$1.ComponentProps<typeof AlertDialogPrimitive.Cancel>): React$1.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "link" | "secondary" | "outline" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
declare const Button: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & VariantProps<(props?: ({
    variant?: "default" | "destructive" | "link" | "secondary" | "outline" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string> & {
    asChild?: boolean;
    loading?: boolean;
    startIcon?: React$1.ReactNode;
    endIcon?: React$1.ReactNode;
    disabled?: boolean;
} & React$1.RefAttributes<HTMLButtonElement>>;

declare const Input: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

declare function Separator({ className, orientation, decorative, ...props }: React$1.ComponentProps<typeof SeparatorPrimitive.Root>): React$1.JSX.Element;

declare function TooltipProvider({ delayDuration, ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Provider>): React$1.JSX.Element;
declare function TooltipRoot({ ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Root>): React$1.JSX.Element;
/** Prefer a single app- or table-level TooltipProvider; use TooltipRoot in lists. */
declare function Tooltip({ ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Root>): React$1.JSX.Element;
declare function TooltipTrigger({ ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Trigger>): React$1.JSX.Element;
declare function TooltipContent({ className, sideOffset, children, ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Content>): React$1.JSX.Element;

type SidebarContextProps = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};
declare function useSidebar(): SidebarContextProps;
declare function SidebarProvider({ defaultOpen, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }: React$1.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}): React$1.JSX.Element;
declare function Sidebar({ side, variant, collapsible, className, children, ...props }: React$1.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
}): React$1.JSX.Element;
declare function SidebarTrigger({ className, onClick, ...props }: React$1.ComponentProps<typeof Button>): React$1.JSX.Element;
declare function SidebarRail({ className, ...props }: React$1.ComponentProps<"button">): React$1.JSX.Element;
declare function SidebarInset({ className, ...props }: React$1.ComponentProps<"main">): React$1.JSX.Element;
declare function SidebarInput({ className, ...props }: React$1.ComponentProps<typeof Input>): React$1.JSX.Element;
declare function SidebarHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SidebarFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SidebarSeparator({ className, ...props }: React$1.ComponentProps<typeof Separator>): React$1.JSX.Element;
declare function SidebarContent({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SidebarGroup({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SidebarGroupLabel({ className, asChild, ...props }: React$1.ComponentProps<"div"> & {
    asChild?: boolean;
}): React$1.JSX.Element;
declare function SidebarGroupAction({ className, asChild, ...props }: React$1.ComponentProps<"button"> & {
    asChild?: boolean;
}): React$1.JSX.Element;
declare function SidebarGroupContent({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SidebarMenu({ className, ...props }: React$1.ComponentProps<"ul">): React$1.JSX.Element;
declare function SidebarMenuItem({ className, ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;
declare const SidebarMenuButton: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLButtonElement> & React$1.ButtonHTMLAttributes<HTMLButtonElement> & {
    hideTooltip?: boolean;
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React$1.ComponentProps<typeof TooltipContent>;
    /** Portaled submenu for icon-rail hover; rendered only when sidebar is collapsed. */
    collapsedFlyoutContent?: React$1.ReactNode;
    collapsedFlyoutLabel?: string;
} & VariantProps<(props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare function SidebarMenuAction({ className, asChild, showOnHover, ...props }: React$1.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
}): React$1.JSX.Element;
declare function SidebarMenuBadge({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SidebarMenuSkeleton({ className, showIcon, ...props }: React$1.ComponentProps<"div"> & {
    showIcon?: boolean;
}): React$1.JSX.Element;
declare function SidebarMenuSub({ className, ...props }: React$1.ComponentProps<"ul">): React$1.JSX.Element;
declare function SidebarMenuSubItem({ className, ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;
declare function SidebarMenuSubButton({ asChild, size, isActive, className, ...props }: React$1.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
}): React$1.JSX.Element;

/** Icon component for sidebar rows — avoids coupling consumers to lucide-react's LucideIcon type. */
type SidebarIcon = React.ComponentType<{
    className?: string;
}>;
type Team = {
    name: string;
    logo: SidebarIcon;
    rightLogo?: SidebarIcon;
    plan: string;
    onClick?: (team: Team) => void;
};
type User = {
    id?: string | number;
    name?: string;
    email?: string;
    avatar?: string;
    icon?: SidebarIcon;
};
type AppSidebarHeader = {
    mode?: "dropdown";
    dropdownTitle?: string;
} | {
    mode: "static";
    label: string;
    description?: string;
    logo?: SidebarIcon;
};
type AppSidebarFooter = {
    dropdownEnabled?: boolean;
    visual?: "avatar" | "icon";
    /** Replaces the default dropdown items when provided */
    dropdownContent?: React.ReactNode;
    /**
     * Renders built-in impersonation chrome in the footer trigger:
     * icon tile with breathing glow, user ID, and an "Impersonating" badge.
     */
    impersonating?: boolean;
};
type SidebarNavClickEvent = React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>;
type SubMenuChevronPlacement = "left" | "right";
type SidebarSubItem = {
    title: string;
    url?: string;
    /** Visual active state — set in app-level sidebar data (e.g. from route). */
    isActive?: boolean;
    /** Opens nested items; parent row does not highlight when only a descendant is active. */
    defaultOpen?: boolean;
    onClick?: (event: SidebarNavClickEvent) => void;
    /** Leaf-only label or pending marker (e.g. "5", "Unread"). Parents derive presence from descendants. */
    badge?: string;
    /** Nested children (L3+). */
    items?: SidebarSubItem[];
};
type Item = {
    title: string;
    url?: string;
    icon?: SidebarIcon;
    /** Visual active state — set in app-level sidebar data (e.g. from route). */
    isActive?: boolean;
    /** Opens nested items; use when a child is active but the parent row should not highlight. */
    defaultOpen?: boolean;
    onClick?: (event: SidebarNavClickEvent) => void;
    items?: SidebarSubItem[];
    features?: {
        withEllipsis?: boolean;
        /** Leaf-only badge or pending marker on L1 items (e.g. "12", "Unread"). Ignored when the item has nested children. */
        badge?: string;
        hideTooltip?: boolean;
        withDropdownMenu?: boolean;
    };
};
type Group = {
    items: Item[];
    label: string;
};
type AppSidebarData = {
    user?: User;
    teams?: Team[];
    groups: Group[];
};
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    data: AppSidebarData;
    shouldShowSidebarTrigger?: boolean;
    header?: AppSidebarHeader;
    footer?: AppSidebarFooter;
    /** L2+ chevron placement in expanded submenu rows. Default `"right"`. */
    subMenuChevronPlacement?: SubMenuChevronPlacement;
    /** @deprecated Use `header.dropdownTitle` */
    headerDropdownTitle?: string;
    /** @deprecated Use `footer.dropdownEnabled` */
    hideFooterDropdown?: boolean;
    defaultActiveTeamIndex?: number;
};
type MenuItemWrapperProps = {
    item: Item;
};

declare function AppSidebar({ shouldShowSidebarTrigger, header, footer, headerDropdownTitle, hideFooterDropdown, defaultActiveTeamIndex, subMenuChevronPlacement, data: { teams, groups, user }, ...restProps }: AppSidebarProps): React$1.JSX.Element;

declare const STATIC_SIDEBAR_ROW_CLASSNAME = "pointer-events-none cursor-default hover:bg-transparent hover:text-sidebar-foreground active:bg-transparent focus-visible:ring-0";
declare function isStaticHeader(header: AppSidebarHeader): header is Extract<AppSidebarHeader, {
    mode: "static";
}>;
declare function normalizeHeader(header?: AppSidebarHeader, headerDropdownTitle?: string): AppSidebarHeader;
declare function normalizeFooter(footer?: AppSidebarFooter, hideFooterDropdown?: boolean): AppSidebarFooter;
/**
 * Consumer utility: derive `isActive` / `defaultOpen` from the current route.
 * AppSidebar does not read the router — call this in your app when building `data`.
 *
 * - Parent `isActive`: leaf items only (nested parents stay unhighlighted).
 * - `defaultOpen`: parent URL match or any active child.
 * - Child `isActive`: child URL match.
 */
declare function applySidebarActiveState(data: AppSidebarData, pathname: string, hash: string): AppSidebarData;
/**
 * Matches sidebar items without substring collisions.
 * - #hash items must match hash exactly
 * - /path items must match pathname exactly
 * - full path+hash items must match exactly
 */
declare function isSidebarItemActive(pathname: string, hash: string, itemUrl?: string): boolean;
/**
 * Consumer utility: URL match unless `override` is set.
 * Prefer `applySidebarActiveState` for full `AppSidebarData` trees.
 */
/** Resolves badge for top-level L1 leaf items via `features.badge`. */
declare function resolveItemBadge(item: Item): string | undefined;
/** Resolves badge for nested sub-items. */
declare function resolveSubItemBadge(item: SidebarSubItem): string | undefined;
/** Formats a leaf badge for display; returns null when hidden. */
declare function formatSidebarBadge(badge?: string): string | null;
type BadgeSidebarNode = {
    badge?: string;
    items?: BadgeSidebarNode[];
};
/** True when any descendant leaf has a visible badge. */
declare function hasDescendantBadge(item: BadgeSidebarNode): boolean;
declare function resolveSidebarItemActive(pathname: string, hash: string, itemUrl?: string, override?: boolean): boolean;

declare function AspectRatio({ ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>): React$1.JSX.Element;

declare function Avatar({ className, ...props }: React$1.ComponentProps<typeof AvatarPrimitive.Root>): React$1.JSX.Element;
declare function AvatarImage({ className, ...props }: React$1.ComponentProps<typeof AvatarPrimitive.Image>): React$1.JSX.Element;
declare function AvatarFallback({ className, ...props }: React$1.ComponentProps<typeof AvatarPrimitive.Fallback>): React$1.JSX.Element;

declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "secondary" | "outline" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
declare function Badge({ className, variant, asChild, ...props }: React$1.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
}): React$1.JSX.Element;

declare function Breadcrumb({ ...props }: React$1.ComponentProps<"nav">): React$1.JSX.Element;
declare function BreadcrumbList({ className, ...props }: React$1.ComponentProps<"ol">): React$1.JSX.Element;
declare function BreadcrumbItem({ className, ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;
declare function BreadcrumbLink({ asChild, className, ...props }: React$1.ComponentProps<"a"> & {
    asChild?: boolean;
}): React$1.JSX.Element;
declare function BreadcrumbPage({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
declare function BreadcrumbSeparator({ children, className, ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;
declare function BreadcrumbEllipsis({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;

type ButtonItemBase = {
    icon?: ReactNode;
    tooltip?: string;
    dropdownItems?: {
        onClick?: () => void;
        text: string;
    }[];
};
type ButtonItemWithHref = ButtonItemBase & {
    href: string;
    target?: string;
    onClick?: never;
};
type ButtonItemWithClick = ButtonItemBase & {
    href?: never;
    onClick?: () => void;
};
type ButtonItem = ButtonItemWithHref | ButtonItemWithClick;
type ButtonsGroupProps = {
    buttonsGroup: ButtonItem[];
    className?: string;
};
declare function ButtonsGroup({ buttonsGroup, className }: ButtonsGroupProps): React$1.JSX.Element;

type CalendarMonthsLayout = "horizontal" | "vertical";
declare function Calendar({ className, classNames, showOutsideDays, captionLayout, buttonVariant, monthsLayout, formatters, components, ...props }: React$1.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React$1.ComponentProps<typeof Button>["variant"];
    /** `vertical` stacks months (Figma 2 Rows / DatePicker `size="sm"`). */
    monthsLayout?: CalendarMonthsLayout;
}): React$1.JSX.Element;
declare function CalendarDayButton({ className, day, modifiers, ...props }: React$1.ComponentProps<typeof DayButton>): React$1.JSX.Element;

declare function Card({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardTitle({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardDescription({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardAction({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardContent({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};
declare function Carousel({ orientation, opts, setApi, plugins, className, children, ...props }: React$1.ComponentProps<"div"> & CarouselProps): React$1.JSX.Element;
declare function CarouselContent({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CarouselItem({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CarouselPrevious({ className, variant, size, ...props }: React$1.ComponentProps<typeof Button>): React$1.JSX.Element;
declare function CarouselNext({ className, variant, size, ...props }: React$1.ComponentProps<typeof Button>): React$1.JSX.Element;

declare const THEMES: {
    readonly light: "";
    readonly dark: ".dark";
};
type ChartConfig = {
    [k in string]: {
        label?: React$1.ReactNode;
        icon?: React$1.ComponentType;
    } & ({
        color?: string;
        theme?: never;
    } | {
        color?: never;
        theme: Record<keyof typeof THEMES, string>;
    });
};
declare function ChartContainer({ id, className, children, config, ...props }: React$1.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React$1.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}): React$1.JSX.Element;
declare const ChartStyle: ({ id, config }: {
    id: string;
    config: ChartConfig;
}) => React$1.JSX.Element | null;
declare const ChartTooltip: typeof RechartsPrimitive.Tooltip;
declare function ChartTooltipContent({ active, payload, className, indicator, hideLabel, hideIndicator, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey, }: React$1.ComponentProps<typeof RechartsPrimitive.Tooltip> & React$1.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
}): React$1.JSX.Element | null;
declare const ChartLegend: typeof RechartsPrimitive.Legend;
declare function ChartLegendContent({ className, hideIcon, payload, verticalAlign, nameKey, }: React$1.ComponentProps<"div"> & Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
}): React$1.JSX.Element | null;

declare const Checkbox: React$1.ForwardRefExoticComponent<Omit<CheckboxPrimitive.CheckboxProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>): React$1.JSX.Element;
declare function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>): React$1.JSX.Element;
declare function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>): React$1.JSX.Element;

declare const Combobox: typeof Combobox$1.Root;
declare function ComboboxValue({ ...props }: Combobox$1.Value.Props): React$1.JSX.Element;
declare function ComboboxTrigger({ className, children, ...props }: Combobox$1.Trigger.Props): React$1.JSX.Element;
declare function ComboboxInput({ className, children, disabled, showTrigger, showClear, ...props }: Combobox$1.Input.Props & {
    showTrigger?: boolean;
    showClear?: boolean;
}): React$1.JSX.Element;
declare function ComboboxContent({ className, side, sideOffset, align, alignOffset, anchor, ...props }: Combobox$1.Popup.Props & Pick<Combobox$1.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset" | "anchor">): React$1.JSX.Element;
declare function ComboboxList({ className, ...props }: Combobox$1.List.Props): React$1.JSX.Element;
declare function ComboboxItem({ className, children, ...props }: Combobox$1.Item.Props): React$1.JSX.Element;
declare function ComboboxGroup({ className, ...props }: Combobox$1.Group.Props): React$1.JSX.Element;
declare function ComboboxLabel({ className, ...props }: Combobox$1.GroupLabel.Props): React$1.JSX.Element;
declare function ComboboxCollection({ ...props }: Combobox$1.Collection.Props): React$1.JSX.Element;
declare function ComboboxEmpty({ className, ...props }: Combobox$1.Empty.Props): React$1.JSX.Element;
declare function ComboboxSeparator({ className, ...props }: Combobox$1.Separator.Props): React$1.JSX.Element;
declare function ComboboxChips({ className, ...props }: React$1.ComponentPropsWithRef<typeof Combobox$1.Chips> & Combobox$1.Chips.Props): React$1.JSX.Element;
declare function ComboboxChip({ className, children, showRemove, ...props }: Combobox$1.Chip.Props & {
    showRemove?: boolean;
}): React$1.JSX.Element;
declare function ComboboxChipsInput({ className, children, ...props }: Combobox$1.Input.Props): React$1.JSX.Element;
declare function useComboboxAnchor(): React$1.RefObject<HTMLDivElement | null>;

declare function Dialog({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Root>): React$1.JSX.Element;
declare function DialogTrigger({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Trigger>): React$1.JSX.Element;
declare function DialogPortal({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Portal>): React$1.JSX.Element;
declare function DialogClose({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Close>): React$1.JSX.Element;
declare function DialogOverlay({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Overlay>): React$1.JSX.Element;
declare function DialogContent({ className, children, showCloseButton, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}): React$1.JSX.Element;
declare function DialogHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function DialogFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function DialogTitle({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Title>): React$1.JSX.Element;
declare function DialogDescription({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Description>): React$1.JSX.Element;

declare function Command({ className, ...props }: React$1.ComponentProps<typeof Command$1>): React$1.JSX.Element;
declare function CommandDialog({ title, description, children, className, showCloseButton, ...props }: React$1.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
}): React$1.JSX.Element;
declare function CommandInput({ className, ...props }: React$1.ComponentProps<typeof Command$1.Input>): React$1.JSX.Element;
declare function CommandList({ className, ...props }: React$1.ComponentProps<typeof Command$1.List>): React$1.JSX.Element;
declare function CommandEmpty({ ...props }: React$1.ComponentProps<typeof Command$1.Empty>): React$1.JSX.Element;
declare function CommandGroup({ className, ...props }: React$1.ComponentProps<typeof Command$1.Group>): React$1.JSX.Element;
declare function CommandSeparator({ className, ...props }: React$1.ComponentProps<typeof Command$1.Separator>): React$1.JSX.Element;
declare function CommandItem({ className, ...props }: React$1.ComponentProps<typeof Command$1.Item>): React$1.JSX.Element;
declare function CommandShortcut({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;

declare function ContextMenu({ ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Root>): React$1.JSX.Element;
declare function ContextMenuTrigger({ ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Trigger>): React$1.JSX.Element;
declare function ContextMenuGroup({ ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Group>): React$1.JSX.Element;
declare function ContextMenuPortal({ ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Portal>): React$1.JSX.Element;
declare function ContextMenuSub({ ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Sub>): React$1.JSX.Element;
declare function ContextMenuRadioGroup({ ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>): React$1.JSX.Element;
declare function ContextMenuSubTrigger({ className, inset, children, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function ContextMenuSubContent({ className, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.SubContent>): React$1.JSX.Element;
declare function ContextMenuContent({ className, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Content>): React$1.JSX.Element;
declare function ContextMenuItem({ className, inset, variant, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): React$1.JSX.Element;
declare function ContextMenuCheckboxItem({ className, children, checked, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>): React$1.JSX.Element;
declare function ContextMenuRadioItem({ className, children, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.RadioItem>): React$1.JSX.Element;
declare function ContextMenuLabel({ className, inset, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function ContextMenuSeparator({ className, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Separator>): React$1.JSX.Element;
declare function ContextMenuShortcut({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;

type DatePickerSize = "sm" | "md";
type DatePickerMode = "single" | "range";

/** Quick-select option shown above the calendar or in the range sidebar. */
type DatePickerPreset = {
    /** Display label, e.g. "Last 7 days". */
    label: string;
    /** Stable id for controlled preset UI; defaults to `label` when omitted. */
    id?: string;
    /** Resolved selection for single mode (`Date`, start of local day for built-ins). */
    date?: Date;
    /** Resolved selection for range mode. */
    range?: DateRange;
};
type DatePickerFooterAction = {
    label?: string;
    onClick?: () => void;
};
type DatePickerFooterClearAction = DatePickerFooterAction & {
    /** When true, shows the Clear button. Defaults to false. */
    show?: boolean;
};
type DatePickerFooterConfig = {
    /** When false, footer actions are hidden. Defaults to true when actions are set. */
    show?: boolean;
    cancel?: DatePickerFooterAction;
    apply?: DatePickerFooterAction;
    /**
     * Optional Clear control (left side of footer). Hidden unless `clear.show` is true.
     * Clears the committed value immediately and closes the popover (does not require Apply).
     */
    clear?: DatePickerFooterClearAction;
};
type DatePickerBaseProps = {
    /**
     * Selection mode. Defaults to `single`.
     *
     * Use discriminated props: single mode uses `value` / `onValueChange`;
     * range mode uses `range` / `onRangeChange` (TypeScript prevents mixing).
     */
    mode?: DatePickerMode;
    /** Field label above the trigger. */
    label?: string;
    /** Helper text below the trigger. */
    description?: string;
    /** Placeholder when no value is selected. */
    placeholder?: string;
    /** Whether to render the label. Defaults to true when `label` is set. */
    showLabel?: boolean;
    disabled?: boolean;
    /**
     * `sm`: shorter trigger and calendar months stacked vertically (Figma 2 Rows).
     * `md`: default trigger height and months side by side (Figma 2 Columns).
     */
    size?: DatePickerSize;
    className?: string;
    triggerClassName?: string;
    /** Classes merged onto the popover panel (`PopoverContent`), e.g. `max-h-[70dvh] overflow-y-auto`. */
    popoverContentClassName?: string;
    /** Preset options rendered in the popover. */
    presets?: DatePickerPreset[];
    /** Use built-in presets when `presets` is omitted and this is true. */
    showPresets?: boolean;
    /**
     * Range-only layout. `complex` adds start/end inputs and presets:
     * `size="md"` uses an inline preset list (Figma 2 Columns); `size="sm"`
     * uses a preset dropdown and stacked calendar (Figma 18465:5796).
     */
    rangeLayout?: "simple" | "complex";
    /** Number of months in the calendar. Defaults to 1 (single) or 2 (range). */
    numberOfMonths?: number;
    /** Month/year dropdowns in the calendar header. */
    captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
    footerConfig?: DatePickerFooterConfig;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Fired when the user picks a preset (before Apply when footer is shown).
     * `preset.date` / `preset.range` are `Date` values — same shape as commit callbacks.
     */
    onPresetSelect?: (preset: DatePickerPreset) => void;
    /**
     * BCP 47 locale for trigger text and range sidebar inputs. Default `"en-US"`.
     * Display-only; does not change callback types.
     */
    locale?: string;
    /**
     * `Intl.DateTimeFormat` options for trigger and complex range inputs.
     * Display-only; callbacks still return `Date`.
     */
    dateFormat?: Intl.DateTimeFormatOptions;
    /**
     * date-fns format string for trigger display (e.g. `"PPP"`, `"yyyy-MM-dd"`).
     * Takes precedence over `dateFormat` when set. Display-only; callbacks still return `Date`.
     */
    dateFormatString?: string;
};
type DatePickerSingleProps = DatePickerBaseProps & {
    mode?: "single";
    /** Controlled selected day (`Date` at local midnight from calendar/presets). */
    value?: Date;
    /** Uncontrolled initial day. */
    defaultValue?: Date;
    /**
     * Called when the selection is committed.
     *
     * Return value: `Date` for a selected day, `undefined` when cleared.
     * Never returns a formatted string — map to API strings in your app
     * (e.g. `date-fns` `format`, or `toISOString()` if you accept UTC).
     *
     * Commit timing: immediate on day click when footer is hidden
     * (`footerConfig.show === false` and no presets); with built-in or custom
     * presets, Cancel/Apply is shown by default and commit happens on Apply.
     */
    onValueChange?: (date: Date | undefined) => void;
    range?: never;
    defaultRange?: never;
    onRangeChange?: never;
};
type DatePickerRangeProps = DatePickerBaseProps & {
    mode: "range";
    /** Controlled range (`from` / `to` as `Date`). */
    range?: DateRange;
    /** Uncontrolled initial range. */
    defaultRange?: DateRange;
    /**
     * Called when the range is committed.
     *
     * Return value: `{ from?: Date; to?: Date }` or `undefined` when cleared.
     * While the user is still selecting, internal draft may have only `from`;
     * committed value updates on Apply by default. Set `footerConfig.show` to
     * `false` for immediate commit on each calendar change.
     *
     * Complex layout start/end inputs parse typed text into `Date` internally;
     * this callback still receives `Date`, not the input string.
     */
    onRangeChange?: (range: DateRange | undefined) => void;
    value?: never;
    defaultValue?: never;
    onValueChange?: never;
};
type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

declare function DatePicker(props: DatePickerProps): React$1.JSX.Element;
declare namespace DatePicker {
    var displayName: string;
}

/** Format a `Date` for display (same rules as the DatePicker trigger). */
declare const formatDateValue: (date: Date | undefined, locale: string, options?: Intl.DateTimeFormatOptions, formatString?: string) => string;
/** Format a range for display (same rules as the range trigger). */
declare const formatRangeValue: (range: DateRange | undefined, locale: string, options?: Intl.DateTimeFormatOptions, formatString?: string) => string;
/**
 * Parse a typed date string for complex range inputs.
 * Accepts only complete `M/D/YYYY` or ISO `YYYY-MM-DD` — partial values like `2` or `2/1`
 * are rejected so `Date` does not auto-expand them (e.g. `new Date("2")` → 2/1/2001).
 */
declare const parseDateInput: (value: string) => Date | undefined;

/**
 * Available view modes for the DataView component
 * @description Determines how data is displayed
 * - "grid": Card-based grid layout
 * - "list": List-based layout with compact rows
 * - "table": Traditional table layout with columns
 */
type View = "grid" | "list" | "table";

/**
 * Values for select-type headers
 * @description Can be a simple string or an object with label and value
 */
type HeaderSelectValues = string | {
    label: string;
    value: boolean | string;
};
/**
 * Types of header interactions
 * @description Determines the interactive behavior of column headers
 * - "sort": Enables sorting functionality
 * - "select": Provides dropdown selection
 * - "checkbox": Enables row selection
 * - "input": Provides text input for filtering
 * - "text": Static text header
 * - "date": Date picker for date-based filtering (stores value as "yyyy-MM-dd" ISO string)
 */
type HeaderType = "sort" | "select" | "checkbox" | "input" | "text" | "date";
/**
 * Column header configuration
 * @description Defines how a column header appears and behaves
 */
type Header = {
    /**
     * Display text for the header
     * @description The visible label for the column header
     */
    label: string;
    /**
     * Type of header interaction
     * @description Determines what interactive features the header provides
     */
    type: HeaderType;
    /**
     * Optional values for select-type headers
     * @description Used when header type is "select" to define dropdown options
     */
    values?: HeaderSelectValues[];
    /**
     * Enable multi-value OR filtering for select-type headers
     * @description When true, users can pick multiple enum values for this column.
     * The column filter value is stored as string[] and rows match when the cell
     * value is included in the selection. Defaults to single-select (string).
     */
    multi?: boolean;
    /**
     * Show a search input inside multi-select header filters
     * @description Opt-in. Only applies when `type` is `"select"` and `multi` is true.
     * Filters visible options by case-insensitive substring on label and value.
     * @default false
     */
    searchable?: boolean;
    /**
     * Date display format for date-type headers
     * @description Controls how the selected date is displayed in the header button.
     * Uses date-fns format strings. Only applies when type is "date".
     * @default "PPP" (e.g. "April 21st, 2026")
     */
    dateFormat?: string;
    /**
     * DatePicker selection mode for date-type headers
     * @description When type is "date", controls single-day vs range filtering.
     * Stored filter value is `"yyyy-MM-dd"` for single or `[from, to]` for range.
     * @default "single"
     */
    datePickerMode?: "single" | "range";
};
/**
 * Function type for rendering custom header elements
 * @template TData - The type of data objects in the table
 * @description Function that renders custom elements in the header area
 */
type HeaderElementRenderer<TData> = (args: {
    /**
     * The table instance
     * @description Provides access to table state and methods
     */
    table: Table$1<TData>;
    /**
     * Currently selected rows
     * @description Array of data objects for selected rows
     */
    selectedRows: TData[];
}) => ReactNode;
/**
 * Configuration for filter elements
 * @description Defines how filtering is implemented for specific columns
 */
type FilterElement = {
    /**
     * Key to access data from the row object
     * @description Must match a property name in your data objects
     */
    accessorKey: string;
    /**
     * Display label for the filter
     * @description The visible label for the filter element
     */
    label: string;
    /**
     * Available values for select-type filters
     * @description Array of options for dropdown filters
     */
    values?: string[];
    /**
     * Enable multi-value OR filtering for select-type filter elements
     * @description When true, users can pick multiple enum values for this column.
     * Apply stores string[] on the column filter; clearing all selections removes
     * the filter for that column.
     */
    multi?: boolean;
    /**
     * Show a search input inside multi-select filter sheet controls
     * @description Opt-in. Only applies when `type` is `"select"` and `multi` is true.
     * @default false
     */
    searchable?: boolean;
    /**
     * Type of filter element
     * @description Determines the filter's input method
     * - "input": Text input field
     * - "select": Dropdown selection
     * - "sort": Sorting controls
     * - "custom": Custom rendered element
     * - "date": Date picker (single: "yyyy-MM-dd"; range: [from, to] — compatible with dateFilterFn)
     */
    type: "input" | "select" | "sort" | "custom" | "date";
    /**
     * Date display format for date-type filter elements
     * @description Controls how the selected date is displayed in the picker button.
     * Uses date-fns format strings. Only applies when type is "date".
     * The stored filter value is always "yyyy-MM-dd" regardless of this setting.
     * @default "PPP" (e.g. "April 21st, 2026")
     */
    dateFormat?: string;
    /**
     * DatePicker selection mode for date-type filter elements
     * @description Stored filter value is `"yyyy-MM-dd"` for single or `[from, to]` for range.
     * @default "single"
     */
    datePickerMode?: "single" | "range";
    /**
     * Custom renderer for filter element
     * @description Used when type is "custom" to render the filter element
     * @param value - Current filter value
     * @param onChange - Function to update the filter value
     * @returns React node for the custom filter element
     */
    renderCustomElement?: ({ value, onChange, }: {
        value: string;
        onChange: (value: string | {
            target: {
                value: string;
            };
        }) => void;
    }) => React.ReactNode;
};
/**
 * Configuration for the filter button sheet
 * @description Defines the content and behavior of the filter sheet modal
 */
type FilterButtonSheetProps = {
    /**
     * Text for the primary action button
     * @description Usually "Apply" or "Filter"
     */
    primaryButtonText: string;
    /**
     * Text for the secondary action button
     * @description Usually "Clear" or "Reset"
     */
    secondaryButtonText: string;
    /**
     * Header text for the sheet
     * @description Title displayed at the top of the filter sheet
     */
    headerText: string;
    /**
     * Description text for the sheet
     * @description Additional context or instructions for the filter sheet
     */
    descriptionText: string;
    /**
     * Array of filter elements
     * @description Filter controls to display in the sheet
     */
    filterElements: FilterElement[];
};
/**
 * Configuration for the DataView header
 * @template TData - The type of data objects in the table
 */
type HeaderConfig<TData> = {
    /**
     * Title text for the table
     * @description Displayed prominently in the header area
     */
    title: string;
    /**
     * Show the columns visibility dropdown
     * @description Enables users to toggle column visibility
     */
    showColumnsDropdown: boolean;
    /**
     * Show the view switcher (table/grid/list)
     * @description Enables users to switch between different view modes
     */
    showViewSwitcher: boolean;
    /**
     * Custom elements for the first header row
     * @description Elements to display in the top row of the header
     */
    rowOneCustomElements?: HeaderElementRenderer<TData>[];
    /**
     * Custom elements for the left side of the second header row
     * @description Elements to display on the left side of the second header row
     */
    rowTwoLeftCustomElements?: HeaderElementRenderer<TData>[];
    /**
     * Custom elements for the right side of the second header row
     * @description Elements to display on the right side of the second header row
     */
    rowTwoRightCustomElements?: HeaderElementRenderer<TData>[];
    /**
     * Configuration for the filter button sheet
     * @description Settings for the filter modal that appears when filter button is clicked
     */
    filterButtonSheetProps?: FilterButtonSheetProps;
    /**
     * Configuration for the create button
     * @description Settings for the primary action button in the header
     */
    createButtonProps?: {
        /**
         * Text to display on the create button
         * @description The button label
         */
        text: string;
        /**
         * Icon to display in the create button
         * @description React node for the button icon
         */
        icon?: React.ReactNode;
        /**
         * Click handler for the create button
         * @description Called when the create button is clicked
         * @param e - The mouse event
         * @param table - The table instance
         */
        onClick: (e: React.MouseEvent<Element>, table: Table$1<TData>) => void;
    };
};
declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        dropdownItemDisabled?: boolean;
        dropdownItemLabel?: string;
        hideDropdownItem?: boolean;
        sacrificeWidth?: number;
        pinTo?: "right" | "left";
        /** Used by DataTable to apply sort-header-only cell chrome */
        headerType?: HeaderType;
        /** Narrow padding for the injected row drag-handle column */
        isRowDragHandleColumn?: boolean;
    }
}

/**
 * Types of footer elements
 * @description Available footer element types for different functionalities
 * - "button": Custom button element
 * - "paginationNumber": Shows current page number
 * - "paginationSize": Dropdown to change items per page
 * - "pageInput": Input to change page number
 * - "totalRows": Shows filtered row count as "Total Rows: X"
 */
type FooterElementType = "button" | "paginationNumber" | "paginationSize" | "pageInput" | "totalRows";
/**
 * Configuration for individual footer elements
 * @template TData - The type of data objects in the table
 */
type FooterElement<TData> = {
    /**
     * Type of footer element
     * @description Determines the element's functionality and appearance
     */
    type: FooterElementType;
    /**
     * Optional icon to display
     * @description React node for an icon (typically for button elements)
     */
    icon?: ReactNode;
    /**
     * Button variant for button-type elements
     * @description Styling variant when type is "button"
     */
    variant?: VariantProps<typeof buttonVariants>["variant"];
    /**
     * Click handler for button elements
     * @description Called when a button-type footer element is clicked
     * @param table - The table instance
     */
    onClick?: (table: Table$1<TData>) => void;
    /**
     * Display label for the element
     * @description Text to show for custom elements
     */
    label?: string;
    /**
     * Handler for pagination previous button
     * @description Called when pagination previous button is clicked
     * @param pageNum - New page number
     */
    onPreviousClick?: (pageNum: number) => void;
    /**
     * Handler for pagination next button
     * @description Called when pagination next button is clicked
     * @param pageNum - New page number
     */
    onPaginationNextClick?: (pageNum: number) => void;
    /**
     * Handler for pagination number clicks
     * @description Called when a specific page number is clicked
     * @param pageNum - New page number
     */
    onPaginationNumberClick?: (pageNum: number) => void;
    /**
     * Handler for pagination size changes
     * @description Called when the items per page value changes
     * @param paginationSize - The new pagination size
     */
    onPaginationSizeValueChange?: (paginationSize: number) => void;
    onPageInputChange?: (pageNumber: number) => void;
};
/**
 * Configuration for footer elements layout
 * @template TData - The type of data objects in the table
 */
type FooterElements<TData> = {
    /**
     * Footer elements for the left side
     * @description Array of elements to display on the left side of the footer
     */
    leftSide?: FooterElement<TData>[];
    /**
     * Footer elements for the center
     * @description Array of elements centered in the footer (e.g. paginationNumber)
     */
    centerSide?: FooterElement<TData>[];
    /**
     * Footer elements for the right side
     * @description Array of elements to display on the right side of the footer
     */
    rightSide?: FooterElement<TData>[];
};

/**
 * Available cell types for data display
 * @description Determines how cell data is rendered and what interactions are available
 * - "avatar": User profile image with fallback
 * - "text": Plain text display
 * - "switch": Toggle switch for boolean values
 * - "button": Interactive button element
 * - "checkbox": Checkbox for selection
 * - "progress": Progress bar visualization
 * - "multiBadge": Multiple badge elements
 * - "badge": Single badge element (default secondary); options.badge.getTone(row) returns success/destructive outline tones
 * - "statusBadge": Status indicator badge; options.statusBadge.colourMap (dot), labelColourMap (label tone), showDot (optional dot)
 * - "thumbnail": Image thumbnail
 * - "dateLong": Full date format
 * - "dateHoursAgo": Relative time format
 * - "multiAction": Multiple action buttons/menu
 * - "currency": Formatted currency display
 * - "link": Clickable link element
 * - "indicator": Read-only tri-state icon (yes / no / na)
 * - "textWithMeta": Primary + optional secondary text parts with shared decoration/link options
 */
type CellType = "avatar" | "text" | "switch" | "button" | "checkbox" | "progress" | "multiBadge" | "badge" | "statusBadge" | "thumbnail" | "dateLong" | "dateHoursAgo" | "multiAction" | "currency" | "link" | "indicator" | "textWithMeta";
type DataViewIndicatorValue = "yes" | "no" | "na";

type SelectionContext<TData> = {
    /**
     * Array of currently selected row data
     * @description Contains the original data objects for all rows with checkboxes checked
     */
    selectedRows: TData[];
};
type DisabledOption<TData> = {
    /**
     * Disable interaction for this cell or action
     * @description Static boolean or per-row predicate (e.g. record locked by another user)
     */
    disabled?: boolean | ((row: Row<TData>) => boolean);
};

type TextWithMetaTone = "default" | "muted";
type TextWithMetaLayout = "inline" | "stacked";
type TextWithMetaPartBase<TData> = DisabledOption<TData> & {
    /**
     * Visible label for this part
     * @description Static string or per-row resolver. Primary falls back to row[accessorKey] when omitted.
     */
    text?: string | ((row: Row<TData>) => ReactNode);
    /**
     * Semantic tone for non-link text
     * @default "default"
     */
    tone?: TextWithMetaTone;
    /**
     * Text shown before the part label
     */
    prefix?: string | ((row: Row<TData>) => string);
    /**
     * Text shown after the part label
     */
    suffix?: string | ((row: Row<TData>) => string);
    /**
     * Anchor target when href is used
     * @description Defaults to "_blank" when not specified
     */
    target?: string;
};
/**
 * One part of a textWithMeta cell — href navigation (native anchor)
 */
type TextWithMetaPartWithHref<TData> = TextWithMetaPartBase<TData> & {
    href?: string | ((row: Row<TData>) => string);
    onClick?: never;
};
/**
 * One part of a textWithMeta cell — onClick navigation (link-styled button)
 */
type TextWithMetaPartWithOnClick<TData> = TextWithMetaPartBase<TData> & {
    href?: never;
    target?: never;
    onClick: (e: React.MouseEvent<HTMLButtonElement>, row: Row<TData>) => void;
};
/**
 * Shared shape for primary and secondary textWithMeta parts
 */
type TextWithMetaPart<TData> = TextWithMetaPartWithHref<TData> | TextWithMetaPartWithOnClick<TData>;
type TextWithMetaOptions<TData> = {
    /**
     * Layout mode for the two parts.
     *
     * Both modes use a **2-line cell budget** total:
     * - `inline`: primary + secondary flow together inside one `line-clamp-2` block.
     * - `stacked`: line 1 = primary, line 2 = secondary (one truncated row each).
     *
     * @default "inline"
     */
    layout?: TextWithMetaLayout;
    /**
     * Main line or leading inline segment
     */
    primary: TextWithMetaPart<TData>;
    /**
     * Optional trailing inline segment or second stacked line
     * @description Secondary `href` / `onClick` stay clickable when `isRowDisabled(row)`
     * is true unless this part's own `disabled` is set.
     */
    secondary?: TextWithMetaPart<TData>;
};

/**
 * Copy action bound to the value shown in a table cell
 * @description Opt-in via `options.cellActions`. Omit `cellActions` to hide the control.
 */
type CellCopyAction<TData> = {
    action: "copy";
    /**
     * Accessible name for the idle copy button
     * @example "Copy user ID"
     */
    label: string;
    /**
     * Accessible name while success feedback is showing
     * @default "Copied"
     */
    copiedLabel?: string;
    /**
     * String written to the clipboard
     * @description Return null, undefined, or "" to hide the control for that row.
     * Choose the displayed label, raw accessor, or any other identifier here.
     */
    getCopyValue: (row: Row<TData>) => string | null | undefined;
    /**
     * Called after a successful clipboard write
     * @description DataView does not show a toast; use this to notify the user.
     */
    onCopied?: (value: string, row: Row<TData>) => void;
    /**
     * Called when clipboard write fails
     * @description The control stays idle (no success state).
     */
    onCopyError?: (error: unknown, row: Row<TData>) => void;
    /**
     * Idle icon
     * @default lucide `Copy`
     */
    icon?: ReactNode;
    /**
     * Success icon
     * @default lucide `Check`
     */
    copiedIcon?: ReactNode;
};
/**
 * Cell-level actions rendered next to the cell value
 * @description v1 supports `action: "copy"` only. The first copy action is used.
 */
type CellAction<TData> = CellCopyAction<TData>;

type BadgeCellTone = "success" | "destructive";

/**
 * Semantic label tones for statusBadge cells.
 * Extend this union and STATUS_BADGE_LABEL_CLASS when adding new tones.
 */
type StatusBadgeLabelTone = "destructive" | "foreground";

/**
 * Base configuration for link cell options
 * @template TData - The type of data objects in the table
 * @description Common properties for both href and onClick link cells
 */
type CellLinkOptionsBase<TData> = DisabledOption<TData> & {
    /**
     * Display text for the link
     * @description The visible text for the link
     */
    text?: string;
    /**
     * Icon to display with the link
     * @description React node for link icon
     */
    icon?: ReactNode;
};
/**
 * Link cell that navigates via URL (native anchor)
 * @template TData - The type of data objects in the table
 * @description Use when the link should support right-click "Open in new tab".
 * Falls back to the cell value when getHrefValue is omitted.
 */
type CellLinkOptionsWithHref<TData> = CellLinkOptionsBase<TData> & {
    /**
     * Function to generate the href value
     * @description Called to generate the URL for the link
     * @param row - The row data
     * @returns The URL string for the link
     */
    getHrefValue?: (row: Row<TData>) => string;
    /**
     * Anchor target attribute
     * @description Defaults to "_blank" when not specified
     */
    target?: string;
    onClick?: never;
};
/**
 * Link cell styled as a link but driven by an onClick handler
 * @template TData - The type of data objects in the table
 * @description Use for in-app navigation (e.g. router.push) without full page reload.
 */
type CellLinkOptionsWithOnClick<TData> = CellLinkOptionsBase<TData> & {
    getHrefValue?: never;
    target?: never;
    /**
     * Click handler for the link-styled button
     * @description Called when the link is clicked
     * @param e - The mouse event
     * @param row - The row data containing the link
     */
    onClick: (e: React.MouseEvent<HTMLButtonElement>, row: Row<TData>) => void;
};
type CellLinkOptions<TData> = CellLinkOptionsWithHref<TData> | CellLinkOptionsWithOnClick<TData>;

/**
 * Base configuration for multi-action items
 * @template TData - The type of data objects in the table
 * @description Common properties for both link and button multi-action items
 */
type MultiActionItemBase<TData> = {
    /**
     * Icon to display for the action
     * @description React node for the action icon
     */
    icon?: ReactNode;
    /**
     * Tooltip text shown on hover
     * @description When provided, wraps the button in a Tooltip
     */
    tooltip?: string;
    /**
     * Conditionally hide this action based on row data
     * @description Return true to hide the action for a given row
     * @param row - The row to evaluate
     */
    hidden?: (row: Row<TData>) => boolean;
};
/**
 * Individual multi-action item rendered as a native <a> anchor
 * @template TData - The type of data objects in the table
 * @description Use when the action navigates to a URL. Renders a native <a>
 * element so right-click "Open in new tab" works in the browser.
 */
type MultiActionItemLink<TData> = MultiActionItemBase<TData> & {
    /**
     * URL for the anchor element
     * @description Static string or a function that derives the href from the row
     */
    href: string | ((row: Row<TData>) => string);
    /**
     * Anchor target attribute
     * @description Defaults to "_blank" when not specified
     */
    target?: string;
    onClick?: never;
};
/**
 * Individual multi-action item rendered as a button
 * @template TData - The type of data objects in the table
 * @description Use when the action triggers an in-page callback
 */
type MultiActionItemButton<TData> = MultiActionItemBase<TData> & {
    href?: never;
    /**
     * Click handler for the action
     * @description Called when the action is clicked
     * @param row - The row containing the action
     * @param selectionContext - Context about currently selected rows
     */
    onClick?: (row: Row<TData>, selectionContext: SelectionContext<TData>) => void;
};
/**
 * Individual multi-action item
 * @template TData - The type of data objects in the table
 * @description Simple action item with icon and either an href (renders <a>)
 * or an onClick handler (renders <button>)
 */
type MultiActionItem<TData> = MultiActionItemLink<TData> | MultiActionItemButton<TData>;
/**
 * Multi-action item with dropdown
 * @template TData - The type of data objects in the table
 * @description Action item that opens a dropdown with multiple options
 */
type MultiActionItem2<TData> = {
    /**
     * Dropdown menu items
     * @description Array of options to display in the dropdown
     */
    dropdownItems: {
        /**
         * Display text for the dropdown item
         */
        text: string;
        /**
         * Conditionally hide this dropdown item based on row data
         * @description Return true to hide the item for a given row
         * @param row - The row to evaluate
         */
        hidden?: (row: Row<TData>) => boolean;
        /**
         * Click handler for the dropdown item
         * @param row - The row containing the action
         * @param selectionContext - Context about currently selected rows
         */
        onClick: (row: Row<TData>, selectionContext: SelectionContext<TData>) => void;
    }[];
};
/**
 * Union type for multi-action configurations
 * @template TData - The type of data objects in the table
 * @description Can be either a simple action or a dropdown action
 */
type MultiAction<TData> = MultiActionItem<TData> | MultiActionItem2<TData>;

/**
 * Per-row label resolver for progress cells
 */
type ProgressLabelResolver<TData> = (row: Row<TData>) => string;
/**
 * Data accessors for the fractionPercent progress preset
 */
type ProgressFractionPercentOptions<TData> = {
    /**
     * Current count (numerator), e.g. active promo-code uses
     */
    current: (row: Row<TData>) => number;
    /**
     * Total capacity (denominator), e.g. promo-code limit
     */
    total: (row: Row<TData>) => number;
};
/**
 * Configuration for progress-type cells
 */
type ProgressOptions<TData> = {
    /**
     * Built-in label + bar formatter
     * @description `fractionPercent` renders start/end labels and derives bar fill
     */
    preset?: "fractionPercent";
    /**
     * Accessors for `preset: "fractionPercent"`
     */
    fractionPercent?: ProgressFractionPercentOptions<TData>;
    /**
     * Generic label slots above the bar (max two: start left, end right)
     * @description Ignored when `preset: "fractionPercent"` is set
     */
    labels?: {
        start?: ProgressLabelResolver<TData>;
        end?: ProgressLabelResolver<TData>;
    };
};

/**
 * Configuration options for different cell types
 * @template TData - The type of data objects in the table
 */
type CellOptions<TData> = {
    /**
     * Configuration for switch-type cells
     * @description Options for toggle switch cells
     */
    switch?: {
        /**
         * Handler for switch toggle
         * @description Called when the switch is toggled
         * @param e - The new boolean value of the switch
         * @param row - The row data containing the switch
         */
        onClick?: (e: boolean, row: Row<TData>) => void;
    };
    /**
     * Configuration for multi-action cells
     * @description Options for cells with multiple action buttons
     */
    multiAction?: {
        /**
         * Array of action items
         * @description Actions to display in the multi-action cell
         */
        values: MultiAction<TData>[];
    };
    /**
     * Configuration for button-type cells
     * @description Options for button cells
     */
    button?: DisabledOption<TData> & {
        /**
         * Button styling variant
         * @description Visual style variant for the button
         */
        variant?: VariantProps<typeof buttonVariants>["variant"];
        /**
         * Icon to display in the button
         * @description React node for button icon
         */
        icon?: ReactNode;
        /**
         * Text to display in the button
         * @description Button label text
         */
        text?: string;
        /**
         * Conditionally hide this button based on row data
         * @description Return true to hide the button for a given row
         * @param row - The row to evaluate
         */
        hidden?: (row: Row<TData>) => boolean;
        /**
         * Click handler for the button
         * @description Called when the button is clicked
         * @param e - The mouse event
         * @param row - The row data containing the button
         */
        onClick?: (e: React.MouseEvent<HTMLButtonElement>, row: Row<TData>) => void;
    };
    /**
     * Configuration for link-type cells
     * @description Options for link cells — either href-based (anchor) or onClick-based (button)
     */
    link?: CellLinkOptions<TData>;
    /**
     * Configuration for badge cells
     * @description Resolve semantic tone from row context. When omitted or
     * returns undefined/null, Badge uses variant secondary.
     */
    badge?: {
        getTone?: (row: Row<TData>) => BadgeCellTone | null | undefined;
    };
    /**
     * Configuration for indicator cells
     * @description Resolve tri-state display from row context. When omitted,
     * falls back to row[accessorKey] as 'yes' | 'no' | 'na'.
     */
    indicator?: {
        getIndicatorValue?: (row: Row<TData>) => DataViewIndicatorValue;
    };
    /**
     * Configuration for status badge cells
     * @description Options for status badge cells
     */
    statusBadge?: {
        /**
         * Color mapping for different status values
         * @description Maps status cell values to dot colours (CSS color values or keywords). Required only when showDot is true (default).
         */
        colourMap?: Record<string, string>;
        /**
         * Semantic label tone mapping for status cell values
         * @description Maps status cell values to label text colours. Unmapped values use default body text. Disabled rows always use muted foreground.
         */
        labelColourMap?: Record<string, StatusBadgeLabelTone>;
        /**
         * Whether to render the leading colour dot
         * @description Defaults to true. When false, only the label text is shown (labelColourMap still applies).
         */
        showDot?: boolean;
    };
    /**
     * Configuration for currency cells
     * @description Options for currency display formatting
     */
    currency?: {
        /**
         * Number of decimal places to show
         * @description Defaults to 2 (e.g. $7,500.00). Use 0 for whole dollars.
         */
        fractionDigits?: number;
    };
    /**
     * Configuration for dateLong cells
     * @description Controls which parts of a Date-parseable value are shown
     */
    date?: {
        /**
         * Display mode for dateLong cells
         * @description
         * - "date": date line only (MM/DD/YYYY)
         * - "time": time line only (when value includes time)
         * - "dateTime": date and time on separate lines (default)
         * @default "dateTime"
         */
        display?: "date" | "time" | "dateTime";
    };
    /**
     * Configuration for textWithMeta cells
     * @description Mixed primary/secondary text with optional links per part
     */
    textWithMeta?: TextWithMetaOptions<TData>;
    /**
     * Configuration for progress cells
     * @description Optional labels above the bar and preset formatters
     */
    progress?: ProgressOptions<TData>;
    /**
     * Actions tied to this cell's value (not whole-row actions)
     * @description Opt-in. Currently only `{ action: "copy" }` is supported.
     * The first copy action is rendered to the right of the value. The control
     * is omitted when `getCopyValue` is empty or the row is disabled.
     * Ignored for `checkbox` and `avatar` cells. Progress cells render copy
     * beside the bar (same row). Whole-row edit/delete stay on `multiAction`.
     */
    cellActions?: CellAction<TData>[];
};

/**
 * Tooltip configuration for body cells
 * @template TData - The type of data objects in the table
 */
type CellTooltip<TData> = {
    /**
     * Whether the tooltip is enabled for the given row
     * @description When omitted, defaults to false (no tooltip)
     * @param row - The row to evaluate
     */
    enabled?: (row: Row<TData>) => boolean;
    /**
     * Tooltip content for the given row
     * @description Only evaluated when `enabled(row)` returns true
     * @param row - The row to evaluate
     */
    content: (row: Row<TData>) => ReactNode;
};

/**
 * Aggregation strategy for totals footer cells
 */
type ColumnTotalsAggregation = "sum" | "avg";
/**
 * Per-column totals footer configuration
 */
type ColumnTotalsConfig = {
    /**
     * Whether to show a summary cell for this column in the totals row.
     * When false, the cell renders "–" instead of an aggregate or distribution.
     * @default true
     */
    enabled?: boolean;
    /**
     * How to aggregate numeric values for this column.
     * When omitted, currency defaults to sum and progress defaults to avg.
     */
    aggregation?: ColumnTotalsAggregation;
    /**
     * Formats the aggregated numeric total for display.
     * When omitted, currency sums use currency formatting and other numeric
     * aggregates default to en-US with up to 2 fraction digits.
     */
    format?: (value: number) => string;
};
/**
 * One bucket in a categorical totals-footer distribution.
 * Percentages are computed client-side from count and totalRows.
 */
type DistributionBucket = {
    value: string | boolean;
    count: number;
};
/**
 * Server-provided distribution summaries keyed by column accessorKey.
 */
type TotalsFooterDistributions = {
    /**
     * Filtered parent-row count used as the tooltip "(N total)" denominator.
     */
    totalRows: number;
    /**
     * Per-column bucket counts. Keys match column.accessorKey.
     */
    values: Partial<Record<string, DistributionBucket[]>>;
};
/**
 * Totals footer configuration for numeric and categorical column summaries
 */
type TotalsFooterConfig = {
    /**
     * When true, renders a sticky totals row at the bottom of the table scroll area.
     * The totals row shares the body table's column layout and horizontal scroll.
     * @default false
     */
    enabled?: boolean;
    /**
     * Server-provided aggregate values keyed by column accessorKey.
     * Required when pagination.mode or filtering.mode is "server".
     */
    values?: Partial<Record<string, number>>;
    /**
     * Server-provided categorical distributions keyed by column accessorKey.
     * Use alongside values for mixed numeric + distribution tables.
     */
    distributions?: TotalsFooterDistributions;
};

/**
 * Column definition for DataView tables
 * @template TData - The type of data objects in the table
 */
type Column<TData> = {
    /**
     * Maximum width of the column
     * @description The maximum width of the column in pixels
     */
    maxSize?: number;
    /**
     * Minimum width of the column
     * @description The minimum width of the column in pixels
     */
    minSize?: number;
    size?: number;
    /**
     * Key to access data from the row object
     * @description Must match a property name in your data objects
     * @example "name", "email", "id"
     */
    accessorKey: string;
    /**
     * Type of cell to render
     * @description Determines how the cell data is displayed and what interactions are available
     */
    type: CellType;
    /**
     * Header configuration for the column
     * @description Defines the column header appearance and behavior
     */
    header: Header;
    /**
     * Conditionally hide cell content for a given row
     * @description Return true to render nothing for this cell in the given row
     * @param row - The row to evaluate
     */
    hidden?: (row: Row<TData>) => boolean;
    /**
     * Show a tooltip on the cell content on hover
     * @description
     * Truncated content always shows a tooltip with the full cell label on hover.
     * When `enabled(row)` returns true, `content(row)` is shown on hover even if
     * the content is not truncated. When `enabled` is omitted, only overflow
     * triggers a tooltip.
     */
    tooltip?: CellTooltip<TData>;
    /**
     * Column metadata and styling options
     * @description Additional configuration for column behavior and appearance
     */
    meta?: {
        /**
         * Disable the column in the dropdown menu
         * @description Prevents the column from being toggled in the columns dropdown
         */
        dropdownItemDisabled?: boolean;
        /**
         * Custom label for the dropdown menu
         * @description Overrides the header label in the columns dropdown
         */
        dropdownItemLabel?: string;
        /**
         * Hide the column from the dropdown menu
         * @description Removes the column from the columns dropdown entirely
         */
        hideDropdownItem?: boolean;
        /**
         * Width to sacrifice for this column
         * @description Used for responsive layout calculations
         */
        sacrificeWidth?: number;
        /**
         * Pin the column to a specific side
         * @description Pins the column to the left or right side of the table
         */
        pinTo?: "right" | "left";
    };
    /**
     * Cell-specific options
     * @description Configuration options based on the cell type
     */
    options?: CellOptions<TData>;
    /**
     * Totals footer aggregation for this column
     * @description Controls how numeric values are summarized in the totals row
     */
    totals?: ColumnTotalsConfig;
};

/**
 * Available cell sizes for table display
 * @description Controls the height and density of table cells
 * - "Small": Compact cells with reduced height
 * - "Medium": Standard height cells with normal spacing
 */
type TableCellSize = "Small" | "Medium";
/**
 * Row detail overlay presentation when opening detail from a row click
 */
type RowDetailMode = "sheet" | "modal";
/**
 * Row detail overlay width preset — interpreted per `rowDetailMode`:
 * - modal: md = 45vw (1/2), lg = 65vw (3/4); omit for lg
 * - sheet: md = 25vw (1/4), lg = 50vw (1/2); omit for md
 */
type RowDetailSize = "md" | "lg";
/**
 * Chrome configuration for row detail overlay (sheet or modal)
 */
type RowDetailConfig = {
    titleText?: string;
    closeText?: string;
    className?: string;
    /**
     * Width preset for the overlay shell
     */
    size?: RowDetailSize;
    /**
     * When false, hides the shell Close button (custom footer may still render)
     * @default true
     */
    showCloseButton?: boolean;
};
/**
 * Available row surface styles for table body rows
 * @description Controls whether body rows use a flat background or zebra striping
 * - "default": uniform row background
 * - "zebra": alternating stripe background on visible body rows
 */
type TableRowStyle = "default" | "zebra";

type SortingChangeArgs = {
    /**
     * The column accessor key that triggered the sorting change
     * @description null when multiple columns change at once (e.g., bulk sort via filter sheet)
     */
    accessorKey: string | null;
    /**
     * The sorting state before the change
     */
    prev: SortingState;
    /**
     * The sorting state after the change
     */
    next: SortingState;
};
/**
 * Arguments passed to the onRowReorder callback after a drag-and-drop reorder
 * on a single-page, non-paginated table.
 */
type RowReorderArgs = {
    /** Row id of the dragged row */
    activeId: string;
    /** Row id of the row dropped onto */
    overId: string;
    /** Index before reorder */
    oldIndex: number;
    /** Index after reorder */
    newIndex: number;
    /** Row ids in their new order */
    orderedIds: string[];
};
/**
 * Arguments passed to the onFilterChange callback
 * @description Provides the accessor key that triggered the change, along with the previous and next filter state
 */
type FilterChangeArgs = {
    /**
     * The column accessor key that triggered the filter change
     * @description null when multiple filters are applied at once (e.g., filter sheet apply button)
     */
    accessorKey: string | null;
    /**
     * The column filter state before the change
     */
    prev: ColumnFiltersState;
    /**
     * The column filter state after the change
     * @description For multi-select filters (header.multi or filterElement.multi),
     * the changed column's value is string[]. Single-select filters remain string.
     */
    next: ColumnFiltersState;
};
/**
 * Filtering mode configuration
 * @description Controls whether filtering is performed client-side or server-side.
 * Mirrors the Pagination API for consistency.
 *
 * - "client" (default): TanStack Table filters the in-memory data rows automatically.
 * - "server": Internal filtering is disabled (manualFiltering: true). DataView only
 *   fires onFilterChange so the consumer can issue an API call. The data prop must
 *   already contain the correctly filtered rows returned by the server.
 *
 * @important When using mode "server", you must implement onFilterChange to
 * re-fetch data from the server. Without it, filter input will appear to have
 * no effect because the data prop is not updated.
 */
type Filtering = {
    /**
     * Filtering mode
     * @description "client" for client-side filtering, "server" for server-side filtering
     * @default "client"
     */
    mode: "client" | "server";
};
/**
 * Sorting mode configuration
 * @description Controls whether sorting is performed client-side or server-side.
 * Mirrors the Pagination and Filtering APIs for consistency.
 *
 * - "client" (default): TanStack Table sorts the in-memory data rows automatically.
 * - "server": Internal sorting is disabled (manualSorting: true). DataView only
 *   fires onSortingChange so the consumer can issue an API call. The data prop must
 *   already contain rows in the order returned by the server.
 *
 * @important When using mode "server", you must implement onSortingChange to
 * re-fetch data from the server. Without it, sort headers will update visually
 * but row order will not change because the data prop is not updated.
 */
type Sorting = {
    /**
     * Sorting mode
     * @description "client" for client-side sorting, "server" for server-side sorting
     * @default "client"
     */
    mode: "client" | "server";
};
type Pagination$1 = {
    /**
     * Pagination mode
     * @description "client" for client-side pagination, "server" for server-side pagination
     * @default "client"
     */
    mode: "client" | "server";
    /**
     * Total number of pages (only used in server mode)
     * @description Used when pagination mode is "server"
     * @default undefined
     */
    pageCount?: number;
    /**
     * Current page index (0-based)
     * @description The page currently being displayed
     * @default 0
     */
    pageIndex?: number;
    /**
     * Number of items per page
     * @description How many rows to show on each page
     * @default 20
     */
    pageSize?: number;
    /**
     * Dropdown options for the pagination size footer control
     * @description Replaces the default `[10, 20, 50]` options when provided.
     * Invalid values (<= 0) are ignored. Empty arrays fall back to the defaults.
     */
    pageSizeOptions?: number[];
    /**
     * Whether to show the "Default (Fit)" page-size option
     * @description When false, page size is chosen only from `pageSizeOptions`
     * and fit-to-container calculation is not offered in the dropdown.
     * @default true
     */
    includeFitPageSize?: boolean;
    /**
     * Callback fired whenever internal pagination state changes.
     * @description Called on initial fit page size resolution after mount, page navigation,
     * and page size changes via the dropdown. Use this to align server-side API calls
     * with the current pagination state, including the initially calculated fit page size.
     * @param state - The new pagination state containing pageIndex and pageSize
     */
    onPaginationChange?: (state: {
        pageIndex: number;
        pageSize: number;
    }) => void;
};

/**
 * Configuration object for the DataView component
 * @template TData - The type of data objects in the table
 */
type DataViewProps<TData> = {
    /**
     * Additional CSS class names to apply to the root container
     * @description Use to control width, layout, or other styles on the outermost element
     */
    className?: string;
    /**
     * Whether the data is currently loading
     * @description When true, shows loading placeholders instead of actual data
     * @default false
     */
    isLoading?: boolean;
    /**
     * The array of data rows to display in the table
     * @description Each object in this array represents a row in the table
     */
    data: TData[];
    /**
     * The current view mode for displaying data
     * @description Determines how the data is rendered - as a table, grid, or list
     * @example "table" | "grid" | "list"
     */
    view: View;
    /**
     * Configuration object for the table's header (optional)
     * @description Controls the header appearance, title, and interactive elements
     */
    headerConfig?: HeaderConfig<TData>;
    /**
     * Optional configuration for table-specific settings
     * @description Controls table layout, columns, pagination, and rendering behavior
     */
    tableConfig?: {
        /**
         * Enable hoverable rows
         * @description When true, rows will be hoverable
         * @default true
         */
        hoverableRows?: boolean;
        /**
         * Row surface style for table body rows
         * @description Use "zebra" to enable alternating stripe backgrounds
         * @default "default"
         */
        rowStyle?: TableRowStyle;
        /**
         * Enable auto layout when table width is below this value
         * @description When table width falls below this pixel value, automatic column sizing is enabled
         * @default undefined
         */
        enableAutoLayoutOnWidth?: number;
        /**
         * Table layout mode
         * @description Controls how columns are sized and positioned
         * @default "fixed"
         */
        layout?: "fixed" | "auto";
        /**
         * Array of column definitions
         * @description Each column defines how data is displayed and what interactions are available
         * @required
         */
        columns: Column<TData>[];
        /**
         * Row detail overlay mode when a row is clicked
         * @description Controls whether row detail opens in a right-side Sheet (default)
         * or a large centered Dialog (workspace-style modal). Requires
         * `canOpenRowDetail` and `renderRowDetail`.
         * @default "sheet"
         */
        rowDetailMode?: RowDetailMode;
        /**
         * Function to determine if a row can open row detail
         * @description Called for each row to determine if clicking it should open the row
         * detail overlay (sheet or modal per `rowDetailMode`)
         * @param row - The row data object
         * @returns boolean indicating if the row can open row detail
         * @default () => false
         */
        canOpenRowDetail?: (row: Row<TData>) => boolean;
        /**
         * Callback when a table row is clicked
         * @description Fires when the user clicks a non-disabled row outside interactive
         * cell elements (buttons, links, checkboxes, etc.). Use `row.original` to access
         * the row data. Does not fire on disabled rows. Can be combined with
         * `canOpenRowDetail` — both the callback and row detail toggle run on the same click.
         * @param row - The TanStack table row that was clicked
         * @default undefined
         */
        onRowClick?: (row: Row<TData>) => void;
        /**
         * Per-row gate for `onRowClick`
         * @description When `onRowClick` is set, only rows where this returns true show a
         * pointer cursor and invoke the callback. Rows that return false behave like rows
         * without `onRowClick` (no pointer, callback skipped). Defaults to true for all
         * non-disabled rows when omitted.
         * @param row - The row to evaluate
         * @default undefined (all non-disabled rows are clickable when onRowClick is set)
         */
        canRowClick?: (row: Row<TData>) => boolean;
        /**
         * Predicate for row-level disabled state
         * @description When true, the entire row is muted, non-interactive, and cannot be
         * selected or opened via row detail. Independent from cell-level `disabled` and from
         * any locked-state UI (e.g. lock badges remain full-color). `textWithMeta`
         * secondary `href` / `onClick` parts stay clickable unless the part itself is
         * disabled.
         * @param row - The row to evaluate
         * @default () => false
         */
        isRowDisabled?: (row: Row<TData>) => boolean;
        /**
         * Predicate for row-level locked state
         * @description When true, shows an amber lock chip inline after the first column's
         * primary value. Indicator-only — does not mute the row or block interaction.
         * Independent from `isRowDisabled`; both may be true on the same row.
         * @param row - The row to evaluate
         * @default () => false
         */
        isRowLocked?: (row: Row<TData>) => boolean;
        /**
         * Optional hover tooltip for locked rows
         * @description Only shown when `isRowLocked(row)` is true and this returns content.
         * When omitted or empty, no visible tooltip is shown (aria-label still applies).
         * @param row - The locked row
         */
        getRowLockedTooltip?: (row: Row<TData>) => ReactNode;
        /**
         * Pagination configuration
         * @description Controls how data is paginated and displayed
         */
        pagination?: Pagination$1;
        /**
         * Filtering mode configuration
         * @description Controls whether filtering is done client-side or server-side.
         * When mode is "server", internal TanStack filtering is disabled and onFilterChange
         * must be used to trigger API re-fetches with the new filter values.
         * @default { mode: "client" }
         */
        filtering?: Filtering;
        /**
         * Sorting mode configuration
         * @description Controls whether sorting is done client-side or server-side.
         * When mode is "server", internal TanStack sorting is disabled and onSortingChange
         * must be used to trigger API re-fetches with the new sort state.
         * @default { mode: "client" }
         */
        sorting?: Sorting;
        /**
         * Hide or show row borders
         * @description Controls the visibility of bottom borders on table rows
         * @default false
         */
        removeRowBorder?: boolean;
        /**
         * Custom renderer for sub-rows
         * @description Renders custom content inside expandable sub-rows
         * @param row - The parent row data
         * @returns React node to render in the sub-row
         * @default undefined
         */
        renderCustomSubRow?: (row: Row<TData>) => React.ReactNode;
        /**
         * Custom renderer for hybrid sub-rows
         * @description Renders both the sub-row data and custom content beneath it
         * @param row - The parent row data
         * @returns React node to render in the hybrid sub-row
         * @default undefined
         */
        renderHybridSubrow?: (row: Row<TData>) => React.ReactNode;
        /**
         * Custom renderer for row detail body content
         * @description Renders scrollable body content inside the row detail overlay when a row
         * is clicked. Header title comes from `rowDetailConfig`; footer uses
         * `renderRowDetailFooter` and/or shell Close per `rowDetailConfig.showCloseButton`.
         * @param row - The row data that opened row detail
         * @returns React node to render in the overlay body
         * @default undefined
         */
        renderRowDetail?: (row: Row<TData>) => React.ReactNode;
        /**
         * Custom renderer for row detail footer content
         * @description Renders sticky footer content (e.g. Save/Cancel action group) in sheet or
         * modal row detail. Shell Close is separate — control with `rowDetailConfig.showCloseButton`.
         * @param row - The row that opened row detail
         * @returns React node to render in the overlay footer
         * @default undefined
         */
        renderRowDetailFooter?: (row: Row<TData>) => React.ReactNode;
        /**
         * Configuration for row detail overlay chrome
         * @description Title, close button, width preset, and optional shell className
         */
        rowDetailConfig?: RowDetailConfig;
        /**
         * Key to access sub-rows from data object
         * @description If provided, sub-rows will be accessed using this key instead of 'subRows'
         * @default null (uses 'subRows' property)
         */
        subRowKey?: keyof TData | null;
        /**
         * Reserve leading icon space on the first data column
         * @description When true, the first non-checkbox column reserves a fixed-width
         * slot in every header and body cell. Rows with sub-row chevrons or row-detail
         * icons show the icon; other rows show an empty placeholder so text aligns.
         * Consumer decides when alignment is needed — no automatic detection.
         * @default false
         */
        reserveLeadingSpace?: boolean;
        /**
         * Size of table cells
         * @description Controls the height and density of table cells
         * @default "Medium"
         */
        cellSize?: TableCellSize;
        /**
         * Callback for input header changes
         * @description Called when text is entered in input-type headers
         * @param e - The change event from the input element
         * @default undefined
         */
        onInputHeaderChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
        /**
         * Callback for sorting state changes
         * @description Called when the sorting state changes (e.g., column header click, filter sheet apply).
         * Use this to trigger server-side sorting requests.
         * @param args - The sorting change arguments containing accessorKey, prev, and next state
         * @default undefined
         */
        onSortingChange?: (args: SortingChangeArgs) => void;
        /**
         * Callback for column filter state changes
         * @description Called when column filters change (e.g., select/input header, filter sheet apply).
         * Use this to trigger server-side filtering requests.
         * @param args - The filter change arguments containing accessorKey, prev, and next state
         * @default undefined
         */
        onFilterChange?: (args: FilterChangeArgs) => void;
        /**
         * Default sorting state
         * @description Initial sorting state for the table. Use this to restore
         * sorting from external sources (e.g., URL query params) on mount.
         * @default []
         */
        defaultSorting?: SortingState;
        /**
         * Default column filters state
         * @description Initial column filter state for the table. Use this to restore
         * filters from external sources (e.g., URL query params) on mount.
         * @default []
         */
        defaultColumnFilters?: ColumnFiltersState;
        /**
         * Custom renderer for empty state
         * @description Renders content when no data is available
         * @param table - The table instance
         * @returns React node to render when no results are found
         * @default undefined
         */
        renderNoResults?: (table: Table$1<TData>) => React.ReactNode;
        /**
         * Totals footer configuration for numeric column summaries
         * @description Renders a sticky totals row in the table scroll area, above the horizontal scrollbar and pagination footer
         */
        totalsFooter?: TotalsFooterConfig;
        /**
         * Enable drag-and-drop row reordering for single-page lists (no pagination).
         * When true, a GripVertical handle column is injected as the leftmost column.
         *
         * **Do not use with paginated tables.** Reorder applies only to the current
         * page; page 2+ is not supported reliably in v1. Omit pagination or show
         * the full ordered set on one page.
         *
         * Requires optional peer dependencies (install in the consumer app):
         * `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
         *
         * @default false
         */
        enableRowReorder?: boolean;
        /**
         * Called after a row is dropped in a new position on a single-page table.
         * When `optimisticRowReorder` is true (default), DataView reorders the
         * in-memory data until the `data` prop is refreshed by the consumer.
         */
        onRowReorder?: (args: RowReorderArgs) => void;
        /**
         * When true (default with row reorder enabled), applies the dropped order
         * to the in-memory table data until the consumer passes updated `data`.
         * Set false to keep rows in place until external data refresh.
         * @default true
         */
        optimisticRowReorder?: boolean;
        /**
         * Stable row id for reorder callbacks and selection.
         * Required when `enableRowReorder` is true.
         */
        getRowId?: (originalRow: TData, index: number) => string;
    } & ({
        enableRowReorder: true;
        getRowId: (originalRow: TData, index: number) => string;
    } | {
        enableRowReorder?: false;
    });
    /**
     * Optional configuration for footer elements
     * @description Controls what appears at the bottom of the table
     */
    footerConfig?: {
        /**
         * Footer elements configuration
         * @description Defines elements to display on the left and right sides of the footer
         */
        footerElements: FooterElements<TData>;
    };
};

declare function DataView<TData>({ data, view, headerConfig, tableConfig, footerConfig, isLoading, className, }: DataViewProps<TData>): React$1.JSX.Element;
declare namespace DataView {
    var displayName: string;
}

declare function Drawer({ ...props }: React$1.ComponentProps<typeof Drawer$1.Root>): React$1.JSX.Element;
declare function DrawerTrigger({ ...props }: React$1.ComponentProps<typeof Drawer$1.Trigger>): React$1.JSX.Element;
declare function DrawerPortal({ ...props }: React$1.ComponentProps<typeof Drawer$1.Portal>): React$1.JSX.Element;
declare function DrawerClose({ ...props }: React$1.ComponentProps<typeof Drawer$1.Close>): React$1.JSX.Element;
declare function DrawerOverlay({ className, ...props }: React$1.ComponentProps<typeof Drawer$1.Overlay>): React$1.JSX.Element;
declare function DrawerContent({ className, children, ...props }: React$1.ComponentProps<typeof Drawer$1.Content>): React$1.JSX.Element;
declare function DrawerHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function DrawerFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function DrawerTitle({ className, ...props }: React$1.ComponentProps<typeof Drawer$1.Title>): React$1.JSX.Element;
declare function DrawerDescription({ className, ...props }: React$1.ComponentProps<typeof Drawer$1.Description>): React$1.JSX.Element;

declare function DropdownMenu({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Root>): React$1.JSX.Element;
declare function DropdownMenuPortal({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Portal>): React$1.JSX.Element;
declare function DropdownMenuTrigger({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Trigger>): React$1.JSX.Element;
declare function DropdownMenuContent({ className, sideOffset, fitContent, style, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
    /** Size to children instead of viewport-available max height (e.g. sidebar flyout). */
    fitContent?: boolean;
}): React$1.JSX.Element;
declare function DropdownMenuGroup({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Group>): React$1.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): React$1.JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, checked, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>): React$1.JSX.Element;
declare function DropdownMenuRadioGroup({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>): React$1.JSX.Element;
declare function DropdownMenuRadioItem({ className, children, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>): React$1.JSX.Element;
declare function DropdownMenuLabel({ className, inset, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Separator>): React$1.JSX.Element;
declare function DropdownMenuShortcut({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
declare function DropdownMenuSub({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Sub>): React$1.JSX.Element;
declare function DropdownMenuSubTrigger({ className, inset, children, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function DropdownMenuSubContent({ className, fitContent, style, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.SubContent> & {
    fitContent?: boolean;
}): React$1.JSX.Element;

declare const Form: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>({ children, watch, getValues, getFieldState, setError, clearErrors, setValue, setValues, trigger, formState, resetField, reset, handleSubmit, unregister, control, register, setFocus, subscribe, }: react_hook_form.FormProviderProps<TFieldValues, TContext, TTransformedValues>) => React$1.JSX.Element;
declare const FormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ ...props }: ControllerProps<TFieldValues, TName>) => React$1.JSX.Element;
declare const useFormField: () => {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isValidating: boolean;
    error?: react_hook_form.FieldError;
    id: string;
    name: string;
    formItemId: string;
    formDescriptionId: string;
    formMessageId: string;
};
declare function FormItem({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function FormLabel({ className, ...props }: React$1.ComponentProps<typeof LabelPrimitive.Root>): React$1.JSX.Element;
declare function FormControl({ ...props }: React$1.ComponentProps<typeof Slot>): React$1.JSX.Element;
declare function FormDescription({ className, ...props }: React$1.ComponentProps<"p">): React$1.JSX.Element;
declare function FormMessage({ className, ...props }: React$1.ComponentProps<"p">): React$1.JSX.Element | null;

declare function HoverCard({ ...props }: React$1.ComponentProps<typeof HoverCardPrimitive.Root>): React$1.JSX.Element;
declare function HoverCardTrigger({ ...props }: React$1.ComponentProps<typeof HoverCardPrimitive.Trigger>): React$1.JSX.Element;
declare function HoverCardContent({ className, align, sideOffset, ...props }: React$1.ComponentProps<typeof HoverCardPrimitive.Content>): React$1.JSX.Element;

declare function InputGroup({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare const inputGroupAddonVariants: (props?: ({
    align?: "inline-start" | "inline-end" | "block-start" | "block-end" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
declare function InputGroupAddon({ className, align, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>): React$1.JSX.Element;
declare const inputGroupButtonVariants: (props?: ({
    size?: "sm" | "xs" | "icon-xs" | "icon-sm" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
declare function InputGroupButton({ className, type, variant, size, ...props }: Omit<React$1.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>): React$1.JSX.Element;
declare function InputGroupText({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
declare function InputGroupInput({ className, ...props }: React$1.ComponentProps<"input">): React$1.JSX.Element;
declare function InputGroupTextarea({ className, ...props }: React$1.ComponentProps<"textarea">): React$1.JSX.Element;

declare function InputOTP({ className, containerClassName, ...props }: React$1.ComponentProps<typeof OTPInput> & {
    containerClassName?: string;
}): React$1.JSX.Element;
declare function InputOTPGroup({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function InputOTPSlot({ index, className, ...props }: React$1.ComponentProps<"div"> & {
    index: number;
}): React$1.JSX.Element;
declare function InputOTPSeparator({ ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;

declare function Label({ className, ...props }: React$1.ComponentProps<typeof LabelPrimitive.Root>): React$1.JSX.Element;

declare function Menubar({ className, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Root>): React$1.JSX.Element;
declare function MenubarMenu({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Menu>): React$1.JSX.Element;
declare function MenubarGroup({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Group>): React$1.JSX.Element;
declare function MenubarPortal({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Portal>): React$1.JSX.Element;
declare function MenubarRadioGroup({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.RadioGroup>): React$1.JSX.Element;
declare function MenubarTrigger({ className, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Trigger>): React$1.JSX.Element;
declare function MenubarContent({ className, align, alignOffset, sideOffset, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Content>): React$1.JSX.Element;
declare function MenubarItem({ className, inset, variant, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): React$1.JSX.Element;
declare function MenubarCheckboxItem({ className, children, checked, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.CheckboxItem>): React$1.JSX.Element;
declare function MenubarRadioItem({ className, children, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.RadioItem>): React$1.JSX.Element;
declare function MenubarLabel({ className, inset, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function MenubarSeparator({ className, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Separator>): React$1.JSX.Element;
declare function MenubarShortcut({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
declare function MenubarSub({ ...props }: React$1.ComponentProps<typeof MenubarPrimitive.Sub>): React$1.JSX.Element;
declare function MenubarSubTrigger({ className, inset, children, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function MenubarSubContent({ className, ...props }: React$1.ComponentProps<typeof MenubarPrimitive.SubContent>): React$1.JSX.Element;

declare function NavigationMenu({ className, children, viewport, ...props }: React$1.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean;
}): React$1.JSX.Element;
declare function NavigationMenuList({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuPrimitive.List>): React$1.JSX.Element;
declare function NavigationMenuItem({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuPrimitive.Item>): React$1.JSX.Element;
declare const navigationMenuTriggerStyle: (props?: class_variance_authority_dist_types.ClassProp | undefined) => string;
declare function NavigationMenuTrigger({ className, children, ...props }: React$1.ComponentProps<typeof NavigationMenuPrimitive.Trigger>): React$1.JSX.Element;
declare function NavigationMenuContent({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuPrimitive.Content>): React$1.JSX.Element;
declare function NavigationMenuViewport({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuPrimitive.Viewport>): React$1.JSX.Element;
declare function NavigationMenuLink({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuPrimitive.Link>): React$1.JSX.Element;
declare function NavigationMenuIndicator({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuPrimitive.Indicator>): React$1.JSX.Element;

declare function Pagination({ className, ...props }: React$1.ComponentProps<"nav">): React$1.JSX.Element;
declare function PaginationContent({ className, ...props }: React$1.ComponentProps<"ul">): React$1.JSX.Element;
declare function PaginationItem({ ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;
type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<React$1.ComponentProps<typeof Button>, "size"> & React$1.ComponentProps<"a">;
declare function PaginationLink({ className, isActive, size, ...props }: PaginationLinkProps): React$1.JSX.Element;
declare function PaginationPrevious({ className, size, ...props }: React$1.ComponentProps<typeof PaginationLink>): React$1.JSX.Element;
declare function PaginationNext({ className, size, ...props }: React$1.ComponentProps<typeof PaginationLink>): React$1.JSX.Element;
declare function PaginationEllipsis({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;

declare function Popover({ ...props }: React$1.ComponentProps<typeof PopoverPrimitive.Root>): React$1.JSX.Element;
declare function PopoverTrigger({ ...props }: React$1.ComponentProps<typeof PopoverPrimitive.Trigger>): React$1.JSX.Element;
declare function PopoverContent({ className, align, sideOffset, ...props }: React$1.ComponentProps<typeof PopoverPrimitive.Content>): React$1.JSX.Element;
declare function PopoverAnchor({ ...props }: React$1.ComponentProps<typeof PopoverPrimitive.Anchor>): React$1.JSX.Element;

declare function Progress({ className, value, ...props }: React$1.ComponentProps<typeof ProgressPrimitive.Root>): React$1.JSX.Element;

declare function RadioGroup({ className, ...props }: React$1.ComponentProps<typeof RadioGroupPrimitive.Root>): React$1.JSX.Element;
declare function RadioGroupItem({ className, ...props }: React$1.ComponentProps<typeof RadioGroupPrimitive.Item>): React$1.JSX.Element;

declare function ResizablePanelGroup({ className, ...props }: React$1.ComponentProps<typeof ResizablePrimitive.PanelGroup>): React$1.JSX.Element;
declare function ResizablePanel({ ...props }: React$1.ComponentProps<typeof ResizablePrimitive.Panel>): React$1.JSX.Element;
declare function ResizableHandle({ withHandle, className, ...props }: React$1.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
    withHandle?: boolean;
}): React$1.JSX.Element;

declare function ScrollArea({ className, children, ...props }: React$1.ComponentProps<typeof ScrollAreaPrimitive.Root>): React$1.JSX.Element;
declare function ScrollBar({ className, orientation, ...props }: React$1.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>): React$1.JSX.Element;

declare function Select({ ...props }: React$1.ComponentProps<typeof SelectPrimitive.Root>): React$1.JSX.Element;
declare function SelectGroup({ ...props }: React$1.ComponentProps<typeof SelectPrimitive.Group>): React$1.JSX.Element;
declare function SelectValue({ ...props }: React$1.ComponentProps<typeof SelectPrimitive.Value>): React$1.JSX.Element;
declare function SelectTrigger({ className, size, children, ...props }: React$1.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default";
}): React$1.JSX.Element;
declare function SelectContent({ className, children, position, ...props }: React$1.ComponentProps<typeof SelectPrimitive.Content>): React$1.JSX.Element;
declare function SelectLabel({ className, ...props }: React$1.ComponentProps<typeof SelectPrimitive.Label>): React$1.JSX.Element;
declare function SelectItem({ className, children, ...props }: React$1.ComponentProps<typeof SelectPrimitive.Item>): React$1.JSX.Element;
declare function SelectSeparator({ className, ...props }: React$1.ComponentProps<typeof SelectPrimitive.Separator>): React$1.JSX.Element;
declare function SelectScrollUpButton({ className, ...props }: React$1.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): React$1.JSX.Element;
declare function SelectScrollDownButton({ className, ...props }: React$1.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): React$1.JSX.Element;

declare function Sheet({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Root>): React$1.JSX.Element;
declare function SheetTrigger({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Trigger>): React$1.JSX.Element;
declare function SheetClose({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Close>): React$1.JSX.Element;
declare function SheetContent({ className, children, side, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
}): React$1.JSX.Element;
declare function SheetHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SheetFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SheetTitle({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Title>): React$1.JSX.Element;
declare function SheetDescription({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Description>): React$1.JSX.Element;

declare function Skeleton({ className, ...props }: React.ComponentProps<"div">): React$1.JSX.Element;

declare function Slider({ className, defaultValue, value, min, max, ...props }: React$1.ComponentProps<typeof SliderPrimitive.Root>): React$1.JSX.Element;

declare function Spinner({ className, ...props }: React.ComponentProps<"svg">): React$1.JSX.Element;

type MenuItem = {
    text: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};
type SplitButtonProps = React.ComponentProps<typeof Button> & {
    text: string;
    items: MenuItem[];
    icon?: LucideIcon;
};
declare function SplitButton({ icon: Icon, text, items, onClick, disabled, ...restProps }: SplitButtonProps): React$1.JSX.Element;

/** Luminis Toast always uses richColors + sonnerFeedbackThemeClassNames (DS tokens). */
type ToastProps = Omit<ToasterProps, "richColors">;
declare const Toast: ({ style, toastOptions, className, ...props }: ToastProps) => React$1.JSX.Element;

declare function Switch({ className, size, ...props }: React$1.ComponentProps<typeof SwitchPrimitive.Root> & {
    size?: "sm" | "default";
}): React$1.JSX.Element;

declare function Table({ tableRef, className, shouldRenderFooter, fillHeight, ...props }: React$1.ComponentProps<"table"> & {
    tableRef?: React$1.RefObject<HTMLDivElement | null>;
    shouldRenderFooter?: boolean;
    fillHeight?: boolean;
}): React$1.JSX.Element;
declare function TableHeader({ className, ...props }: React$1.ComponentProps<"thead">): React$1.JSX.Element;
declare function TableBody({ className, ...props }: React$1.ComponentProps<"tbody">): React$1.JSX.Element;
declare function TableFooter({ className, ...props }: React$1.ComponentProps<"tfoot">): React$1.JSX.Element;
declare function TableRow({ className, hoverableRows, ref, ...props }: React$1.ComponentProps<"tr"> & {
    hoverableRows?: boolean;
    ref?: React$1.Ref<HTMLTableRowElement>;
}): React$1.JSX.Element;
declare function TableHead({ className, ...props }: React$1.ComponentProps<"th">): React$1.JSX.Element;
type TableCellProps = React$1.ComponentProps<"td"> & {
    size?: "Medium" | "Small";
};
declare function TableCell({ className, size, ...props }: TableCellProps): React$1.JSX.Element;
declare function TableCaption({ className, ...props }: React$1.ComponentProps<"caption">): React$1.JSX.Element;

type TabNavLinksProps = {
    links: {
        path: string;
        text: string;
        hasNotifications: boolean;
    }[];
    onNavigate?: (path: string) => void;
};
declare function TabNavLinks({ links, onNavigate }: TabNavLinksProps): React$1.JSX.Element;

declare function Tabs({ className, ...props }: React$1.ComponentProps<typeof TabsPrimitive.Root>): React$1.JSX.Element;
declare function TabsList({ className, ...props }: React$1.ComponentProps<typeof TabsPrimitive.List>): React$1.JSX.Element;
declare function TabsTrigger({ className, ...props }: React$1.ComponentProps<typeof TabsPrimitive.Trigger>): React$1.JSX.Element;
declare function TabsContent({ className, ...props }: React$1.ComponentProps<typeof TabsPrimitive.Content>): React$1.JSX.Element;

declare function Textarea({ className, ...props }: React$1.ComponentProps<"textarea">): React$1.JSX.Element;

declare const toggleVariants: (props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
declare function Toggle({ className, variant, size, ...props }: React$1.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>): React$1.JSX.Element;

declare function ToggleGroup({ className, variant, size, children, ...props }: React$1.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>): React$1.JSX.Element;
declare function ToggleGroupItem({ className, children, variant, size, ...props }: React$1.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>): React$1.JSX.Element;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Alert, AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AlertTitle, AppSidebar, AspectRatio, Avatar, AvatarFallback, AvatarImage, Badge, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, ButtonsGroup, Calendar, CalendarDayButton, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, ChartContainer, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip, ChartTooltipContent, Checkbox, Collapsible, CollapsibleContent, CollapsibleTrigger, Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxValue, Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger, DataView, DatePicker, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, HoverCard, HoverCardContent, HoverCardTrigger, Input, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Label, Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarPortal, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, Popover, PopoverAnchor, PopoverContent, PopoverTrigger, Progress, RadioGroup, RadioGroupItem, ResizableHandle, ResizablePanel, ResizablePanelGroup, STATIC_SIDEBAR_ROW_CLASSNAME, ScrollArea, ScrollBar, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, Separator, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, Skeleton, Slider, Spinner, SplitButton, Switch, TabNavLinks, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, Toast, Toggle, ToggleGroup, ToggleGroupItem, Tooltip, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger, applySidebarActiveState, badgeVariants, buttonVariants, formatDateValue, formatRangeValue, formatSidebarBadge, hasDescendantBadge, isSidebarItemActive, isStaticHeader, navigationMenuTriggerStyle, normalizeFooter, normalizeHeader, parseDateInput, resolveItemBadge, resolveSidebarItemActive, resolveSubItemBadge, toggleVariants, useComboboxAnchor, useFormField, useSidebar };
export type { AppSidebarData, AppSidebarFooter, AppSidebarHeader, AppSidebarProps, CalendarMonthsLayout, CarouselApi, CellAction, CellCopyAction, Column, ColumnTotalsAggregation, ColumnTotalsConfig, DatePickerFooterAction, DatePickerFooterClearAction, DatePickerFooterConfig, DatePickerMode, DatePickerPreset, DatePickerProps, DatePickerRangeProps, DatePickerSingleProps, DatePickerSize, DistributionBucket, Group, Item, MenuItemWrapperProps, RowReorderArgs, SidebarIcon, SidebarNavClickEvent, SidebarSubItem, SubMenuChevronPlacement, Team, TotalsFooterConfig, TotalsFooterDistributions, User };
