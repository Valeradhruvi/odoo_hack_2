import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { EquipmentForm } from "@/components/forms/EquipmentForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; // Need to create Dialog component or use standard shadcn
// I will create a simple Dialog component next or inline the form for now in a separate page if Dialog is too complex to scaffold manually.
// Actually, let's put the form in a Collapsible or just a separate page `app/equipment/new/page.tsx`? 
// The user structure didn't have `new`, but `equipment` page. Let's make a "Add Equipment" button that toggles a form or redirects. 
// For simplicity without Shadcn Dialog, I'll redirect to a new page or just render itconditionally? 
// The user requested `equipment/page.tsx` as "Equipment list".
// I'll stick to a clean list and maybe a "Create" button that opens a modal if I can make one, or just a separate route.
// Let's create `components/ui/dialog.tsx` as it's very useful.

async function getEquipment() {
    return await prisma.equipment.findMany({
        include: {
            department: true,
            team: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export default async function EquipmentPage() {
    const equipmentList = await getEquipment();

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Equipment Inventory</h1>
                {/* For now, just a button, we'll implement the modal mechanism or separate page */}
                {/* Using a client component wrapper for the form dialog would be best. */}
                <Button asChild>
                    <Link href="/equipment/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Equipment
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {equipmentList.map((item) => (
                    <Link href={`/equipment/${item.id}`} key={item.id}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span>{item.name}</span>
                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{item.serialNumber}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Location: {item.location}</p>
                                    <p>Department: {item.department?.name || 'N/A'}</p>
                                    <p>Team: {item.team?.name || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {equipmentList.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No equipment found. Add your first machine!
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple Client Component for the Dialog to avoid creating full Dialog UI file right immediately if not needed
// But wait, I can't mix server and client easily in one file without separating.
// I'll create `components/equipment/AddEquipmentDialog.tsx`
// function AddEquipmentDialog() {
//     return (
//         <Button asChild>
//             <Link href="/equipment/new">
//                 <Plus className="mr-2 h-4 w-4" /> Add Equipment
//             </Link>
//         </Button>
//     )
// }

// Actually, let's just make a route /equipment/new for simplicity as I don't want to debug shadcn dialog manual implementation right now.
// User didn't request /equipment/new in structure, but it's a logical addition for "Equipment Form".
