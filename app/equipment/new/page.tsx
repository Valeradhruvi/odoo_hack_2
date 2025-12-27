import { EquipmentForm } from "@/components/forms/EquipmentForm";
import { getDepartmentOptions } from "@/lib/actions/departments";
import { getMaintenanceTeams } from "@/lib/actions/teams";

export default async function NewEquipmentPage() {
    const { departments } = await getDepartmentOptions();
    const { teams } = await getMaintenanceTeams();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Register New Equipment</h1>
            <EquipmentForm departments={departments || []} teams={teams || []} />
        </div>
    );
}
