import { getDepartments } from "@/lib/actions/departments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/lib/generated/prisma/enums";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DepartmentsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
        redirect("/dashboard/kanban");
    }

    const { departments, error } = await getDepartments();

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                Error loading departments: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Departments Management</h2>

            <Card>
                <CardHeader>
                    <CardTitle>All Departments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>A list of all departments in the organization.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments?.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell className="font-mono">{dept.id}</TableCell>
                                    <TableCell>{dept.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
