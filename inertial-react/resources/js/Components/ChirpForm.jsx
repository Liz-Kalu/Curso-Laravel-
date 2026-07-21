import { route } from 'ziggy-js';
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useForm} from "@inertiajs/react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";


export default function ChirpForm({chirp, className, setEditing}) {
    const {data,setData,post,patch,reset,errors,processing}=useForm({
        message:chirp ?.message,
    })

    function update(id) {
        patch(route('chirps.update', id), {
            onSuccess: () => {
                setEditing(false);
            },
        });
    }
    function handleSubmit(e) {
        e.preventDefault();
        if(chirp ?.id){
            update(chirp.id)
            return
        }
        post(route('chirps.store'), {
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={handleSubmit} className={className}>
                                <textarea
                                    placeholder="What's on your mind?"
                                    className=" block w-full rounded-md border-gray-300 bg-white text-gray-800"
                                    value={data.message}
                                    onChange={e => setData('message',e.target.value)}>
                                </textarea>
            <InputError message ={errors.message}/>
            <PrimaryButton disabled={processing} className="mt-2">
                {processing ? 'Enviando....':'Chirps'}
            </PrimaryButton>
            <SecondaryButton
                type="button"
                onClick={() => setEditing(false)}
                className="ml-2"
            >
                Cancel
            </SecondaryButton>
        </form>
    )
}

