import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';

import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef(null);

    const { data, setData, delete: destroy, processing, reset, errors } =
        useForm({
            password: '',
        });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    const deleteUser = (event) => {
        event.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Eliminar cuenta
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Esta accion es permanente y eliminara tu cuenta y sus datos.
                </p>
            </header>

            <DangerButton className="mt-6" onClick={confirmUserDeletion}>
                Eliminar cuenta
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Confirma la eliminacion de tu cuenta
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Ingresa tu contrasena para confirmar esta accion.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Contrasena" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(event) =>
                                setData('password', event.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            Eliminar cuenta
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
