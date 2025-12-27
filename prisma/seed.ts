// prisma/seed.ts
import { PrismaClient, Role, RequestStatus, RequestType } from '../lib/generated/prisma/client';
import {prisma} from '../lib/prisma'

// const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1) Clear existing data in correct order
  await prisma.maintenanceRequest.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.maintenanceTeam.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  // 2) Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@gearguard.com',
      role: Role.ADMIN,
      image: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
    },
  });

  const technicianMech = await prisma.user.create({
    data: {
      name: 'Ravi Mechanic',
      email: 'ravi.mechanic@gearguard.com',
      role: Role.TECHNICIAN,
      image: 'https://api.dicebear.com/7.x/initials/svg?seed=Ravi',
    },
  });

  const technicianIT = await prisma.user.create({
    data: {
      name: 'Aarav IT',
      email: 'aarav.it@gearguard.com',
      role: Role.TECHNICIAN,
      image: 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav',
    },
  });

  const requesterProd = await prisma.user.create({
    data: {
      name: 'Priya Production',
      email: 'priya.prod@gearguard.com',
      role: Role.REQUESTER,
      image: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya',
    },
  });

  const requesterOffice = await prisma.user.create({
    data: {
      name: 'Karan Office',
      email: 'karan.office@gearguard.com',
      role: Role.REQUESTER,
      image: 'https://api.dicebear.com/7.x/initials/svg?seed=Karan',
    },
  });

  // 3) Departments
  const productionDept = await prisma.department.create({
    data: { name: 'Production' },
  });

  const itDept = await prisma.department.create({
    data: { name: 'IT' },
  });

  const logisticsDept = await prisma.department.create({
    data: { name: 'Logistics' },
  });

  // 4) Maintenance Teams
  const mechanicsTeam = await prisma.maintenanceTeam.create({
    data: {
      name: 'Mechanics',
      technicians: {
        connect: [{ id: technicianMech.id }],
      },
    },
  });

  const itSupportTeam = await prisma.maintenanceTeam.create({
    data: {
      name: 'IT Support',
      technicians: {
        connect: [{ id: technicianIT.id }],
      },
    },
  });

  // 5) Equipment
  const now = new Date();

  const cncMachine = await prisma.equipment.create({
    data: {
      name: 'CNC Machine 01',
      serialNumber: 'CNC-PRD-001',
      purchaseDate: new Date(now.getFullYear() - 2, 5, 10),
      warrantyEnd: new Date(now.getFullYear() + 1, 5, 10),
      location: 'Production Floor A',
      departmentId: productionDept.id,
      ownerId: requesterProd.id,
      maintenanceTeamId: mechanicsTeam.id,
    },
  });

  const forklift = await prisma.equipment.create({
    data: {
      name: 'Forklift 01',
      serialNumber: 'FL-LOG-001',
      purchaseDate: new Date(now.getFullYear() - 3, 2, 5),
      warrantyEnd: new Date(now.getFullYear(), 2, 5),
      location: 'Warehouse Bay 3',
      departmentId: logisticsDept.id,
      ownerId: requesterProd.id,
      maintenanceTeamId: mechanicsTeam.id,
    },
  });

  const officePrinter = await prisma.equipment.create({
    data: {
      name: 'Printer 01',
      serialNumber: 'PRN-OFC-001',
      purchaseDate: new Date(now.getFullYear() - 1, 8, 15),
      warrantyEnd: new Date(now.getFullYear() + 1, 8, 15),
      location: 'Office 2nd Floor',
      departmentId: itDept.id,
      ownerId: requesterOffice.id,
      maintenanceTeamId: itSupportTeam.id,
    },
  });

  const laptop = await prisma.equipment.create({
    data: {
      name: 'Laptop - Design',
      serialNumber: 'LTP-IT-023',
      purchaseDate: new Date(now.getFullYear() - 1, 1, 20),
      warrantyEnd: new Date(now.getFullYear() + 2, 1, 20),
      location: 'Design Studio',
      departmentId: itDept.id,
      ownerId: requesterOffice.id,
      maintenanceTeamId: itSupportTeam.id,
    },
  });

  const server = await prisma.equipment.create({
    data: {
      name: 'Main Server Rack',
      serialNumber: 'SRV-IT-001',
      purchaseDate: new Date(now.getFullYear() - 4, 3, 1),
      warrantyEnd: new Date(now.getFullYear() + 1, 3, 1),
      location: 'Server Room',
      departmentId: itDept.id,
      ownerId: admin.id,
      maintenanceTeamId: itSupportTeam.id,
    },
  });

  // 6) Maintenance Requests
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);

  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  const nextMonth = new Date(now);
  nextMonth.setMonth(now.getMonth() + 1);

  // Flow 1 – Corrective / Breakdown
  await prisma.maintenanceRequest.createMany({
    data: [
      {
        subject: 'CNC spindle making noise',
        description: 'Operator reported unusual vibration and noise from spindle.',
        type: RequestType.CORRECTIVE,
        equipmentId: cncMachine.id,
        scheduledDate: yesterday, // overdue if not repaired
        durationHours: 3,
        status: RequestStatus.IN_PROGRESS,
        assignedTechnicianId: technicianMech.id,
        createdById: requesterProd.id,
        maintenanceTeamId: mechanicsTeam.id,
      },
      {
        subject: 'Forklift hydraulic leak',
        description: 'Oil leak under the rear axle area.',
        type: RequestType.CORRECTIVE,
        equipmentId: forklift.id,
        scheduledDate: lastWeek, // scrap candidate
        durationHours: 5,
        status: RequestStatus.SCRAP,
        assignedTechnicianId: technicianMech.id,
        createdById: requesterProd.id,
        maintenanceTeamId: mechanicsTeam.id,
      },
      {
        subject: 'Printer paper jam recurring',
        description: 'Frequent paper jams every ~20 pages.',
        type: RequestType.CORRECTIVE,
        equipmentId: officePrinter.id,
        scheduledDate: now,
        durationHours: 1,
        status: RequestStatus.NEW,
        assignedTechnicianId: technicianIT.id,
        createdById: requesterOffice.id,
        maintenanceTeamId: itSupportTeam.id,
      },
      {
        subject: 'Laptop overheating during design work',
        description: 'Fan running at high speed, system throttling.',
        type: RequestType.CORRECTIVE,
        equipmentId: laptop.id,
        scheduledDate: nextWeek,
        durationHours: 2,
        status: RequestStatus.IN_PROGRESS,
        assignedTechnicianId: technicianIT.id,
        createdById: requesterOffice.id,
        maintenanceTeamId: itSupportTeam.id,
      },
    ],
  });

  // Flow 2 – Preventive / Routine
  await prisma.maintenanceRequest.createMany({
    data: [
      {
        subject: 'Quarterly CNC calibration',
        description: 'Routine precision calibration for CNC Machine 01.',
        type: RequestType.PREVENTIVE,
        equipmentId: cncMachine.id,
        scheduledDate: nextWeek,
        durationHours: 4,
        status: RequestStatus.NEW,
        assignedTechnicianId: technicianMech.id,
        createdById: admin.id,
        maintenanceTeamId: mechanicsTeam.id,
      },
      {
        subject: 'Forklift annual safety inspection',
        description: 'Check brakes, hydraulics, and safety signage.',
        type: RequestType.PREVENTIVE,
        equipmentId: forklift.id,
        scheduledDate: nextMonth,
        durationHours: 6,
        status: RequestStatus.NEW,
        assignedTechnicianId: technicianMech.id,
        createdById: admin.id,
        maintenanceTeamId: mechanicsTeam.id,
      },
      {
        subject: 'Server room UPS health check',
        description: 'Battery test and firmware update.',
        type: RequestType.PREVENTIVE,
        equipmentId: server.id,
        scheduledDate: nextWeek,
        durationHours: 2,
        status: RequestStatus.NEW,
        assignedTechnicianId: technicianIT.id,
        createdById: admin.id,
        maintenanceTeamId: itSupportTeam.id,
      },
      {
        subject: 'Printer monthly cleaning',
        description: 'Clean rollers and run diagnostic.',
        type: RequestType.PREVENTIVE,
        equipmentId: officePrinter.id,
        scheduledDate: nextMonth,
        durationHours: 1,
        status: RequestStatus.REPAIRED,
        assignedTechnicianId: technicianIT.id,
        createdById: admin.id,
        maintenanceTeamId: itSupportTeam.id,
      },
    ],
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });