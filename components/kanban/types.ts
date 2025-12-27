import {
  MaintenanceRequest as PrismaMaintenanceRequest,
  Equipment as PrismaEquipment,
  User as PrismaUser,
  MaintenanceTeam as PrismaMaintenanceTeam,
  RequestStatus,
  RequestType
} from '@/lib/generated/prisma/client';

export type { RequestStatus, RequestType };

export type User = PrismaUser;
export type Equipment = PrismaEquipment;
export type MaintenanceTeam = PrismaMaintenanceTeam;

export type MaintenanceRequest = PrismaMaintenanceRequest & {
  equipment?: Equipment | null;
  assignedTechnician?: User | null;
  createdBy?: User | null;
  maintenanceTeam?: MaintenanceTeam | null;
};

export interface KanbanColumn {
  id: RequestStatus;
  title: string;
  requests: MaintenanceRequest[];
}
