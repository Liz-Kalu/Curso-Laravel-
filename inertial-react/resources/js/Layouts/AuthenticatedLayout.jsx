import { Transition } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, createContext, useContext } from 'react';
import { route } from 'ziggy-js';
import { ClipboardList, History, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/Components/ui/sonner';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
};

const Content = ({
                     align = 'right',
                     width = '48',
                     contentClasses = 'py-1 bg-white',
                     children,
                 }) => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    return (
        <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                onClick={() => setOpen(false)}
            >
                <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}>
                    {children}
                </div>
            </div>
        </Transition>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ' +
                className
            }
        >
            {children}
        </Link>
    );
};

const DropdownButton = ({ className = '', children, ...props }) => {
    return (
        <button
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ' +
                className
            }
        >
            {children}
        </button>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
Dropdown.Button = DropdownButton;

function SidebarLink({ href, active, icon: Icon, children, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition duration-150 ease-in-out ' +
                (active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
            }
        >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {children}
        </Link>
    );
}

function SidebarContent({ onNavigate }) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5">
                <img
                    src="/images/escudo-tec.png"
                    alt="Logo ITT"
                    className="h-9 w-9 shrink-0 rounded-lg object-contain"
                />
                <div>
                    <p className="text-sm font-semibold leading-none text-gray-900">ITT</p>
                    <p className="text-xs text-gray-500">Mantenimiento</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {route().has('solicitudes.index') && (
                    <SidebarLink
                        href={route('solicitudes.index')}
                        active={route().current('solicitudes.index')}
                        icon={ClipboardList}
                        onClick={onNavigate}
                    >
                        Solicitudes
                    </SidebarLink>
                )}

                {route().has('solicitudes.historial') && (
                    <SidebarLink
                        href={route('solicitudes.historial')}
                        active={route().current('solicitudes.historial')}
                        icon={History}
                        onClick={onNavigate}
                    >
                        Historial
                    </SidebarLink>
                )}
            </nav>

            <div className="border-t border-gray-100 px-5 py-4">
                <p className="text-xs text-gray-400">Instituto Tecnológico de Tepic</p>
            </div>
        </div>
    );
}

function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { status, error } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);


    useEffect(() => {
        if (status) {
            toast.success(status);
        }

    }, [status]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster />

            <aside
                className={
                    'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-100 bg-white transition-transform duration-200 ease-in-out ' +
                    (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
                }
            >
                <SidebarContent onNavigate={() => setSidebarOpen(false)} />
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div>
                <div className="flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="inline-flex shrink-0 items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                        >
                            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>

                        {header && <div className="min-w-0 truncate">{header}</div>}
                    </div>

                    <div className="shrink-0">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                    >
                                        {user.name}
                                        <svg
                                            className="-me-0.5 ms-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                <main>{children}</main>
            </div>
        </div>
    );
}

export default AuthenticatedLayout;
