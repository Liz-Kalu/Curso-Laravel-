import { Toaster as Sonner } from "sonner";

function Toaster(props) {
    return (
        <Sonner
            position="top-right"
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: "rounded-lg border shadow-sm",
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
