import {
  BrainCircuit,
  Download,
  Github,
  GraduationCap,
  KanbanSquare,
  Library,
  LineChart,
  Linkedin,
  Mail,
  MapPin,
  Microscope,
  Phone,
  Users,
  type LucideProps,
} from "lucide-react";

/**
 * Explicit name -> component map. Content files reference icons by string, and
 * keeping the map explicit (rather than a dynamic import) preserves
 * tree-shaking and fails loudly in TypeScript when a name is wrong.
 */
const icons = {
  BrainCircuit,
  Download,
  Github,
  GraduationCap,
  KanbanSquare,
  LineChart,
  Linkedin,
  Mail,
  MapPin,
  Microscope,
  Phone,
  Users,
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = icons[name as IconName] ?? Library;
  return <Component aria-hidden {...props} />;
}
