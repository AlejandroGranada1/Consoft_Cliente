"use client"

import AuthLayout from "@/components/auth/AuthLayout"
import AuthInput from "@/components/auth/AuthInput"
import AuthButton from "@/components/auth/AuthButton"

export default function RegisterContinuePage() {
    return (
        <AuthLayout
            title="Ya casi terminas"
            subtitle="Llenemos estos últimos datos para terminar"
            illustration="/auth/Continuacion.png"
        >
            <form className="flex flex-col gap-4">
                <AuthInput label="Dirección" type="text" placeholder="Calle 123 #45-67" />
                <AuthInput label="Teléfono / Celular" type="tel" placeholder="+57 300 000 0000" />
                <AuthInput label="Documento" type="text" placeholder="CC / DNI" />

                <AuthButton
                    text="Finalizar"
                    onClick={() => window.location.href = "/"}
                />
            </form>
        </AuthLayout>
    )
}