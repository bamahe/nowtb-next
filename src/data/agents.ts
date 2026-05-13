/**
 * Team roster — Barrett Henry & The NOW Team
 * Static data for /agents page and team sections.
 */

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  bio: string;
  photoUrl: string;
  designations: string[];
  specialties: string[];
  isPrimary: boolean;
}

export const agents: Agent[] = [
  {
    id: "barrett-henry",
    name: "Barrett Henry",
    title: "Broker Associate | Team Lead",
    phone: "(813) 733-7907",
    email: "barrett@nowtb.com",
    bio: "Barrett Henry is a licensed real estate Broker Associate with REMAX Collective and team lead of The NOW Team. With 23+ years of real estate experience, Barrett specializes in residential sales, investment properties, new construction, and military relocation across Tampa Bay's 7-county region. Known for data-driven market analysis, relentless negotiation, and a no-nonsense approach to getting deals closed.",
    photoUrl: "/images/barrett-henry.jpg",
    designations: ["Broker Associate", "GRI", "MRP"],
    specialties: [
      "Residential Sales",
      "Investment Properties",
      "New Construction",
      "Military Relocation",
      "First-Time Buyers",
      "Luxury Homes",
    ],
    isPrimary: true,
  },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function getPrimaryAgent(): Agent {
  return agents.find((a) => a.isPrimary)!;
}
