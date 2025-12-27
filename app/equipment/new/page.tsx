import { EquipmentForm } from "@/components/forms/EquipmentForm";

export default function NewEquipmentPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Register New Equipment</h1>
            <EquipmentForm />
        </div>
    );
}
