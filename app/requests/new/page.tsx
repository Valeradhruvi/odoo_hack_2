import { RequestForm } from "@/components/forms/RequestForm";
import { getEquipmentList } from "@/lib/actions/equipment";
import { Suspense } from "react";

export default async function NewRequestPage() {
    const equipmentList = await getEquipmentList();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Create Maintenance Request</h1>
            <Suspense fallback={<div>Loading form...</div>}>
                <RequestForm equipmentList={equipmentList} />
            </Suspense>
        </div>
    );
}
