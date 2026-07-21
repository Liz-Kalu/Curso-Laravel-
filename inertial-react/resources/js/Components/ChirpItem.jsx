import Dropdown from "@/Components/Dropdown.jsx";
import {useState} from "react";
import ChirpForm from "@/Components/ChirpForm.jsx";
import {usePage} from "@inertiajs/react";
import { route } from 'ziggy-js';

export default function ChirpItem({ chirp }) {

    const[editing,setEditing]=useState(false);
    const {auth} =usePage().props
    return (
        <div className="flex items-start p-6">
            <svg
                className="h-6 w-6 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h6m-9 8l2.5-3H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-5 3z"
                />
            </svg>

            <div className="ml-3 flex-1">
                <div className="flex items-center">
                    <span className="text-gray-900 dark:text-gray-600">
                        {chirp.user.name}
                    </span>

                    <small className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {chirp.createdAt}
                    </small>
                    {chirp.edited && (
                    <small className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        &middot; edited
                    </small>
                    )}
                </div>
                {editing ? (
                    <ChirpForm
                        chirp={chirp}
                        className="mt-2"
                         setEditing={setEditing}
                    />
                ) : (
                    <p className="mt-1 text-lg text-gray-900 dark:text-gray-500">
                        {chirp.message}
                    </p>
                )}
            </div>
            {chirp.user.id === auth.user.id &&
                (
                    <Dropdown >
                        <Dropdown.Trigger>
                            <button className="ml-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    className="h-5 w-5"
                                >
                                    <path d="M3 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Button  onClick={()=> setEditing(true)}>
                                Edit
                            </Dropdown.Button>
                            <Dropdown.Link
                                as="button"
                                href={route('chirps.destroy', chirp.id)}
                                method="delete">
                                Delete
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                )
            }

        </div>
    );
}
