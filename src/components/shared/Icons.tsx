// @/components/shared/Icons.tsx

/**
 * Icons from lucide-react that are used in this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Raw SVGs from lucide-react
import {
    Check,
    ChevronDown,
    Copy,
    Gavel,
    Loader2,
    LogOut,
    MoreVertical,
    Plus,
    RefreshCw,
    Settings,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
    ShoppingCart,
    Trash,
    UserPlus,
    Users,
} from "lucide-react";

// Logical names of our icons, along with which raw SVG should be used
export const Icons = {
    Add: Plus,
    Admin: ShieldAlert,
    Check: Check,
    Copy: Copy,
    Down: ChevronDown,
    Guest: ShieldCheck,
    Kick: Gavel,
    Leave: LogOut,
    Loader: Loader2,
    MoreVertical: MoreVertical,
    Refresh: RefreshCw,
    Remove: Trash,
    Settings: Settings,
    ShieldQuestion: ShieldQuestion,
    ShoppingCart: ShoppingCart,
    UserPlus: UserPlus,
    Users: Users,
}
