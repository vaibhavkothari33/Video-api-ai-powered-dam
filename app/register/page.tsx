"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");

    const router = useRouter();

    const handlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {

            alert("Password do not match")
            return;
        }

        try {
            const res = await fetch("api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            })

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Registration Failed");
            }
            console.log(data);
            router.push("/login");
        }
        catch (error) {
            console.log(error);

        }

    }
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handlSubmit}>
                <input type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input type="password"
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                />

                <button type='submit'>Register</button>

            </form>
            <div>
                <p>
                    Already have a account? <a href='/login'>Login</a>
                </p>
            </div>
        </div>
    )
}

// need to do more loding managing and debouncing

export default RegisterPage