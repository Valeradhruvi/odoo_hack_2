import { Role, RequestType, RequestStatus } from '../lib/generated/prisma/client';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Start seeding ...');

    // Clean up existing data
    await prisma.maintenanceRequest.deleteMany();
    await prisma.equipment.deleteMany();
    await prisma.maintenanceTeam.deleteMany();
    await prisma.department.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    // Default password for all users: "password123"
    const hashedPassword = await bcrypt.hash("password123", 10);
    const now = new Date();

    // Create Users with Explicit IDs
    const admin = await prisma.user.create({
        data: {
            id: 1,
            name: 'System Admin',
            email: 'admin@example.com',
            role: Role.ADMIN,
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=admin_new',
            updatedAt: now,
            createdAt: now,
        },
    });

    const technician1 = await prisma.user.create({
        data: {
            id: 2,
            name: 'Mike Technician',
            email: 'mike.tech@example.com',
            role: Role.TECHNICIAN,
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=mike',
            updatedAt: now,
            createdAt: now,
        },
    });

    const technician2 = await prisma.user.create({
        data: {
            id: 3,
            name: 'Sarah Engineer',
            email: 'sarah.eng@example.com',
            role: Role.TECHNICIAN,
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=sarah',
            updatedAt: now,
            createdAt: now,
        },
    });

    const requester1 = await prisma.user.create({
        data: {
            id: 4,
            name: 'Tom Requester',
            email: 'tom.req@example.com',
            role: Role.REQUESTER,
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=tom',
            updatedAt: now,
            createdAt: now,
        },
    });

    console.log('Users created.');

    // Create Departments
    const deptOperations = await prisma.department.create({
        data: {
            id: 1,
            name: 'Operations',
        },
    });

    const deptLogistics = await prisma.department.create({
        data: {
            id: 2,
            name: 'Logistics',
        },
    });

    const deptIT = await prisma.department.create({
        data: {
            id: 3,
            name: 'IT Services',
        },
    });

    console.log('Departments created.');

    // Create Maintenance Teams
    // Explicit IDs for teams as well
    await prisma.maintenanceTeam.create({
        data: {
            id: 1,
            name: 'Electrical Maintenance',
            technicians: {
                connect: [{ id: technician1.id }],
            },
        },
    });

    await prisma.maintenanceTeam.create({
        data: {
            id: 2,
            name: 'Mechanical Repairs',
            technicians: {
                connect: [{ id: technician2.id }],
            },
        },
    });

    await prisma.maintenanceTeam.create({
        data: {
            id: 3,
            name: 'IT Support Team',
            technicians: {
                connect: [{ id: admin.id }],
            },
        },
    });

    console.log('Maintenance Teams created.');

    // Create Equipment
    // Using explicit IDs to be safe
    // Equipment 1
    await prisma.equipment.create({
        data: {
            id: 1,
            name: 'Conveyor Belt System A',
            serialNumber: 'CB-2024-001',
            purchaseDate: new Date('2023-01-10'),
            warrantyEnd: new Date('2026-01-10'),
            location: 'Warehouse Zone 1',
            departmentId: 2, // Logistics
            ownerId: 4, // Requester1
            maintenanceTeamId: 2, // Mechanical
        },
    });

    // Equipment 2
    await prisma.equipment.create({
        data: {
            id: 2,
            name: 'Hydraulic Press X100',
            serialNumber: 'HP-2022-555',
            purchaseDate: new Date('2022-06-15'),
            location: 'Factory Floor',
            departmentId: 1, // Operations
            ownerId: 4, // Requester1
            maintenanceTeamId: 2, // Mechanical
        },
    });

    // Equipment 3
    await prisma.equipment.create({
        data: {
            id: 3,
            name: 'Main Server Rack',
            serialNumber: 'SR-9000-PRO',
            purchaseDate: new Date('2024-03-01'),
            location: 'Server Room',
            departmentId: 3, // IT
            ownerId: 1, // Admin
            maintenanceTeamId: 3, // IT Support
        },
    });

    console.log('Equipment created.');

    // Create Maintenance Requests
    await prisma.maintenanceRequest.create({
        data: {
            id: 1,
            subject: 'Conveyor Belt Jammed',
            description: 'The belt stops moving when loaded with heavy packages.',
            type: RequestType.CORRECTIVE,
            equipmentId: 1,
            scheduledDate: new Date('2024-12-28'),
            status: RequestStatus.NEW,
            createdById: 4, // Requester1
            maintenanceTeamId: 2, // Mechanical
        },
    });

    await prisma.maintenanceRequest.create({
        data: {
            id: 2,
            subject: 'Hydraulic Fluid Leak',
            description: 'Detected a small leak near the main piston.',
            type: RequestType.CORRECTIVE,
            equipmentId: 2,
            scheduledDate: new Date('2024-12-29'),
            durationHours: 4,
            status: RequestStatus.IN_PROGRESS,
            assignedTechnicianId: 3, // Sarah (Tech2)
            createdById: 4, // Requester1
            maintenanceTeamId: 2, // Mechanical
        },
    });

    await prisma.maintenanceRequest.create({
        data: {
            id: 3,
            subject: 'Quarterly Server Maintenance',
            description: 'Dust cleaning and hardware check.',
            type: RequestType.PREVENTIVE,
            equipmentId: 3,
            scheduledDate: new Date('2025-01-15'),
            status: RequestStatus.NEW,
            createdById: 1, // Admin
            maintenanceTeamId: 3, // IT Support
        },
    });

    console.log('Maintenance Requests created.');

    // Update Sequences
    // Helper functionality to reset sequences
    // Note: Tables are mapped strings: "users", "departments", etc.
    const tables = [
        "users",
        "departments",
        "maintenance_teams",
        "equipments",
        "maintenance_requests"
    ];

    for (const table of tables) {
        try {
            await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT MAX(id) FROM ${table}) + 1);`);
            // console.log(`Sequence reset for ${table}`);
        } catch (error) {
            console.warn(`Failed to reset sequence for ${table}:`, error);
        }
    }
    console.log('Sequences reset.');

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
