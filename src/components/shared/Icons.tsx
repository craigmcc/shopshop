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
    KeyRound,
    Loader2,
    LogOut,
    MoreVertical,
    Plus,
    RefreshCw,
    Settings,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
    ShoppingCart,
    Trash,
    User,
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
    Password: KeyRound,
    Refresh: RefreshCw,
    Remove: Trash,
    Settings: Settings,
    Shield: Shield,
    ShieldCheck: ShieldCheck,
    ShieldQuestion: ShieldQuestion,
    ShoppingCart: ShoppingCart,
    User: User,
    UserPlus: UserPlus,
    Users: Users,
}
