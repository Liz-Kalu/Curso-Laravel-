import { usePage } from "@inertiajs/react";

export default function __(text) {
    const { translation } = usePage().props;

    const key = Object.keys(translation).find(
        item => item.replace(/\s+/g, '').trim() === text.replace(/\s+/g, '').trim()
    );

    return key ? translation[key] : text;
}
