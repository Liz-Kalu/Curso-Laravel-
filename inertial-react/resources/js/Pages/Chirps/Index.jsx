import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton";
import {useState} from "react";
import InputError from "@/Components/InputError.jsx";
import ChirpItem from "@/Components/ChirpItem.jsx";

import ChirpForm from "@/Components/ChirpForm.jsx";

export default function Index({ auth, chirps}) {


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Chirps
                </h2>
            }
        >
            <Head title='Chirps'>
                <meta name="description" content="Chirps description" />
            </Head>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ChirpForm />
                        </div>
                    </div>
                    <div className="mt-6 bg-white shadow-md rounded-lg divide-y divide-gray-200">
                        {chirps.map((chirp)=>(
                            <ChirpItem key={`chirps-${chirp.id}`} chirp={chirp}/>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
