import { PrismaClient, Role, RequestType, RequestStatus } from '../lib/generated/prisma/client';
import { prisma } from '../lib/prisma'
// const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Clean up existing data
    // Delete in reverse order of dependencies to avoid foreign key constraints
    await prisma.maintenanceRequest.deleteMany();
    await prisma.equipment.deleteMany();
    await prisma.maintenanceTeam.deleteMany();
    await prisma.department.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            role: Role.ADMIN,
            image: 'https://i.pravatar.cc/150?u=admin',
        },
    });

    const technician1 = await prisma.user.create({
        data: {
            name: 'John Tech',
            email: 'john.tech@example.com',
            role: Role.TECHNICIAN,
            image: 'https://i.pravatar.cc/150?u=john',
        },
    });

    const technician2 = await prisma.user.create({
        data: {
            name: 'Jane Fix',
            email: 'jane.fix@example.com',
            role: Role.TECHNICIAN,
            image: 'https://i.pravatar.cc/150?u=jane',
        },
    });

    const requester1 = await prisma.user.create({
        data: {
            name: 'Alice Requester',
            email: 'alice.req@example.com',
            role: Role.REQUESTER,
            image: 'https://i.pravatar.cc/150?u=alice',
        },
    });

    const requester2 = await prisma.user.create({
        data: {
            name: 'Bob Employee',
            email: 'bob.emp@example.com',
            role: Role.REQUESTER,
            image: 'https://i.pravatar.cc/150?u=bob',
        },
    });

    console.log('Users created.');

    // Create Departments
    const deptIT = await prisma.department.create({
        data: {
            name: 'IT Department',
        },
    });

    const deptManufacturing = await prisma.department.create({
        data: {
            name: 'Manufacturing',
        },
    });

    console.log('Departments created.');

    // Create Maintenance Teams
    const teamHardware = await prisma.maintenanceTeam.create({
        data: {
            name: 'Hardware Support',
            technicians: {
                connect: [{ id: technician1.id }],
            },
        },
    });

    const teamMechanics = await prisma.maintenanceTeam.create({
        data: {
            name: 'Heavy Mechanics',
            technicians: {
                connect: [{ id: technician2.id }],
            },
        },
    });

    console.log('Maintenance Teams created.');

    // Create Equipment
    const laptop1 = await prisma.equipment.create({
        data: {
            name: 'MacBook Pro M3',
            serialNumber: 'SN-MBP-001',
            purchaseDate: new Date('2024-01-15'),
            warrantyEnd: new Date('2025-01-15'),
            location: 'Office 301',
            departmentId: deptIT.id,
            ownerId: requester1.id,
            maintenanceTeamId: teamHardware.id,
        },
    });

    const printer1 = await prisma.equipment.create({
        data: {
            name: 'HP LaserJet Pro',
            serialNumber: 'SN-HP-999',
            purchaseDate: new Date('2023-05-10'),
            location: 'Reception',
            departmentId: deptIT.id,
            ownerId: admin.id, // Admin manages reception equipment
            maintenanceTeamId: teamHardware.id,
        },
    });

    const cncMachine = await prisma.equipment.create({
        data: {
            name: 'CNC Milling Machine',
            serialNumber: 'SN-CNC-X500',
            purchaseDate: new Date('2022-11-20'),
            warrantyEnd: new Date('2025-11-20'),
            location: 'Factory Floor A',
            departmentId: deptManufacturing.id,
            ownerId: requester2.id,
            maintenanceTeamId: teamMechanics.id,
        },
    });

    console.log('Equipment created.');

    // Create Maintenance Requests
    await prisma.maintenanceRequest.create({
        data: {
            subject: 'Laptop Overheating',
            description: 'The laptop gets very hot during video calls.',
            type: RequestType.CORRECTIVE,
            equipmentId: laptop1.id,
            scheduledDate: new Date('2024-02-10'),
            status: RequestStatus.NEW,
            createdById: requester1.id,
            // Not assigned yet
        },
    });

    await prisma.maintenanceRequest.create({
        data: {
            subject: 'Monthly Printer Check',
            description: 'Routine maintenance and toner replacement.',
            type: RequestType.PREVENTIVE,
            equipmentId: printer1.id,
            scheduledDate: new Date('2024-02-05'),
            durationHours: 2,
            status: RequestStatus.REPAIRED,
            assignedTechnicianId: technician1.id,
            createdById: admin.id,
            maintenanceTeamId: teamHardware.id,
        },
    });

    await prisma.maintenanceRequest.create({
        data: {
            subject: 'CNC Calibration Error',
            description: 'Z-axis seems to be off by 2mm.',
            type: RequestType.CORRECTIVE,
            equipmentId: cncMachine.id,
            scheduledDate: new Date('2024-02-12'),
            status: RequestStatus.IN_PROGRESS,
            assignedTechnicianId: technician2.id,
            createdById: requester2.id,
            maintenanceTeamId: teamMechanics.id,
        },
    });

    console.log('Maintenance Requests created.');
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
