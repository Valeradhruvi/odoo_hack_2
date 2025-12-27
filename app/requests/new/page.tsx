import { RequestForm } from "@/components/forms/RequestForm";
import { Suspense } from "react";

export default function NewRequestPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Create Maintenance Request</h1>
            <Suspense fallback={<div>Loading form...</div>}>
                <RequestForm />
            </Suspense>
        </div>
    );
}
